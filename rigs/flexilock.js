/* FlexiLock — vacuum scale-jamming toy. No loop; redraws on input. */
(function () {
  'use strict';

  const t = (path, fallback) => {
    const v = window.PortfolioI18n && window.PortfolioI18n.t(path);
    return v !== undefined && v !== '' ? v : (fallback || '');
  };
  const NS = 'http://www.w3.org/2000/svg';
  const SCALE_N = 9;
  const instances = [];

  const svgEl = (name, attrs) => {
    const el = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach((k) => el.setAttribute(k, attrs[k]));
    return el;
  };

  const mount = (host) => {
    if (!host || host._flexi) return host._flexi;
    host.classList.add('flexi-rig');

    const svg = svgEl('svg', { class: 'flexi-svg', viewBox: '0 0 360 240', 'aria-hidden': 'true' });
    const sleeve = svgEl('g', { class: 'flexi-sleeve' });
    const scales = [];
    for (let i = 0; i < SCALE_N; i += 1) {
      const g = svgEl('g', { class: 'flexi-scale' });
      const y = 38 + i * 16;
      g.appendChild(svgEl('path', {
        class: 'flexi-scale-body',
        d: 'M0 -11 L28 -7 L34 0 L28 7 L0 11 L6 0 Z',
      }));
      g.setAttribute('data-y', String(y));
      sleeve.appendChild(g);
      scales.push(g);
    }
    const envelope = svgEl('path', {
      class: 'flexi-envelope',
      d: 'M118 28 C 118 28, 132 18, 168 18 C 210 18, 228 32, 232 48 L 238 188 C 240 208, 214 222, 168 222 C 122 222, 100 208, 102 188 Z',
    });
    const weight = svgEl('g', { class: 'flexi-weight' });
    const cord = svgEl('line', { class: 'flexi-cord', x1: '176', y1: '210', x2: '176', y2: '228' });
    const mass = svgEl('rect', { class: 'flexi-mass', x: '154', y: '226', width: '44', height: '22', rx: '2' });
    const massLabel = svgEl('text', { class: 'flexi-mass-label', x: '176', y: '241', 'text-anchor': 'middle' });
    massLabel.textContent = '10 kg';
    weight.appendChild(cord);
    weight.appendChild(mass);
    weight.appendChild(massLabel);

    svg.appendChild(envelope);
    svg.appendChild(sleeve);
    svg.appendChild(weight);
    host.appendChild(svg);

    const hud = document.createElement('div');
    hud.className = 'flexi-hud';
    hud.innerHTML =
      '<label class="flexi-label"><span class="flexi-hint"></span>' +
      '<input class="flexi-range" type="range" min="0" max="60" value="0" step="1"></label>' +
      '<p class="flexi-readout" aria-live="polite"></p>' +
      '<span class="flexi-stiff" aria-hidden="true"><i></i></span>';
    host.appendChild(hud);

    const range = hud.querySelector('.flexi-range');
    const readout = hud.querySelector('.flexi-readout');
    const hint = hud.querySelector('.flexi-hint');
    const stiff = hud.querySelector('.flexi-stiff i');

    const paintCopy = () => {
      if (hint) hint.textContent = t('rigs.flexiHint', 'Pull vacuum');
    };

    const draw = (kpa) => {
      const p = Math.max(0, Math.min(60, Number(kpa) || 0)) / 60;
      scales.forEach((g, i) => {
        const y = Number(g.getAttribute('data-y'));
        const jam = p * (i % 2 === 0 ? 18 : -18);
        const overlap = 6 * p;
        g.setAttribute('transform', 'translate(142 ' + (y + overlap) + ') rotate(' + jam + ')');
        g.style.opacity = String(0.55 + 0.45 * p);
      });
      host.style.setProperty('--flexi-p', p.toFixed(3));
      host.classList.toggle('is-locked', p > 0.85);
      if (stiff) stiff.style.transform = 'scaleX(' + p + ')';
      if (readout) {
        const feel = p > 0.82 ? t('rigs.flexiRigid', 'rigid') : t('rigs.flexiSoft', 'soft');
        readout.textContent = '−' + Math.round(p * 60) + ' kPa  ·  ' + feel;
      }
      paintCopy();
    };

    range.addEventListener('input', () => draw(range.value));
    const onLang = () => draw(range.value);
    if (window.PortfolioI18n) window.PortfolioI18n.onChange(onLang);

    const state = {
      host,
      destroy: () => {
        range.removeEventListener('input', () => draw(range.value));
        host.classList.remove('flexi-rig');
        host.innerHTML = '';
        host._flexi = null;
      },
    };
    host._flexi = state;
    instances.push(state);
    draw(0);
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

  window.FlexiLock = { mount, unmount };
})();
