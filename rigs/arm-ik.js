/* Planar CCD IK for RA-01. Same viewBox as the About blueprint.
 * No animation loop — redraws only while the gripper is dragged. */
(function () {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const BASE = { x: 200, y: 415 };
  const L = [95, 177, 153, 72, 70];
  const HOME = [-Math.PI / 2, 0.865, 1.037, -0.543, -0.008];
  const LIMITS = [
    [-2.4, 2.4],
    [-2.1, 2.1],
    [-2.2, 2.3],
    [-2.0, 2.0],
    [-1.6, 1.6],
  ];

  const t = (path, fallback) => {
    const v = window.PortfolioI18n && window.PortfolioI18n.t(path);
    return v !== undefined && v !== '' ? v : (fallback || '');
  };
  const reducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const wrap = (a) => {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  };
  const deg = (rad) => Math.round((rad * 180) / Math.PI);

  const fk = (angles) => {
    let x = BASE.x;
    let y = BASE.y;
    let a = 0;
    const pts = [{ x, y }];
    for (let i = 0; i < L.length; i += 1) {
      a += angles[i];
      x += L[i] * Math.cos(a);
      y += L[i] * Math.sin(a);
      pts.push({ x, y });
    }
    return { pts, heading: a };
  };

  const ccd = (angles, target) => {
    const next = angles.slice();
    for (let iter = 0; iter < 10; iter += 1) {
      for (let i = L.length - 1; i >= 0; i -= 1) {
        const { pts } = fk(next);
        const joint = pts[i];
        const ee = pts[pts.length - 1];
        const toEE = Math.atan2(ee.y - joint.y, ee.x - joint.x);
        const toT = Math.atan2(target.y - joint.y, target.x - joint.x);
        next[i] += wrap(toT - toEE);
        next[i] = clamp(next[i], HOME[i] + LIMITS[i][0], HOME[i] + LIMITS[i][1]);
      }
    }
    return next;
  };

  const svgEl = (name, attrs) => {
    const el = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
    return el;
  };

  const instances = [];

  const svgPoint = (svg, clientX, clientY) => {
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(ctm.inverse());
  };

  const mount = (host, opts) => {
    if (!host || host._armIk) return host._armIk;
    const variant = (opts && opts.variant) || 'case';
    const angles = HOME.slice();
    const state = { host, variant, angles, dragging: false, svg: null, hud: null };

    let svg;
    if (variant === 'blueprint') {
      svg = host.querySelector('.bp-svg');
      if (!svg) return null;
      host.classList.add('is-ik');
    } else {
      host.innerHTML = '';
      svg = svgEl('svg', {
        class: 'arm-ik-svg',
        viewBox: '0 0 760 540',
        role: 'img',
        'aria-hidden': 'true',
      });
      svg.appendChild(svgEl('rect', { class: 'arm-ik-paper', x: '14', y: '14', width: '732', height: '512' }));
      const grid = svgEl('path', {
        class: 'arm-ik-grid',
        d: 'M14 14 H746 M14 114 H746 M14 214 H746 M14 314 H746 M14 414 H746 M14 514 H746 M14 14 V526 M114 14 V526 M214 14 V526 M314 14 V526 M414 14 V526 M514 14 V526 M614 14 V526 M714 14 V526',
      });
      svg.appendChild(grid);
      svg.setAttribute('viewBox', '70 140 680 380');
      host.appendChild(svg);
    }

    const layer = svgEl('g', { class: 'arm-ik-layer' });
    const baseG = svgEl('g', { class: 'arm-ik-mount' });
    baseG.appendChild(svgEl('path', { class: 'arm-ik-mount-line', d: 'M110 470 H290' }));
    baseG.appendChild(svgEl('path', { class: 'arm-ik-mount-line', d: 'M140 470 V452 H260 V470' }));
    baseG.appendChild(svgEl('path', { class: 'arm-ik-mount-hatch', d: 'M120 470 l-10 10 M140 470 l-10 10 M160 470 l-10 10 M180 470 l-10 10 M200 470 l-10 10 M220 470 l-10 10 M240 470 l-10 10 M260 470 l-10 10 M280 470 l-10 10' }));
    const shadow = svgEl('polyline', { class: 'arm-ik-shadow' });
    const links = svgEl('polyline', { class: 'arm-ik-links' });
    const joints = svgEl('g', { class: 'arm-ik-joints' });
    const grip = svgEl('g', { class: 'arm-ik-grip' });
    const jawA = svgEl('path', { class: 'arm-ik-jaw' });
    const jawB = svgEl('path', { class: 'arm-ik-jaw' });
    const handle = svgEl('circle', { class: 'arm-ik-handle', r: '11' });
    grip.appendChild(jawA);
    grip.appendChild(jawB);
    grip.appendChild(handle);
    const hit = svgEl('rect', {
      class: 'arm-ik-hit',
      x: '14',
      y: '14',
      width: '732',
      height: '512',
      fill: 'transparent',
    });
    const PADS = variant === 'blueprint' ? [
      { id: 'work', href: '#work', x: 668, y: 72 },
      { id: 'journey', href: '#journey', x: 708, y: 168 },
      { id: 'contact', href: '#contact', x: 668, y: 348 },
    ] : [];
    const padLayer = svgEl('g', { class: 'arm-ik-pads' });
    const padNodes = PADS.map((pad) => {
      const g = svgEl('g', { class: 'arm-ik-pad', transform: 'translate(' + pad.x + ' ' + pad.y + ')' });
      g.appendChild(svgEl('rect', { class: 'arm-ik-pad-card', x: '-54', y: '-22', width: '108', height: '44', rx: '4' }));
      const label = svgEl('text', { class: 'arm-ik-pad-label', x: '0', y: '5', 'text-anchor': 'middle' });
      label.textContent = t('rigs.pad' + pad.id.charAt(0).toUpperCase() + pad.id.slice(1), pad.id);
      g.appendChild(label);
      padLayer.appendChild(g);
      return g;
    });
    if (variant === 'case') layer.appendChild(baseG);
    layer.appendChild(shadow);
    layer.appendChild(links);
    layer.appendChild(joints);
    layer.appendChild(grip);
    if (PADS.length) layer.appendChild(padLayer);
    layer.appendChild(hit);
    svg.appendChild(layer);

    for (let i = 0; i < L.length + 1; i += 1) {
      const g = svgEl('g', { class: 'arm-ik-joint' });
      g.appendChild(svgEl('circle', { class: 'arm-ik-joint-outer', r: String(i === 0 ? 16 : 11) }));
      g.appendChild(svgEl('circle', { class: 'arm-ik-joint-inner', r: String(i === 0 ? 5.5 : 4) }));
      joints.appendChild(g);
    }

    const hud = document.createElement('div');
    hud.className = 'arm-ik-hud';
    hud.innerHTML =
      '<p class="arm-ik-hint"></p>' +
      '<p class="arm-ik-readout" aria-live="polite"></p>' +
      '<button type="button" class="arm-ik-home" data-lock-label="Home pose"></button>';
    if (variant === 'blueprint') host.appendChild(hud);
    else host.appendChild(hud);

    const hintEl = hud.querySelector('.arm-ik-hint');
    const readout = hud.querySelector('.arm-ik-readout');
    const homeBtn = hud.querySelector('.arm-ik-home');

    const paintHud = () => {
      if (hintEl) {
        hintEl.textContent = variant === 'case'
          ? t('rigs.armCaseHint', 'This is the hand from that week. Tucking it away is home pose.')
          : t('rigs.armHint', 'Drag onto a stop');
      }
      if (homeBtn) homeBtn.textContent = t('rigs.armHome', 'Tuck away');
      padNodes.forEach((g, i) => {
        const label = g.querySelector('text');
        if (label) {
          const pad = PADS[i];
          const key = 'rigs.pad' + pad.id.charAt(0).toUpperCase() + pad.id.slice(1);
          label.textContent = t(key, pad.id);
        }
      });
      if (readout && variant === 'case') {
        readout.textContent = state.angles
          .map((a, i) => 'J' + (i + 1) + ' ' + (deg(a) >= 0 ? '+' : '') + deg(a) + '°')
          .join('   ');
      } else if (readout) {
        readout.textContent = '';
      }
    };

    const draw = () => {
      const { pts, heading } = fk(state.angles);
      const points = pts.map((p) => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ');
      links.setAttribute('points', points);
      shadow.setAttribute('points', points);
      const jointNodes = joints.children;
      pts.forEach((p, i) => {
        if (jointNodes[i]) jointNodes[i].setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
      });
      const ee = pts[pts.length - 1];
      grip.setAttribute('transform', 'translate(' + ee.x + ' ' + ee.y + ') rotate(' + (heading * 180) / Math.PI + ')');
      jawA.setAttribute('d', 'M 8 -4 L 28 -9 L 30 -4 L 10 1 Z');
      jawB.setAttribute('d', 'M 8 4 L 28 9 L 30 4 L 10 -1 Z');
      handle.setAttribute('cx', '0');
      handle.setAttribute('cy', '0');
      padNodes.forEach((g, i) => {
        const pad = PADS[i];
        const dx = ee.x - pad.x;
        const dy = ee.y - pad.y;
        g.classList.toggle('is-hot', dx * dx + dy * dy < 58 * 58);
      });
      paintHud();
    };

    const nearGrip = (p) => {
      const ee = fk(state.angles).pts[L.length];
      const dx = p.x - ee.x;
      const dy = p.y - ee.y;
      return dx * dx + dy * dy < 46 * 46;
    };

    const onDown = (e) => {
      const p = svgPoint(svg, e.clientX, e.clientY);
      if (!p) return;
      if (!nearGrip(p) && e.target !== handle) {
        // still allow grabbing anywhere on the paper once the arm is live
        if (variant === 'blueprint' && !host.classList.contains('is-live')) return;
      }
      state.dragging = true;
      host.classList.add('is-live', 'is-dragging');
      hit.setPointerCapture(e.pointerId);
      state.angles = ccd(state.angles, p);
      draw();
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!state.dragging) return;
      const p = svgPoint(svg, e.clientX, e.clientY);
      if (!p) return;
      state.angles = ccd(state.angles, p);
      draw();
    };
    const goStop = (href) => {
      const a = document.querySelector('a[href="' + href + '"]');
      if (a) a.click();
      else {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
      }
    };

    const onUp = (e) => {
      if (!state.dragging) return;
      state.dragging = false;
      host.classList.remove('is-dragging');
      try { hit.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
      if (variant !== 'blueprint') return;
      const ee = fk(state.angles).pts[L.length];
      let hitPad = null;
      let best = 58 * 58;
      PADS.forEach((pad) => {
        const dx = ee.x - pad.x;
        const dy = ee.y - pad.y;
        const d = dx * dx + dy * dy;
        if (d < best) { best = d; hitPad = pad; }
      });
      if (hitPad) goStop(hitPad.href);
    };

    hit.addEventListener('pointerdown', onDown);
    hit.addEventListener('pointermove', onMove);
    hit.addEventListener('pointerup', onUp);
    hit.addEventListener('pointercancel', onUp);
    homeBtn.addEventListener('click', () => {
      state.angles = HOME.slice();
      host.classList.add('is-live');
      draw();
    });

    const onLang = () => paintHud();
    if (window.PortfolioI18n) window.PortfolioI18n.onChange(onLang);

    state.svg = svg;
    state.hud = hud;
    state.draw = draw;
    state.destroy = () => {
      hit.removeEventListener('pointerdown', onDown);
      hit.removeEventListener('pointermove', onMove);
      hit.removeEventListener('pointerup', onUp);
      hit.removeEventListener('pointercancel', onUp);
      if (layer.parentNode) layer.parentNode.removeChild(layer);
      if (hud.parentNode) hud.parentNode.removeChild(hud);
      host.classList.remove('is-ik', 'is-live', 'is-dragging');
      host._armIk = null;
    };

    host._armIk = state;
    instances.push(state);
    if (variant === 'blueprint' && reducedMotion()) host.classList.add('is-live');
    draw();
    return state;
  };

  const unmount = (root) => {
    for (let i = instances.length - 1; i >= 0; i -= 1) {
      const inst = instances[i];
      if (!root || root === inst.host || (root.contains && root.contains(inst.host))) {
        inst.destroy();
        instances.splice(i, 1);
      }
    }
  };

  window.ArmIK = { mount, unmount };
})();
