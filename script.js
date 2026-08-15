/* Ryan's Station — 夜行车站 v3 · 行为层
 * 系统：开屏 / 传感器点场 / 准星光标 / 到站信息条 / 检测目标陈列 /
 *       案例档案 / 灯箱 / 发车板 / 车站时钟 / 复制 / 像素彩蛋 / 音乐区入口
 * 语言切换时全部动态区域重渲染。 */
(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const t = (path, fallback) => {
    const v = window.PortfolioI18n && window.PortfolioI18n.t(path);
    return v !== undefined && v !== '' ? v : (fallback || '');
  };
  const lang = () => (window.PortfolioI18n && window.PortfolioI18n.getLanguage()) || 'en';
  const reducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = () => window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ==================================================================
   * 开屏（仓鼠发电 · 系统上电）
   * ================================================================== */
  (function initSplash() {
    const body = document.body;
    const overlay = $('#loading-overlay');
    if (!overlay) { body.classList.remove('splash-active'); return; }

    let seen = false;
    try { seen = sessionStorage.getItem('station-splash-seen') === '1'; } catch (e) { /* noop */ }

    // boot 台词按语言轮播
    const bootLine = $('#splash-boot-line');
    const bootSeqEn = ['> POWER: HAMSTER ONLINE', '> SENSOR ARRAY... OK', '> STATION LIGHTS... ON'];
    const bootSeqZh = ['> 电源：仓鼠就绪', '> 传感器阵列……正常', '> 站台灯光……点亮'];
    let bootI = 0;
    const bootTimer = window.setInterval(() => {
      if (!bootLine) return;
      const seq = lang() === 'zh' ? bootSeqZh : bootSeqEn;
      bootLine.textContent = seq[Math.min(bootI, seq.length - 1)];
      bootI += 1;
    }, 520);

    const finish = () => {
      window.clearInterval(bootTimer);
      body.classList.remove('splash-active');
      body.classList.add('splash-exit');
      try { sessionStorage.setItem('station-splash-seen', '1'); } catch (e) { /* noop */ }
      window.setTimeout(() => {
        overlay.remove();
        body.classList.remove('splash-exit');
        window.dispatchEvent(new CustomEvent('station:splash-ready'));
      }, reducedMotion() ? 40 : 950);
    };

    if (seen || reducedMotion()) {
      window.clearInterval(bootTimer);
      overlay.remove();
      body.classList.remove('splash-active');
      return;
    }

    const HOLD = 1900;
    const timer = window.setTimeout(finish, HOLD);
    const skip = () => { window.clearTimeout(timer); finish(); };
    overlay.addEventListener('click', skip, { once: true });
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { e.preventDefault(); skip(); }
    });
  })();

  /* ==================================================================
   * 会呼吸的昼/夜工坊场景
   * ================================================================== */
  const stationScene = (function initStationScene() {
    if (!window.StationScene) return null;
    const hero = $('#home');
    if (!hero) return null;
    const forceStatic = new URLSearchParams(window.location.search).has('static');
    const scene = window.StationScene.init(hero, { static: forceStatic });
    const reveal = () => window.setTimeout(() => scene.start(), 200);
    window.addEventListener('station:splash-ready', reveal, { once: true });
    if (!document.body.classList.contains('splash-active') && !document.body.classList.contains('splash-exit')) reveal();
    return scene;
  })();

  /* ==================================================================
   * 传感器点场（首屏）
   * ================================================================== */
  const heroField = (function initSensor() {
    const canvas = $('#sensor-canvas');
    if (!canvas || !window.SensorField) return null;
    let field = null;
    try {
      field = new window.SensorField(canvas, { maxDPR: 1.6 });
    } catch (e) { return null; }
    if (field.mode === 'none') return null;
    if (stationScene) stationScene.attachSensor(field);

    const hero = $('#home');
    // ?static 或 reduced-motion：渲染单帧静态点场，不进入动画循环
    const forceStatic = new URLSearchParams(window.location.search).has('static');
    const reduced = reducedMotion() || forceStatic;

    // 指针
    window.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      field.setPointer(e.clientX - r.left, e.clientY - r.top);
    }, { passive: true });
    window.addEventListener('pointerdown', (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y >= 0 && y <= r.height) {
        field.pulse(x, y);
        if (stationScene) stationScene.pulse(x, y);
      }
    }, { passive: true });
    // 触摸拖动即扫描
    window.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      const r = canvas.getBoundingClientRect();
      field.setPointer(touch.clientX - r.left, touch.clientY - r.top);
    }, { passive: true });

    // 滚动 → 流速（驶过的夜风景）
    let lastY = window.scrollY;
    let flow = 0;
    window.addEventListener('scroll', () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      flow = Math.max(-1.2, Math.min(1.2, flow * 0.86 + dy * 0.012));
      field.setFlow(flow);
      if (stationScene) stationScene.setFlow(flow);
    }, { passive: true });
    window.setInterval(() => { flow *= 0.8; field.setFlow(flow); }, 260);

    // 可见时才渲染
    if ('IntersectionObserver' in window && hero) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (reduced) return; // 静态单帧
          if (entry.isIntersecting) field.start();
          else field.stop();
        });
      }, { threshold: 0.05 });
      io.observe(hero);
    }
    // 标签页隐藏时暂停
    document.addEventListener('visibilitychange', () => {
      if (reduced) return;
      if (document.hidden) field.stop();
      else if (hero && window.scrollY < window.innerHeight) field.start();
    });
    if (reduced) {
      field.renderFrame(0.001);
      field.startedAt = 0;
    } else {
      field.start();
    }

    window.addEventListener('resize', () => {
      window.clearTimeout(field._rz);
      field._rz = window.setTimeout(() => field.resize(), 180);
    });

    return field;
  })();

  /* ==================================================================
   * 准星光标（桌面）— 所有交互元素获得目标锁定
   * ================================================================== */
  (function initReticle() {
    const reticle = $('#reticle');
    const label = $('#reticle-label');
    if (!reticle || isTouch() || reducedMotion()) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (new URLSearchParams(window.location.search).has('static')) return;

    document.body.classList.add('has-reticle');
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = null;

    const loop = () => {
      // 位置收敛后暂停循环，指针移动时再唤醒（避免持续占用合成器）
      if (Math.abs(x - rx) < 0.15 && Math.abs(y - ry) < 0.15) {
        rx = x; ry = y;
        reticle.style.transform = `translate(${rx - 22}px, ${ry - 22}px)`;
        raf = null;
        return;
      }
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      reticle.style.transform = `translate(${rx - 22}px, ${ry - 22}px)`;
      raf = requestAnimationFrame(loop);
    };
    const wake = () => { if (raf === null) raf = requestAnimationFrame(loop); };

    window.addEventListener('pointermove', (e) => {
      x = e.clientX;
      y = e.clientY;
      wake();
      const el = e.target instanceof Element ? e.target.closest('a, button, summary, [data-lockable]') : null;
      if (el) {
        reticle.classList.add('is-lock');
        document.body.classList.add('reticle-target');
        if (label) {
          const name = el.getAttribute('data-lock-label') || el.getAttribute('aria-label') || el.textContent;
          if (name) label.textContent = String(name).trim().slice(0, 26).toUpperCase();
        }
      } else {
        reticle.classList.remove('is-lock');
        document.body.classList.remove('reticle-target');
        if (label) label.textContent = '';
      }
    }, { passive: true });

    window.addEventListener('pointerdown', () => reticle.classList.add('is-fire'));
    window.addEventListener('pointerup', () => reticle.classList.remove('is-fire'));
  })();

  /* ==================================================================
   * 主题
   * ================================================================== */
  (function initTheme() {
    const body = document.body;
    const btn = $('#theme-toggle');
    const modeBtn = $('#led-theme-mode');
    const DAY_START = 7 * 60;
    const NIGHT_START = 18 * 60 + 30;

    const sgtState = () => {
      const shifted = new Date(Date.now() + 8 * 60 * 60 * 1000);
      const mins = shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
      const dayStartUtc = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - 8 * 60 * 60 * 1000;
      let next;
      if (mins < DAY_START) next = dayStartUtc + DAY_START * 60000;
      else if (mins < NIGHT_START) next = dayStartUtc + NIGHT_START * 60000;
      else next = dayStartUtc + 86400000 + DAY_START * 60000;
      return { light: mins >= DAY_START && mins < NIGHT_START, next };
    };

    const readStored = () => {
      let raw = null;
      try { raw = localStorage.getItem('theme'); } catch (e) { /* noop */ }
      if (!raw) return null;
      if (raw === 'light' || raw === 'dark') return { mode: raw, expires: sgtState().next };
      try {
        const parsed = JSON.parse(raw);
        if ((parsed.mode === 'light' || parsed.mode === 'dark') && Number(parsed.expires) > Date.now()) return parsed;
      } catch (e) { /* noop */ }
      try { localStorage.removeItem('theme'); } catch (e) { /* noop */ }
      return null;
    };

    let stored = readStored();
    let auto = !stored;
    let boundaryTimer = null;

    const updateIndicator = () => {
      if (!modeBtn) return;
      modeBtn.textContent = auto ? 'AUTO' : 'MANUAL';
      modeBtn.dataset.mode = auto ? 'auto' : 'manual';
      modeBtn.title = auto ? 'Theme follows Singapore time' : 'Return theme to Singapore time';
      modeBtn.setAttribute('aria-label', modeBtn.title);
    };

    const apply = (light) => {
      body.classList.toggle('light-mode', light);
      if (btn) {
        btn.setAttribute('aria-pressed', light ? 'true' : 'false');
        btn.setAttribute('aria-label', t(light ? 'common.themeToDark' : 'common.themeToLight'));
      }
      if (heroField) heroField.setTheme(light);
      if (stationScene) {
        stationScene.setMode(light ? 'day' : 'night');
        stationScene.setAuto(auto);
      }
      updateIndicator();
    };

    const scheduleBoundary = () => {
      window.clearTimeout(boundaryTimer);
      const state = sgtState();
      boundaryTimer = window.setTimeout(() => {
        auto = true;
        stored = null;
        try { localStorage.removeItem('theme'); } catch (e) { /* noop */ }
        apply(sgtState().light);
        scheduleBoundary();
      }, Math.max(1000, state.next - Date.now() + 250));
    };

    const returnToAuto = () => {
      auto = true;
      stored = null;
      try { localStorage.removeItem('theme'); } catch (e) { /* noop */ }
      apply(sgtState().light);
      scheduleBoundary();
    };

    apply(stored ? stored.mode === 'light' : sgtState().light);
    scheduleBoundary();
    if (btn) {
      btn.addEventListener('click', () => {
        const toLight = !body.classList.contains('light-mode');
        auto = false;
        stored = { mode: toLight ? 'light' : 'dark', setAt: Date.now(), expires: sgtState().next };
        try { localStorage.setItem('theme', JSON.stringify(stored)); } catch (e) { /* noop */ }
        apply(toLight);
      });
    }
    if (modeBtn) modeBtn.addEventListener('click', returnToAuto);
    if (window.PortfolioI18n) {
      window.PortfolioI18n.onChange(() => apply(body.classList.contains('light-mode')));
    }
  })();

  /* ==================================================================
   * 页内锚点导航 — 自实现平滑滚动（CSS smooth 在部分嵌入渲染器不可用）
   * ================================================================== */
  (function initSmoothNav() {
    const reduced = reducedMotion();
    const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);

    const scrollToTarget = (target) => {
      const startY = window.scrollY;
      const rect = target.getBoundingClientRect();
      const headerH = 72;
      const endY = Math.max(0, startY + rect.top - headerH);
      if (reduced) { window.scrollTo(0, endY); return; }
      const dist = endY - startY;
      if (Math.abs(dist) < 2) return;
      const dur = Math.min(1100, 380 + Math.abs(dist) * 0.32);
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, startY + dist * easeOutCubic(p));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    document.addEventListener('click', (e) => {
      const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      history.pushState(null, '', href);
    });

    // 载入时已有 hash：直接就位（无动画，符合预期）
    window.setTimeout(() => {
      if (location.hash && location.hash !== '#') {
        const target = document.querySelector(location.hash);
        if (target) {
          const endY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 72);
          window.scrollTo(0, endY);
        }
      }
    }, 60);
  })();

  /* ==================================================================
   * 顶栏 + 滚动侦测 + 移动端菜单 + 到站信息条
   * ================================================================== */
  const LED = (function initLed() {
    const strip = $('#led-strip');
    const nowEl = $('#led-now');
    const nextEl = $('#led-next');
    const stopsEl = $('#led-stops');
    const sectionIds = ['home', 'work', 'about', 'journey', 'contact'];
    const names = () => sectionIds.map((id) => t(`led.stop.${id}`, id.toUpperCase()));

    // 字符乱序翻牌
    const scrambleTo = (el, text) => {
      if (!el) return;
      if (reducedMotion()) { el.textContent = text; return; }
      const chars = '▚▞▛ABCDEFGHKMNPRSTUVWXYZ0123456789·';
      const from = el.textContent || '';
      const len = Math.max(from.length, text.length);
      let frame = 0;
      if (el._scr) cancelAnimationFrame(el._scr);
      const step = () => {
        frame += 1;
        let out = '';
        for (let i = 0; i < text.length; i++) {
          const settled = frame > 4 + i * 1.4;
          out += settled ? text[i] : chars[(Math.random() * chars.length) | 0];
        }
        el.textContent = out;
        if (frame < 4 + text.length * 1.4 + 2) el._scr = requestAnimationFrame(step);
        else el.textContent = text;
      };
      el._scr = requestAnimationFrame(step);
    };

    let current = -1;
    const setStop = (idx) => {
      if (idx === current) return;
      current = idx;
      const n = names();
      scrambleTo(nowEl, n[idx]);
      scrambleTo(nextEl, n[(idx + 1) % n.length]);
      if (stopsEl) stopsEl.textContent = String(idx + 1).padStart(2, '0') + '/' + String(n.length).padStart(2, '0');
      if (strip) strip.classList.remove('is-arriving'), strip.offsetWidth, strip.classList.add('is-arriving');
    };

    return { setStop, sectionIds, refresh: () => { current = -1; } };
  })();

  (function initHeaderAndSpy() {
    const header = $('#site-header');
    const menuBtn = $('#nav-menu-btn');
    const navLinks = $('#nav-links');
    const links = navLinks ? $$('a', navLinks) : [];

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const closeMenu = () => {
      if (!navLinks) return;
      navLinks.classList.remove('is-menu-open');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    };
    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = navLinks.classList.toggle('is-menu-open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
      });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
      links.forEach((a) => a.addEventListener('click', closeMenu));
    }

    const lis = navLinks ? $$('#nav-links li') : [];
    const setActive = (id) => {
      lis.forEach((li) => {
        const a = li.querySelector('a');
        const on = a && a.getAttribute('href') === '#' + id;
        li.classList.toggle('is-active', Boolean(on));
        if (a) a.setAttribute('aria-current', on ? 'true' : 'false');
      });
    };
    const sections = LED.sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            const idx = LED.sectionIds.indexOf(entry.target.id);
            if (idx >= 0) LED.setStop(idx);
          }
        });
      }, { rootMargin: '-38% 0px -55% 0px', threshold: 0 });
      sections.forEach((s) => spy.observe(s));
    }
  })();

  /* ==================================================================
   * 滚动显现
   * ================================================================== */
  function observeReveals() {
    const fresh = $$('.reveal:not(.is-revealed)');
    if (!fresh.length) return;
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      fresh.forEach((el) => el.classList.add('is-revealed'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    fresh.forEach((el) => io.observe(el));
  }
  observeReveals();

  /* ==================================================================
   * 车站时钟
   * ================================================================== */
  (function initClocks() {
    const clocks = $$('.station-clock-time');
    if (!clocks.length) return;
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => {
      const now = fmt.format(new Date());
      clocks.forEach((c) => { c.textContent = now; });
    };
    tick();
    window.setInterval(tick, 1000);
  })();

  /* ==================================================================
   * 复制
   * ================================================================== */
  (function initCopy() {
    const status = $('#copy-status');
    $$('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.getAttribute('data-copy');
        let ok = false;
        try {
          await navigator.clipboard.writeText(value);
          ok = true;
        } catch (e) {
          const ta = document.createElement('textarea');
          ta.value = value;
          ta.setAttribute('readonly', '');
          ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
          document.body.appendChild(ta);
          ta.select();
          try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
          ta.remove();
        }
        if (status) status.textContent = ok ? t('common.copied') : '';
        const original = btn.textContent;
        if (ok) {
          btn.textContent = t('common.copied');
          window.setTimeout(() => { btn.textContent = original; }, 1600);
        }
      });
    });
  })();

  /* ==================================================================
   * 灯箱
   * ================================================================== */
  const Lightbox = (function () {
    const root = $('#lightbox');
    if (!root) return { open: () => {}, close: () => {} };
    const img = $('#lightbox-image');
    const video = $('#lightbox-video');
    const caption = $('#lightbox-caption');
    const closeBtn = $('#lightbox-close');
    let lastFocus = null;

    const close = () => {
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      root.setAttribute('inert', '');
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const open = ({ type, src, alt }) => {
      lastFocus = document.activeElement;
      if (type === 'video') {
        img.hidden = true;
        video.hidden = false;
        video.src = src;
        video.play().catch(() => {});
      } else {
        video.hidden = true;
        img.hidden = false;
        img.src = src;
        img.alt = alt || '';
      }
      if (caption) caption.textContent = alt || '';
      root.classList.remove('is-open');
      void root.offsetHeight;
      root.classList.add('is-open');
      root.removeAttribute('inert');
      root.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    };

    if (closeBtn) closeBtn.addEventListener('click', close);
    root.addEventListener('click', (e) => { if (e.target === root) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) close();
    });
    return { open, close };
  })();

  /* ==================================================================
   * 检测目标陈列 + 案例档案
   * ================================================================== */
  const Work = (function () {
    const listEl = $('#work-list');
    const caseView = $('#case-view');
    const caseBody = $('#case-body');
    const caseIndex = $('#case-index');
    const caseClose = $('#case-close');
    const casePrev = $('#case-prev');
    const caseNext = $('#case-next');
    const caseScroll = $('#case-scroll');
    const caseTrackTag = $('#case-track-tag');
    const projects = (window.SiteData && window.SiteData.projects) || [];
    let current = 0;
    let lastFocus = null;
    let heroObserver = null;

    const L = (project) => project[lang()] || project.en;

    const makeMedia = (media, opts) => {
      const o = opts || {};
      if (media.type === 'video') {
        const v = document.createElement('video');
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = o.eager ? 'metadata' : 'none';
        v.src = media.src;
        if (media.poster) v.poster = media.poster;
        if (media.alt) v.setAttribute('aria-label', media.alt);
        return v;
      }
      const img = document.createElement('img');
      img.src = media.src;
      img.alt = media.alt || '';
      img.loading = o.eager ? 'eager' : 'lazy';
      img.decoding = 'async';
      return img;
    };

    /* --- 检测卡片 --- */
    const renderList = () => {
      if (!listEl) return;
      listEl.innerHTML = '';
      projects.forEach((project, i) => {
        const l = L(project);
        const li = document.createElement('li');
        li.className = 'detect-item reveal';
        li.innerHTML = `
          <button class="detect-card" type="button" data-lock-label="${l.title}" aria-label="${l.title} — ${t('work.viewCase', 'Open case file')}">
            <span class="detect-media" data-detect-media></span>
            <span class="detect-brackets" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span class="detect-tag" aria-hidden="true">${project.detId || 'DET-' + String(i + 1).padStart(2, '0')}</span>
            <span class="detect-info">
              <span class="detect-meta-row">
                <span class="detect-class">${l.eyebrow}</span>
                <span class="detect-year">${project.year}</span>
              </span>
              <span class="detect-name">${l.title}<span class="detect-arrow" aria-hidden="true">→</span></span>
              <span class="detect-sub">${l.subtitle}</span>
              <span class="detect-stats">${project.stats.map((s) => `<span>${s}</span>`).join('')}</span>
              <span class="detect-cta">${t('work.viewCase', 'Open case file')}</span>
            </span>
            <span class="detect-lockflag" aria-hidden="true">◇ LOCK</span>
          </button>`;
        const mediaSlot = li.querySelector('[data-detect-media]');
        const media = makeMedia(project.hero, { eager: i === 0 });
        if (project.hero.type === 'video') media.setAttribute('tabindex', '-1');
        mediaSlot.appendChild(media);

        const card = li.querySelector('.detect-card');
        card.addEventListener('click', () => openCase(i, card));

        const video = mediaSlot.querySelector('video');
        if (video && !reducedMotion()) {
          card.addEventListener('mouseenter', () => video.play().catch(() => {}));
          card.addEventListener('mouseleave', () => video.pause());
        }
        if (video) {
          card.addEventListener('focus', () => video.play().catch(() => {}));
          card.addEventListener('blur', () => video.pause());
        }
        listEl.appendChild(li);
      });
      observeReveals();
    };

    /* --- 案案渲染 --- */
    const renderCase = (index) => {
      if (!caseBody) return;
      const project = projects[index];
      const l = L(project);
      current = index;
      if (caseIndex) caseIndex.textContent = (project.detId || 'DET-' + String(index + 1).padStart(2, '0'))
        + ' · ' + String(index + 1).padStart(2, '0') + '/' + String(projects.length).padStart(2, '0');

      // TRACKING… → LOCKED 小序列
      if (caseTrackTag && !reducedMotion()) {
        caseTrackTag.textContent = 'TRACKING…';
        caseTrackTag.classList.remove('is-locked');
        window.clearTimeout(caseTrackTag._t);
        caseTrackTag._t = window.setTimeout(() => {
          caseTrackTag.textContent = '◉ LOCKED';
          caseTrackTag.classList.add('is-locked');
        }, 700);
      } else if (caseTrackTag) {
        caseTrackTag.textContent = '◉ LOCKED';
        caseTrackTag.classList.add('is-locked');
      }

      const heroHtml = project.hero.type === 'video'
        ? `<video class="case-hero-video" src="${project.hero.src}" poster="${project.hero.poster || ''}" muted loop playsinline preload="metadata" aria-label="${l.title}"></video>`
        : `<img src="${project.hero.src}" alt="${l.title}" loading="eager" decoding="async">`;

      const linksHtml = (project.links || []).map((link) => {
        if (link.type === 'paper') {
          return `<a href="${link.url}" target="_blank" rel="noopener"><svg width="14" height="14" aria-hidden="true"><use href="assets/icons.svg#icon-file-pdf"></use></svg>${t('work.paper', 'Read the paper')}</a>`;
        }
        if (link.type === 'github') {
          return `<a href="${link.url}" target="_blank" rel="noopener">◈ ${t('work.github', 'Source on GitHub')}</a>`;
        }
        return '';
      }).join('');

      const sectionsHtml = l.sections.map((sec) => {
        const mediaHtml = sec.media.map((m) => {
          if (m.type === 'video') {
            return `<video class="case-media" src="${m.src}" muted loop playsinline preload="metadata" data-lightbox-type="video" data-lightbox-src="${m.src}" data-lightbox-alt="${m.alt || ''}" aria-label="${m.alt || ''}"></video>`;
          }
          return `<img class="case-media" src="${m.src}" alt="${m.alt || ''}" loading="lazy" decoding="async" data-lightbox-type="image" data-lightbox-src="${m.src}" data-lightbox-alt="${m.alt || ''}">`;
        }).join('');
        return `
          <section class="case-section">
            <h3 class="case-section-title">${sec.title}</h3>
            <p class="case-section-body">${sec.body}</p>
            ${mediaHtml ? `<div class="case-media-grid">${mediaHtml}</div>` : ''}
          </section>`;
      }).join('');

      caseBody.innerHTML = `
        <div class="case-hero-media" data-case-hero>${heroHtml}</div>
        <p class="case-kicker">${l.eyebrow}</p>
        <h2 class="case-title" id="case-title">${l.title}</h2>
        <p class="case-subtitle">${l.subtitle}</p>
        <p class="case-summary">${l.summary}</p>
        <div class="case-meta">
          <div class="case-meta-cell"><span class="case-meta-label">${t('work.role', 'Role')}</span><span class="case-meta-value">${l.role}</span></div>
          <div class="case-meta-cell"><span class="case-meta-label">${t('work.stack', 'Stack')}</span><span class="case-meta-value">${l.stack}</span></div>
          <div class="case-meta-cell"><span class="case-meta-label">${t('work.year', 'Year')}</span><span class="case-meta-value">${project.year}</span></div>
        </div>
        ${linksHtml ? `<div class="case-links">${linksHtml}</div>` : ''}
        ${sectionsHtml}`;

      $$('.case-media', caseBody).forEach((el) => {
        el.addEventListener('click', () => {
          Lightbox.open({
            type: el.getAttribute('data-lightbox-type'),
            src: el.getAttribute('data-lightbox-src'),
            alt: el.getAttribute('data-lightbox-alt'),
          });
        });
      });
      const heroVideo = caseBody.querySelector('[data-case-hero] video');
      if (heroVideo) {
        heroVideo.addEventListener('click', () => {
          Lightbox.open({ type: 'video', src: heroVideo.currentSrc || heroVideo.src, alt: l.title });
        });
        if (heroObserver) heroObserver.disconnect();
        if ('IntersectionObserver' in window) {
          heroObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) heroVideo.play().catch(() => {});
              else heroVideo.pause();
            });
          }, { threshold: 0.35 });
          heroObserver.observe(heroVideo);
        }
      }
      const heroImg = caseBody.querySelector('[data-case-hero] img');
      if (heroImg) {
        heroImg.style.cursor = 'zoom-in';
        heroImg.addEventListener('click', () => {
          Lightbox.open({ type: 'image', src: heroImg.src, alt: l.title });
        });
      }
      if (caseScroll) caseScroll.scrollTop = 0;
    };

    const openCase = (index, trigger) => {
      lastFocus = trigger || document.activeElement;
      renderCase(index);
      if (!caseView) return;
      caseView.classList.add('is-open');
      caseView.removeAttribute('inert');
      caseView.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (caseClose) caseClose.focus();
    };

    const closeCase = () => {
      if (!caseView || !caseView.classList.contains('is-open')) return;
      caseView.classList.remove('is-open');
      caseView.setAttribute('aria-hidden', 'true');
      caseView.setAttribute('inert', '');
      document.body.style.overflow = '';
      $$('video', caseView).forEach((v) => v.pause());
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    if (caseClose) caseClose.addEventListener('click', closeCase);
    if (casePrev) casePrev.addEventListener('click', () => renderCase((current - 1 + projects.length) % projects.length));
    if (caseNext) caseNext.addEventListener('click', () => renderCase((current + 1) % projects.length));
    document.addEventListener('keydown', (e) => {
      if (!caseView || !caseView.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeCase(); }
    });

    const renderArchive = () => {
      const card = $('#archive-card');
      const archive = window.SiteData && window.SiteData.archive;
      if (!card || !archive) return;
      const l = archive[lang()] || archive.en;
      card.innerHTML = `
        <div class="archive-media">
          <img src="${archive.poster}" alt="${l.title}" loading="lazy" decoding="async">
          <span class="archive-num" aria-hidden="true">${archive.index}</span>
        </div>
        <div class="archive-copy">
          <p class="archive-eyebrow">${l.eyebrow}</p>
          <h3>${l.title}</h3>
          <p class="archive-desc">${l.description}</p>
          <div class="archive-facts">${l.facts.map((f) => `<span>${f}</span>`).join('')}</div>
          <a class="archive-link" href="${archive.video}" target="_blank" rel="noopener noreferrer">${l.cta} <span aria-hidden="true">↗</span></a>
        </div>`;
    };

    return {
      renderList,
      renderArchive,
      rerender: () => { renderList(); renderArchive(); },
    };
  })();

  /* ==================================================================
   * 关于卡片
   * ================================================================== */
  (function initAbout() {
    const wrap = $('#about-cards');
    const render = () => {
      if (!wrap) return;
      const cards = (window.PortfolioI18n && window.PortfolioI18n.get('about.cards')) || [];
      wrap.innerHTML = cards.map((card) => `
        <div class="about-card">
          <h3>${card.title}</h3>
          <p>${card.text}</p>
        </div>`).join('');
    };
    render();
    if (window.PortfolioI18n) window.PortfolioI18n.onChange(render);
  })();

  /* ==================================================================
   * 蓝图自绘
   * ================================================================== */
  (function initBlueprint() {
    const bp = $('.about-blueprint');
    if (!bp) return;
    if (reducedMotion() || !('IntersectionObserver' in window)) {
      bp.classList.add('is-drawn');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          bp.classList.add('is-drawn');
          io.unobserve(bp);
        }
      });
    }, { threshold: 0.3 });
    io.observe(bp);
  })();

  /* ==================================================================
   * 发车板
   * ================================================================== */
  (function initJourney() {
    const wrap = $('#departures-list');
    const data = (window.SiteData && window.SiteData.experience) || [];
    const render = () => {
      if (!wrap) return;
      wrap.innerHTML = '';
      [...data].reverse().forEach((item) => {
        const l = item[lang()] || item.en;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'departure';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('data-lock-label', item.org);
        btn.innerHTML = `
          <span class="departure-time">${item.period}</span>
          <span class="departure-dest">
            <span class="departure-org">${l.orgName || item.org}</span>
            <span class="departure-hint">${l.role}</span>
          </span>
          <span class="departure-status is-departed">${t('journey.departed', 'Departed')}</span>`;

        const detail = document.createElement('div');
        detail.className = 'departure-detail';
        detail.innerHTML = `
          <div class="departure-detail-grid">
            <div class="departure-detail-media">
              <img src="${item.media}" alt="${t('journey.mediaAlt', 'Scene from this stop')}" loading="lazy" decoding="async">
            </div>
            <div>
              <p class="departure-role">${l.role}</p>
              <p class="departure-summary">${l.summary}</p>
              <ul class="departure-highlights">${l.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
              <div class="departure-tags">${l.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
            </div>
          </div>`;

        btn.addEventListener('click', () => {
          const open = btn.classList.toggle('is-open');
          detail.classList.toggle('is-open', open);
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        wrap.appendChild(btn);
        wrap.appendChild(detail);
      });
    };
    render();
    if (window.PortfolioI18n) window.PortfolioI18n.onChange(render);

    const next = $('.departure-next');
    if (next) {
      next.addEventListener('click', () => {
        const sel = next.getAttribute('data-scroll') || '#contact';
        const a = document.querySelector('a[href="' + sel + '"]');
        if (a) a.click();
        else {
          const target = document.querySelector(sel);
          if (target) target.scrollIntoView({ behavior: 'auto' });
        }
      });
    }
  })();

  /* ==================================================================
   * 像素机器人 + 秘技
   * ================================================================== */
  (function initEasterEggs() {
    const bot = $('#pixelbot');
    const heartSvg = `<svg viewBox="0 0 7 6" width="14" height="12" shape-rendering="crispEdges" aria-hidden="true"><path fill="#e85940" fill-rule="evenodd" d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z"/></svg>`;

    const spawnHearts = (x, y, count) => {
      for (let i = 0; i < count; i++) {
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

    if (bot) {
      bot.addEventListener('click', (e) => {
        bot.classList.remove('is-happy');
        void bot.offsetWidth;
        bot.classList.add('is-happy');
        const rect = bot.getBoundingClientRect();
        spawnHearts(rect.left + rect.width / 2, rect.top, reducedMotion() ? 1 : 7);
        if (heroField) heroField.pulse(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    }

    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === seq[pos] || key.toLowerCase() === String(seq[pos]).toLowerCase()) {
        pos += 1;
        if (pos === seq.length) {
          pos = 0;
          if (!reducedMotion()) {
            for (let i = 0; i < 5; i++) {
              window.setTimeout(() => spawnHearts(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.7 + 60, 6), i * 180);
            }
          }
          const note = document.createElement('p');
          note.className = 'konami-note';
          note.textContent = t('easter.hint', '…the hamster approves.');
          note.style.cssText = 'position:fixed;bottom:64px;left:50%;transform:translateX(-50%);font-family:var(--font-mono);font-size:12px;color:var(--accent);z-index:260;pointer-events:none;';
          document.body.appendChild(note);
          window.setTimeout(() => note.remove(), 3200);
        }
      } else {
        pos = key === seq[0] ? 1 : 0;
      }
    });
  })();

  /* ==================================================================
   * 终点站翻牌词
   * ================================================================== */
  (function initTerminus() {
    const word = $('#terminus-word');
    if (!word) return;
    const setWord = () => { word.textContent = t('contact.terminusWord', 'TERMINUS'); };
    setWord();
    if (window.PortfolioI18n) window.PortfolioI18n.onChange(setWord);
  })();

  /* ==================================================================
   * 音乐区入口
   * ================================================================== */
  (function initMusicDoor() {
    const trigger = $('#music-trigger');
    const door = $('#club-door');
    const stay = $('#club-door-stay');
    const enter = $('#club-door-enter');
    if (!trigger || !door || !stay || !enter) return;

    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      door.classList.add('is-open');
      door.setAttribute('aria-hidden', 'false');
      stay.focus();
    };
    const close = () => {
      door.classList.remove('is-open');
      door.setAttribute('aria-hidden', 'true');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    trigger.addEventListener('click', open);
    stay.addEventListener('click', close);
    enter.addEventListener('click', () => { window.location.href = 'music-player.html'; });
    door.addEventListener('click', (e) => { if (e.target === door) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && door.classList.contains('is-open')) close();
    });
  })();

  /* ==================================================================
   * 启动 + 语言切换重渲染
   * ================================================================== */
  Work.renderList();
  Work.renderArchive();
  LED.setStop(0);
  if (window.PortfolioI18n) {
    window.PortfolioI18n.onChange(() => {
      Work.rerender();
      LED.refresh();
      LED.setStop(0);
    });
  }
})();
