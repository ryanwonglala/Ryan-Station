/* StationScene — 会呼吸的昼/夜工坊。
 * L0 天体 / L1 双图 / L2 生命光源 / L3 大气 / L4 SensorField 协同。
 * 无依赖；所有装饰 pointer-events:none；24fps；可见性与性能分级驱动。 */
(function () {
  'use strict';

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  class Atmosphere {
    constructor(canvas, owner) {
      this.canvas = canvas;
      this.owner = owner;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.mode = 'night';
      this.quality = 'high';
      this.running = false;
      this.particles = [];
      this.pulses = [];
      this.dpr = Math.min(window.devicePixelRatio || 1, 1.1);
      this.resize();
    }

    resize() {
      if (!this.ctx || !this.canvas) return;
      const r = this.canvas.getBoundingClientRect();
      this.w = Math.max(1, r.width);
      this.h = Math.max(1, r.height);
      this.canvas.width = Math.round(this.w * this.dpr);
      this.canvas.height = Math.round(this.h * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this._seed();
      if (!this.running) this.draw(performance.now());
    }

    setMode(mode) {
      if (this.mode === mode) return;
      this.mode = mode;
      this._seed();
      if (!this.running) this.draw(performance.now());
    }

    setQuality(quality) {
      this.quality = quality;
      this._seed();
      if (quality === 'static') this.stop();
    }

    _seed() {
      if (!this.w || !this.h) return;
      const mobile = this.w < 720;
      const scale = this.quality === 'low' ? 0.62 : 1;
      const particles = [];
      if (this.quality !== 'static' && this.mode === 'night') {
        const count = Math.max(3, Math.round((mobile ? 4 : 5) * scale));
        for (let i = 0; i < count; i += 1) {
          particles.push({
            kind: 'firefly',
            x: this.w * (0.12 + Math.random() * 0.76),
            y: this.h * (0.55 + Math.random() * 0.30),
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 5,
            r: 1.6 + Math.random(),
            phase: Math.random() * Math.PI * 2,
          });
        }
      } else if (this.quality !== 'static') {
        const dustCount = Math.round((mobile ? 18 : 34) * scale);
        for (let i = 0; i < dustCount; i += 1) {
          const inBeam = Math.random() < 0.72;
          particles.push({
            kind: 'dust',
            x: this.w * (inBeam ? 0.36 + Math.random() * 0.28 : Math.random()),
            y: Math.random() * this.h,
            vy: 3 + Math.random() * 4,
            sway: 4 + Math.random() * 8,
            r: 0.8 + Math.random(),
            phase: Math.random() * Math.PI * 2,
          });
        }
        const petals = mobile ? 2 : 3;
        for (let i = 0; i < petals; i += 1) {
          particles.push({
            kind: 'petal',
            x: Math.random() * this.w,
            y: -Math.random() * this.h,
            vy: 18 + Math.random() * 8,
            sway: 18 + Math.random() * 8,
            spin: (Math.random() - 0.5) * 1.2,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      this.particles = particles;
    }

    pulse(x, y) {
      const now = performance.now();
      const last = this.pulses[this.pulses.length - 1];
      if (last && now - last.started < 1200) {
        last.started = now + 90;
        last.peak = 0.8;
      } else {
        this.pulses.push({ x, y, started: now + 90, peak: 1 });
      }
    }

    start() {
      if (!this.ctx || this.running || this.quality === 'static') return;
      this.running = true;
      this.lastFrame = 0;
      this.slowFrames = 0;
      this.samples = 0;
      const loop = (now) => {
        if (!this.running) return;
        if (now - this.lastFrame >= 1000 / 24) {
          const gap = this.lastFrame ? now - this.lastFrame : 0;
          this.lastFrame = now;
          this.draw(now);
          if (gap && this.samples < 72) {
            this.samples += 1;
            if (gap > 58) this.slowFrames += 1;
            if (this.samples === 72 && this.slowFrames > 24 && this.quality === 'high') this.owner.setQuality('low');
          }
        }
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }

    stop() {
      this.running = false;
      if (this.raf) cancelAnimationFrame(this.raf);
    }

    draw(now) {
      const ctx = this.ctx;
      if (!ctx) return;
      const t = now / 1000;
      ctx.clearRect(0, 0, this.w, this.h);
      ctx.globalCompositeOperation = this.mode === 'night' ? 'lighter' : 'source-over';

      this.particles.forEach((p) => {
        if (p.kind === 'firefly') {
          p.x += p.vx / 24;
          p.y += p.vy / 24;
          if (p.x < 0 || p.x > this.w) p.vx *= -1;
          if (p.y < this.h * 0.54 || p.y > this.h * 0.87) p.vy *= -1;
          const alpha = 0.25 + (Math.sin(t * 0.82 + p.phase) + 1) * 0.185;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
          g.addColorStop(0, `rgba(116,215,232,${alpha})`);
          g.addColorStop(1, 'rgba(116,215,232,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, Math.PI * 2); ctx.fill();
        } else if (p.kind === 'dust') {
          p.y -= p.vy / 24;
          if (p.y < -4) { p.y = this.h + 4; p.x = this.w * (0.36 + Math.random() * 0.28); }
          const x = p.x + Math.sin(t * 0.45 + p.phase) * p.sway;
          ctx.globalAlpha = 0.16 + (Math.sin(t * 0.6 + p.phase) + 1) * 0.09;
          ctx.fillStyle = '#f3dcae';
          ctx.beginPath(); ctx.arc(x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        } else {
          p.y += p.vy / 24;
          if (p.y > this.h + 12) { p.y = -Math.random() * this.h * 0.55; p.x = Math.random() * this.w; }
          const x = p.x + Math.sin(t * 0.8 + p.phase) * p.sway;
          ctx.save(); ctx.translate(x, p.y); ctx.rotate(t * p.spin + p.phase);
          ctx.globalAlpha = 0.3; ctx.fillStyle = '#e8c6c8';
          ctx.beginPath(); ctx.ellipse(0, 0, 3.5, 2.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      });
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      this.pulses = this.pulses.filter((pulse) => {
        const age = (now - pulse.started) / 1000;
        if (age < 0) return true;
        if (age > 1.35) return false;
        const eased = 1 - Math.pow(1 - age / 1.35, 3);
        const radius = eased * (this.w < 720 ? 170 : 260);
        const alpha = (1 - age / 1.35) * 0.11 * pulse.peak;
        ctx.save(); ctx.globalAlpha = alpha; ctx.lineWidth = 44; ctx.filter = 'blur(18px)';
        ctx.strokeStyle = this.mode === 'night' ? '#ced8f0' : '#fff0d6';
        ctx.beginPath(); ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        return true;
      });
    }
  }

  class SceneController {
    constructor(hero, options) {
      this.hero = hero;
      this.root = hero && hero.querySelector('#station-scene');
      this.frame = this.root && this.root.querySelector('.scene-frame');
      this.parallax = this.root && this.root.querySelector('.scene-parallax');
      this.lights = this.root ? Array.from(this.root.querySelectorAll('.scene-light')) : [];
      this.staticMode = Boolean(options && options.static) || reducedMotion();
      this.mode = document.body.classList.contains('light-mode') ? 'day' : 'night';
      this.quality = this.staticMode ? 'static' : 'high';
      this.allowed = false;
      this.inView = true;
      this.sensor = null;
      this.targetX = 0; this.targetY = 0; this.currentX = 0; this.currentY = 0; this.parallaxRAF = null;
      this.atmosphere = new Atmosphere(this.root && this.root.querySelector('#atmosphere-canvas'), this);
      if (!this.root) return;
      this.root.dataset.mode = this.mode;
      this.root.dataset.quality = this.quality;
      if (this.staticMode) this.root.classList.add('is-static');
      this._bind();
      this.resize();
      this._updateCelestial();
    }

    _bind() {
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => this.resize(), 160);
      });
      window.addEventListener('pointermove', (event) => this._pointer(event), { passive: true });
      document.addEventListener('visibilitychange', () => this._sync());
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          this.inView = entries.some((entry) => entry.isIntersecting);
          this._sync();
        }, { threshold: 0.04 });
        this.observer.observe(this.hero);
      }
    }

    attachSensor(field) {
      this.sensor = field;
      field.onDegrade = (level) => this.setQuality(level >= 2 ? 'static' : 'low');
      this._syncAttractors();
    }

    setMode(mode) {
      this.mode = mode === 'day' ? 'day' : 'night';
      if (this.root) this.root.dataset.mode = this.mode;
      this.atmosphere.setMode(this.mode);
      this._updateCelestial();
      this._syncAttractors();
    }

    setAuto(auto) {
      if (this.root) this.root.dataset.auto = auto ? 'true' : 'false';
    }

    setQuality(quality) {
      if (this.staticMode) quality = 'static';
      if (this.quality === quality) return;
      this.quality = quality;
      if (this.root) this.root.dataset.quality = quality;
      this.atmosphere.setQuality(quality);
      if (quality !== 'high') this._clearExcite();
      this._sync();
    }

    setFlow(flow) {
      if (!this.parallax || window.innerWidth >= 1100 || this.staticMode) return;
      const y = clamp(flow * 2.5, -3, 3);
      this.parallax.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }

    pulse(x, y) {
      this.atmosphere.pulse(x, y);
      this.lights.forEach((light) => {
        const dx = light.offsetLeft - x;
        const dy = light.offsetTop - y;
        if (Math.hypot(dx, dy) < 260) {
          light.classList.add('is-pulse-lit');
          setTimeout(() => light.classList.remove('is-pulse-lit'), 240);
        }
      });
    }

    start() {
      this.allowed = true;
      if (this.root) this.root.classList.add('is-live');
      this._sync();
    }

    stop() {
      this.allowed = false;
      this._sync();
    }

    _sync() {
      const active = this.allowed && this.inView && !document.hidden && !this.staticMode;
      if (this.root) this.root.classList.toggle('is-running', active);
      if (active) this.atmosphere.start(); else this.atmosphere.stop();
    }

    resize() {
      this.atmosphere.resize();
      this._syncAttractors();
      if (window.innerWidth < 1100 && this.parallax) this.parallax.style.transform = '';
    }

    _syncAttractors() {
      if (!this.sensor || !this.hero) return;
      const r = this.hero.getBoundingClientRect();
      const points = this.lights.map((light) => ({
        name: light.dataset.light,
        x: light.offsetLeft,
        y: light.offsetTop,
        radius: Math.max(34, light.offsetWidth * 0.42),
      }));
      this.sensor.setAttractors(points, r.width < 720);
    }

    _pointer(event) {
      if (!this.hero || !this.root || this.staticMode || this.quality !== 'high') return;
      const r = this.hero.getBoundingClientRect();
      const inside = event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
      if (!inside) { this._clearExcite(); return; }
      const x = event.clientX - r.left;
      const y = event.clientY - r.top;
      if (window.innerWidth >= 1100) {
        this.targetX = ((x / r.width) - 0.5) * 12;
        this.targetY = ((y / r.height) - 0.5) * 12;
        this._wakeParallax();
      }
      let nearest = null;
      let distance = 130;
      this.lights.forEach((light) => {
        const d = Math.hypot(light.offsetLeft - x, light.offsetTop - y);
        if (d < distance) { distance = d; nearest = light; }
      });
      this.lights.forEach((light) => light.classList.toggle('is-excited', light === nearest));
      if (this.sensor) {
        if (nearest) this.sensor.exciteLight(nearest.offsetLeft, nearest.offsetTop, 1 - distance / 130);
        else this.sensor.exciteLight(-9999, -9999, 0);
      }
    }

    _clearExcite() {
      this.lights.forEach((light) => light.classList.remove('is-excited'));
      if (this.sensor) this.sensor.exciteLight(-9999, -9999, 0);
    }

    _wakeParallax() {
      if (this.parallaxRAF || !this.parallax) return;
      const tick = () => {
        this.currentX += (this.targetX - this.currentX) * 0.08;
        this.currentY += (this.targetY - this.currentY) * 0.08;
        this.parallax.style.transform = `translate3d(${this.currentX.toFixed(2)}px, ${this.currentY.toFixed(2)}px, 0)`;
        if (Math.abs(this.targetX - this.currentX) < 0.05 && Math.abs(this.targetY - this.currentY) < 0.05) {
          this.currentX = this.targetX; this.currentY = this.targetY; this.parallaxRAF = null; return;
        }
        this.parallaxRAF = requestAnimationFrame(tick);
      };
      this.parallaxRAF = requestAnimationFrame(tick);
    }

    _updateCelestial() {
      if (!this.root) return;
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      const hour = Number(parts.find((p) => p.type === 'hour').value);
      const minute = Number(parts.find((p) => p.type === 'minute').value);
      const total = hour * 60 + minute;
      const start = this.mode === 'day' ? 420 : 1110;
      const span = this.mode === 'day' ? 690 : 750;
      const elapsed = this.mode === 'day' ? total - start : (total >= start ? total - start : total + 1440 - start);
      const progress = clamp(elapsed / span, 0, 1);
      this.root.style.setProperty('--celestial-x', `${22 + progress * 9}%`);
      this.root.style.setProperty('--celestial-y', `${20 + Math.sin(progress * Math.PI) * 10}%`);
    }
  }

  let active = null;
  window.StationScene = {
    init(hero, options) { active = new SceneController(hero, options || {}); return active; },
    setMode(mode) { if (active) active.setMode(mode); },
    setAuto(auto) { if (active) active.setAuto(auto); },
    setQuality(quality) { if (active) active.setQuality(quality); },
    start() { if (active) active.start(); },
    stop() { if (active) active.stop(); },
    get active() { return active; },
  };
})();
