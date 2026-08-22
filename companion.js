/* Pixelbot as a resident — walks the platform, naps when you do. */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const t = (path, fallback) => {
    const v = window.PortfolioI18n && window.PortfolioI18n.t(path);
    return v !== undefined && v !== '' ? v : (fallback || '');
  };
  const reducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const IDLE_MS = 8000;
  const heartSvg = `<svg viewBox="0 0 7 6" width="14" height="12" shape-rendering="crispEdges" aria-hidden="true"><path fill="#e85940" fill-rule="evenodd" d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z"/></svg>`;

  const spawnHearts = (x, y, count) => {
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement('span');
      el.className = 'pixel-spark';
      el.innerHTML = heartSvg;
      el.style.left = (x + (Math.random() * 60 - 30)) + 'px';
      el.style.top = (y - 10) + 'px';
      el.style.setProperty('--spark-x', (Math.random() * 90 - 45) + 'px');
      el.style.setProperty('--spark-r', (Math.random() * 300 - 150) + 'deg');
      el.style.setProperty('--spark-t', (900 + Math.random() * 900) + 'ms');
      document.body.appendChild(el);
      window.setTimeout(() => el.remove(), 2000);
    }
  };

  const init = () => {
    const bot = $('#pixelbot');
    if (!bot) return;

    let stopId = 'home';
    let idleTimer = null;
    let sleepy = false;
    let musingIdx = 0;

    const ledH = () => {
      const strip = $('#led-strip');
      return strip ? strip.getBoundingClientRect().height : 42;
    };

    const perch = (id) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const led = ledH() + 12;
      const mobile = w < 860;
      if (mobile && id !== 'contact') {
        return { r: 10, b: led + 8 };
      }
      if (id === 'contact') {
        return { r: Math.max(20, w * 0.06), b: led + 20 };
      }
      if (id === 'work') return { r: 22, b: Math.max(led + 80, h * 0.36) };
      if (id === 'about') return { r: Math.max(18, w * 0.07), b: Math.max(led + 90, h * 0.30) };
      if (id === 'journey') return { r: 28, b: Math.max(led + 90, h * 0.38) };
      return { r: Math.max(18, w * 0.045), b: Math.max(led + 110, 150) };
    };

    const moveTo = (id) => {
      stopId = id || stopId;
      const p = perch(stopId);
      bot.style.setProperty('--bot-r', Math.round(p.r) + 'px');
      bot.style.setProperty('--bot-b', Math.round(p.b) + 'px');
      bot.classList.toggle('is-docked', stopId === 'contact');
      document.body.classList.toggle('bot-docked', stopId === 'contact');
      if (stopId === 'contact') sleep(true);
      else if (!sleepy) wake(false);
    };

    const label = () => {
      bot.setAttribute('aria-label', t(sleepy ? 'companion.ariaSleep' : 'companion.aria'));
    };

    const sleep = (force) => {
      if (sleepy && !force) return;
      sleepy = true;
      bot.classList.add('is-sleepy');
      bot.classList.remove('is-happy');
      label();
      const lines = t('companion.musing') || [];
      const line = Array.isArray(lines) ? lines[musingIdx % lines.length] : '';
      musingIdx += 1;
      if (line && stopId !== 'contact' && window.StationLED && window.StationLED.peek) {
        window.StationLED.peek(String(line).toUpperCase());
      }
    };

    const wake = (announce) => {
      if (!sleepy && !announce) {
        /* still refresh perch */
      }
      sleepy = false;
      bot.classList.remove('is-sleepy');
      label();
      if (window.StationLED && window.StationLED.unpeek) window.StationLED.unpeek();
    };

    const pokeIdle = () => {
      window.clearTimeout(idleTimer);
      if (stopId === 'contact') return;
      if (sleepy) wake(true);
      idleTimer = window.setTimeout(() => sleep(false), reducedMotion() ? IDLE_MS + 4000 : IDLE_MS);
    };

    bot.addEventListener('click', () => {
      pokeIdle();
      bot.classList.remove('is-happy');
      void bot.offsetWidth;
      bot.classList.add('is-happy');
      const rect = bot.getBoundingClientRect();
      spawnHearts(rect.left + rect.width / 2, rect.top, reducedMotion() ? 1 : 7);
      if (window.heroField && window.heroField.pulse) {
        window.heroField.pulse(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });

    ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach((ev) => {
      window.addEventListener(ev, pokeIdle, { passive: true });
    });

    window.addEventListener('station:stop', (e) => {
      const id = e.detail && e.detail.id;
      if (id) moveTo(id);
    });

    window.addEventListener('resize', () => {
      window.clearTimeout(bot._rz);
      bot._rz = window.setTimeout(() => moveTo(stopId), 160);
    });

    const caseView = $('#case-view');
    if (caseView && typeof MutationObserver !== 'undefined') {
      const tuck = () => bot.classList.toggle('is-tucked', caseView.classList.contains('is-open'));
      new MutationObserver(tuck).observe(caseView, { attributes: true, attributeFilter: ['class'] });
      tuck();
    }

    if (window.PortfolioI18n) window.PortfolioI18n.onChange(label);
    moveTo('home');
    pokeIdle();
    label();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
