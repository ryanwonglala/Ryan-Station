/* SensorField — 夜行车站首屏点场引擎。
 * 无依赖：优先 WebGL（动画全部在着色器内完成，CPU 每帧仅更新 uniform），
 * 不可用时回退 Canvas 2D（含光标连线），再不可用由 CSS 渐变兜底。
 * API: mount / setPointer / pulse / setTheme / setFlow / start / stop / resize / destroy
 * 坐标系：CSS 像素；内部换算 devicePixels。 */
(function () {
  'use strict';

  const VERT = `
attribute vec2 a_pos;
attribute vec3 a_meta; // x: seed, y: layer(0 sky /1 mid /2 floor), z: tint
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_flow;      // 滚动驱动的整体流速
uniform vec3 u_pulse;      // x, y, t0
uniform float u_theme;     // 0 night / 1 day
varying float v_glow;
varying float v_tint;
varying float v_alpha;

void main() {
  float seed = a_meta.x;
  float layer = a_meta.y;
  float t = u_time * (0.35 + fract(seed * 7.31) * 0.5);

  vec2 p = a_pos;
  // 层漂移：地面层横移最快（驶过的风景），中层慢，天空近乎静止
  float driftSpeed = layer == 2.0 ? 26.0 : (layer == 1.0 ? 9.0 : 2.2);
  p.x += u_time * driftSpeed * (0.35 + u_flow * 3.0) * (fract(seed * 3.7) > 0.5 ? 1.0 : -1.0) * (layer == 2.0 ? 1.0 : 0.35);
  p.y += sin(t + seed * 6.2831) * (layer == 2.0 ? 2.0 : 7.0);
  // 环绕
  vec2 res = u_res;
  p = mod(p + res, res);

  // 光标激发
  vec2 d = p - u_mouse;
  float dist = length(d);
  float excite = smoothstep(190.0, 0.0, dist);

  // 脉冲涟漪
  float ring = 0.0;
  float age = u_time - u_pulse.z;
  if (u_pulse.z > 0.0 && age < 1.6 && age >= 0.0) {
    float r = age * 520.0;
    ring = smoothstep(46.0, 0.0, abs(length(p - u_pulse.xy) - r)) * (1.0 - age / 1.6);
  }

  // 雷达扫掠扇区（绕光标旋转的窄扇形）
  float ang = atan(d.x, d.y);
  float sweepAng = mod(u_time * 1.1, 6.2831);
  float sweep = smoothstep(0.30, 0.0, abs(ang - sweepAng)) * smoothstep(320.0, 90.0, dist) * 0.5;

  v_glow = clamp(excite + ring + sweep, 0.0, 1.0);
  v_tint = a_meta.z;
  v_alpha = layer == 0.0 ? 0.55 : (layer == 1.0 ? 0.8 : 0.9);

  vec2 clip = (p / res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  float size = (layer == 2.0 ? 2.0 : 1.6) + v_glow * 2.6 + fract(seed * 5.13) * 1.4;
  gl_PointSize = size * __DPR__;
}
`;

  const FRAG = `
precision mediump float;
varying float v_glow;
varying float v_tint;
varying float v_alpha;
uniform float u_theme;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.12, d);

  vec3 amber = vec3(0.851, 0.647, 0.329);
  vec3 paper = vec3(0.918, 0.898, 0.839);
  vec3 cyan  = vec3(0.455, 0.843, 0.910);
  vec3 ink   = vec3(0.180, 0.170, 0.140);

  vec3 base = u_theme < 0.5
    ? mix(mix(paper, amber, 0.55), cyan, step(0.93, v_tint))
    : mix(mix(ink, vec3(0.659, 0.455, 0.125), 0.5), vec3(0.055, 0.486, 0.580), step(0.93, v_tint));

  float alpha = soft * v_alpha * (u_theme < 0.5 ? (0.34 + v_glow * 0.66) : (0.30 + v_glow * 0.55));
  gl_FragColor = vec4(base * (0.85 + v_glow * 0.9), alpha);
}
`;

  function SensorField(canvas, options) {
    const opts = options || {};
    this.canvas = canvas;
    this.dpr = Math.min(window.devicePixelRatio || 1, opts.maxDPR || 1.1);
    this.pointer = { x: -9999, y: -9999 };
    this.pulseData = { x: 0, y: 0, t0: -10 };
    this.flow = 0;
    this.theme = 0;
    this.running = false;
    this.startedAt = 0;
    this.mode = 'none';
    this.onMode = opts.onMode || function () {};
    this._init();
  }

  SensorField.prototype._density = function () {
    const area = window.innerWidth * window.innerHeight;
    const mobile = window.innerWidth < 720;
    const base = mobile ? 220 : 520;
    return Math.max(140, Math.min(800, Math.round(base * Math.min(1.35, area / 1250000 + 0.55))));
  };

  SensorField.prototype._generatePoints = function (n) {
    // 三层分布：天空稀疏 / 中层结构（灯柱、桁架）/ 地面密集带
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pos = new Float32Array(n * 2);
    const meta = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r1 = Math.random();
      let layer;
      let x = Math.random() * w;
      let y;
      if (r1 < 0.30) {
        layer = 0; // sky
        y = Math.random() * h * 0.52;
      } else if (r1 < 0.66) {
        layer = 1; // mid structures
        y = h * (0.42 + Math.random() * 0.28);
        // 灯柱簇
        if (Math.random() < 0.42) {
          const lampX = (Math.round(Math.random() * 6) / 6) * w;
          x = lampX + (Math.random() - 0.5) * 30;
          y = h * (0.38 + Math.random() * 0.3);
        }
      } else {
        layer = 2; // floor
        y = h * (0.74 + Math.random() * 0.24);
      }
      pos[i * 2] = x;
      pos[i * 2 + 1] = y;
      meta[i * 3] = Math.random();
      meta[i * 3 + 1] = layer;
      meta[i * 3 + 2] = Math.random();
    }
    return { pos, meta };
  };

  SensorField.prototype._init = function () {
    const gl = this.canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) { this._initCanvas2D(); return; }
    try {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, VERT.replace('__DPR__', this.dpr.toFixed(2)));
      gl.compileShader(vs);
      if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) throw new Error('vert: ' + gl.getShaderInfoLog(vs));
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, FRAG);
      gl.compileShader(fs);
      if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) throw new Error('frag: ' + gl.getShaderInfoLog(fs));
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(prog));
      this.gl = gl;
      this.prog = prog;
      this.aPos = gl.getAttribLocation(prog, 'a_pos');
      this.aMeta = gl.getAttribLocation(prog, 'a_meta');
      this.u = {
        res: gl.getUniformLocation(prog, 'u_res'),
        mouse: gl.getUniformLocation(prog, 'u_mouse'),
        time: gl.getUniformLocation(prog, 'u_time'),
        flow: gl.getUniformLocation(prog, 'u_flow'),
        pulse: gl.getUniformLocation(prog, 'u_pulse'),
        theme: gl.getUniformLocation(prog, 'u_theme'),
      };
      this.mode = 'webgl';
      gl.enable(gl.BLEND);
      this.onMode('webgl');
      this.resize();
    } catch (e) {
      this._initCanvas2D();
    }
  };

  SensorField.prototype._initCanvas2D = function () {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) { this.mode = 'none'; this.onMode('none'); return; }
    this.ctx2d = ctx;
    this.mode = 'canvas2d';
    this.onMode('canvas2d');
    this.resize();
  };

  SensorField.prototype.resize = function () {
    const w = window.innerWidth;
    const h = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    const n = this._density();
    const data = this._generatePoints(n);
    this.points = data;
    this.n = n;
    if (this.mode === 'webgl' && this.gl) {
      const gl = this.gl;
      if (!this.bufPos) this.bufPos = gl.createBuffer();
      if (!this.bufMeta) this.bufMeta = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
      gl.bufferData(gl.ARRAY_BUFFER, data.pos, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufMeta);
      gl.bufferData(gl.ARRAY_BUFFER, data.meta, gl.DYNAMIC_DRAW);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    } else if (this.mode === 'canvas2d') {
      this.ctx2d.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
    // 单帧渲染（供静态模式）
    if (!this.running) this.renderFrame(perfNow());
  };

  SensorField.prototype.setPointer = function (x, y) {
    this.pointer.x = x;
    this.pointer.y = y;
  };

  SensorField.prototype.pulse = function (x, y) {
    this.pulseData = { x, y, t0: perfNow() - this.startedAt };
    if (this.mode === 'canvas2d') this._c2dPulse = { x, y, t0: performance.now() };
  };

  SensorField.prototype.setFlow = function (f) {
    this.flow = Math.max(-1.5, Math.min(1.5, f));
  };

  SensorField.prototype.setTheme = function (light) {
    this.theme = light ? 1 : 0;
  };

  function perfNow() {
    return (performance.now() % 100000) / 1000;
  }

  SensorField.prototype.renderFrame = function (tNow) {
    if (this.mode === 'webgl' && this.gl) {
      const gl = this.gl;
      const t = tNow - this.startedAt;
      gl.useProgram(this.prog);
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.uniform2f(this.u.res, this.w, this.h);
      gl.uniform2f(this.u.mouse, this.pointer.x, this.pointer.y);
      gl.uniform1f(this.u.time, Math.max(0, t));
      gl.uniform1f(this.u.flow, this.flow);
      gl.uniform3f(this.u.pulse, this.pulseData.x, this.pulseData.y, this.pulseData.t0);
      gl.uniform1f(this.u.theme, this.theme);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
      gl.enableVertexAttribArray(this.aPos);
      gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.bufMeta);
      gl.enableVertexAttribArray(this.aMeta);
      gl.vertexAttribPointer(this.aMeta, 3, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, this.n);
    } else if (this.mode === 'canvas2d') {
      this._render2D(tNow);
    }
  };

  /* Canvas 2D 回退：点 + 光标近邻连线 + 涟漪 */
  SensorField.prototype._render2D = function (tNow) {
    const ctx = this.ctx2d;
    if (!ctx || !this.points) return;
    const t = tNow;
    const { pos, meta } = this.points;
    const n = this.n;
    const w = this.w;
    const h = this.h;
    ctx.clearRect(0, 0, w, h);
    const light = this.theme === 1;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const layer = meta[i * 3 + 1];
      const drift = layer === 2 ? 18 : (layer === 1 ? 6 : 1.5);
      let x = (pos[i * 2] + t * drift * (0.4 + this.flow * 2.5) + w * 4) % w;
      let y = pos[i * 2 + 1] + Math.sin(t * 0.7 + meta[i * 3] * 6.28) * 3;
      pts.push({ x, y, layer, seed: meta[i * 3] });
      const d = Math.hypot(x - this.pointer.x, y - this.pointer.y);
      const glow = Math.max(0, 1 - d / 190);
      const size = (layer === 2 ? 1.8 : 1.3) + glow * 2;
      ctx.globalAlpha = (layer === 0 ? 0.5 : 0.8) * (light ? 0.5 : 0.6) + glow * 0.4;
      ctx.fillStyle = glow > 0.25 ? (light ? '#a87420' : '#d9a554') : (light ? '#3a352c' : '#cfc9b8');
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }
    // 近邻连线
    ctx.globalAlpha = 1;
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = light ? 'rgba(168,116,32,0.35)' : 'rgba(217,165,84,0.35)';
    let links = 0;
    for (let i = 0; i < n && links < 34; i++) {
      const p = pts[i];
      const d = Math.hypot(p.x - this.pointer.x, p.y - this.pointer.y);
      if (d < 170) {
        ctx.beginPath();
        ctx.moveTo(this.pointer.x, this.pointer.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        links++;
      }
    }
    // 涟漪
    if (this._c2dPulse) {
      const age = (performance.now() - this._c2dPulse.t0) / 1000;
      if (age < 1.4) {
        ctx.globalAlpha = 1 - age / 1.4;
        ctx.strokeStyle = light ? 'rgba(168,116,32,0.5)' : 'rgba(217,165,84,0.6)';
        ctx.beginPath();
        ctx.arc(this._c2dPulse.x, this._c2dPulse.y, age * 420, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        this._c2dPulse = null;
      }
    }
    ctx.globalAlpha = 1;
  };

  SensorField.prototype.start = function () {
    if (this.mode === 'none' || this.running) return;
    this.running = true;
    this.startedAt = perfNow();
    // 24fps 节流：点场是氛围层，无需满帧率；为合成器留出预算
    const FRAME_MS = 1000 / 24;
    let last = 0;
    // 自适应质量：前 ~2.5s 采样帧间隔，持续过慢则逐级降级（减点 → 静态帧）
    let samples = 0;
    let slowSamples = 0;
    this._degrades = 0;
    const loop = (ts) => {
      if (!this.running) return;
      if (ts - last >= FRAME_MS) {
        const gap = ts - last;
        last = ts;
        this.renderFrame(perfNow());
        if (samples < 90) {
          samples += 1;
          if (samples > 12 && gap > 90) slowSamples += 1;
          if (samples === 60 || samples === 90) {
            if (slowSamples > samples * 0.34) this._degrade();
          }
        }
      }
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  };

  // 降级：先减点数，再退到静态帧
  SensorField.prototype._degrade = function () {
    this._degrades = (this._degrades || 0) + 1;
    if (this._degrades === 1 && this.n > 240) {
      const keep = Math.max(200, Math.floor(this.n * 0.55));
      if (this.mode === 'webgl' && this.gl) {
        // 重建缓冲区（截断前 keep 个点）
        const gl = this.gl;
        this.points.pos = this.points.pos.slice(0, keep * 2);
        this.points.meta = this.points.meta.slice(0, keep * 3);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
        gl.bufferData(gl.ARRAY_BUFFER, this.points.pos, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufMeta);
        gl.bufferData(gl.ARRAY_BUFFER, this.points.meta, gl.DYNAMIC_DRAW);
      }
      this.n = keep;
    } else if (this._degrades >= 2) {
      // 仍然过慢：停在静态帧，页面其余动画不再受拖累
      this.stop();
      this.renderFrame(perfNow());
    }
  };

  SensorField.prototype.stop = function () {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  };

  SensorField.prototype.destroy = function () {
    this.stop();
    if (this.gl) {
      const lose = this.gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }
  };

  window.SensorField = SensorField;
})();
