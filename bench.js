/* StationBench — the workshop illustration is a spatial index.
 * Hotspots lock the reticle, pulse the matching lamp, then jump
 * to a case / section. Mobile uses the chip strip instead. */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const t = (path, fallback) => {
    const v = window.PortfolioI18n && window.PortfolioI18n.t(path);
    return v !== undefined && v !== '' ? v : (fallback || '');
  };

  const TARGETS = [
    { id: 'arm', action: 'case', caseId: 'arm-challenge', light: 'lamp' },
    { id: 'laptop', action: 'case', caseId: 'roboinspect', light: 'lamp' },
    { id: 'tools', action: 'case', caseId: 'flexilock' },
    { id: 'rack', action: 'case', caseId: 'security-robot', light: 'rack' },
    { id: 'neon', action: 'section', href: '#about', light: 'ryan' },
    { id: 'window', action: 'section', href: '#journey', light: 'window' },
    { id: 'lamp', action: 'theme', light: 'lamp' },
    { id: 'crate', action: 'music' },
  ];

  const labelOf = (id) => t('bench.' + id, id);
  const telOf = (id) => t('bench.' + id + 'Tel', '');
  const lockPhrase = (id) => {
    const short = t('bench.' + id + 'Lock', labelOf(id));
    return (t('bench.lock', 'LOCK') + ' · ' + short).toUpperCase();
  };

  const pulseLight = (name) => {
    if (!name) return;
    const el = $('.scene-light-' + name);
    if (!el) return;
    el.classList.remove('is-excited');
    void el.offsetWidth;
    el.classList.add('is-excited');
    window.setTimeout(() => el.classList.remove('is-excited'), 520);
  };

  const pulseField = (btn) => {
    const field = window.heroField || null;
    const scene = window.stationScene || null;
    const r = btn.getBoundingClientRect();
    const canvas = $('#sensor-canvas');
    if (!canvas) return;
    const cr = canvas.getBoundingClientRect();
    const x = r.left + r.width / 2 - cr.left;
    const y = r.top + r.height / 2 - cr.top;
    if (window.SensorField && field && field.pulse) field.pulse(x, y);
    if (scene && scene.pulse) scene.pulse(x, y);
  };

  const run = (spec, btn) => {
    if (window.StationLED && window.StationLED.announce) {
      window.StationLED.announce(lockPhrase(spec.id));
    }
    pulseLight(spec.light);
    if (btn) {
      btn.classList.add('is-powered');
      window.setTimeout(() => btn.classList.remove('is-powered'), 700);
      pulseField(btn);
    }

    if (spec.action === 'case' && window.StationWork && window.StationWork.openById) {
      window.StationWork.openById(spec.caseId, btn);
      return;
    }
    if (spec.action === 'section' && spec.href) {
      const a = document.querySelector('a[href="' + spec.href + '"]');
      if (a) a.click();
      else {
        const target = document.querySelector(spec.href);
        if (target) target.scrollIntoView({ behavior: 'auto' });
      }
      return;
    }
    if (spec.action === 'theme') {
      const toggle = $('#theme-toggle');
      if (toggle) toggle.click();
      return;
    }
    if (spec.action === 'music') {
      const trigger = $('#music-trigger');
      if (trigger) trigger.click();
    }
  };

  const fillChip = (el, spec) => {
    const name = el.querySelector('[data-bench-name]');
    const tel = el.querySelector('[data-bench-tel]');
    if (name) name.textContent = labelOf(spec.id);
    if (tel) tel.textContent = telOf(spec.id);
    el.setAttribute('data-lock-label', labelOf(spec.id));
    el.setAttribute('aria-label', labelOf(spec.id) + (telOf(spec.id) ? ' — ' + telOf(spec.id) : ''));
  };

  const paint = () => {
    TARGETS.forEach((spec) => {
      $$('[data-bench="' + spec.id + '"]').forEach((el) => fillChip(el, spec));
    });
    const hint = $('.hero-sensor-hint');
    if (hint) hint.textContent = t('hero.sensorHint', hint.textContent);
  };

  const bind = (el) => {
    const spec = TARGETS.find((item) => item.id === el.getAttribute('data-bench'));
    if (!spec || el._benchBound) return;
    el._benchBound = true;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      run(spec, el);
    });
    el.addEventListener('pointerenter', () => {
      if (window.StationLED && window.StationLED.peek) {
        window.StationLED.peek(lockPhrase(spec.id));
      }
      pulseLight(spec.light);
    });
    el.addEventListener('pointerleave', () => {
      if (window.StationLED && window.StationLED.unpeek) window.StationLED.unpeek();
    });
    el.addEventListener('focus', () => {
      if (window.StationLED && window.StationLED.peek) {
        window.StationLED.peek(lockPhrase(spec.id));
      }
    });
    el.addEventListener('blur', () => {
      if (window.StationLED && window.StationLED.unpeek) window.StationLED.unpeek();
    });
  };

  const init = () => {
    $$('[data-bench]').forEach(bind);
    paint();
    if (window.PortfolioI18n) window.PortfolioI18n.onChange(paint);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.StationBench = { init, run, TARGETS };
})();
