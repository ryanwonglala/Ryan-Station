/* i18n — UI 文案与语言切换。
 * API 与 music-player.js 兼容：t / get / getLanguage / setLanguage / onChange。
 * 文案原则：直接、自然、不堆修辞；中英一一对应。 */
(function () {
  const translations = {
    en: {
      meta: {
        title: "Ryan Wong | Robotics & Automation Engineer",
        description:
          "Ryan Wong's personal station — multi-robot inspection, ROS 2 autonomy, AI vision, soft robotics, and the manufacturing discipline behind them.",
      },
      common: {
        skipToContent: 'Skip to content',
        close: 'Close',
        copy: 'Copy',
        copied: 'Copied',
        loading: 'Loading',
        switchLanguage: 'Switch language',
        menu: 'Menu',
        themeToLight: 'Switch to light theme',
        themeToDark: 'Switch to dark theme',
      },
      nav: {
        primaryLabel: 'Primary navigation',
        brandAria: "Ryan's Station — back to top",
        home: 'Home',
        work: 'Work',
        about: 'About',
        journey: 'Journey',
        contact: 'Contact',
      },
      hero: {
        eyebrow: 'Robotics & Automation Engineer · Singapore',
        title: 'Welcome to Ryan’s Station.',
        subtitle:
          'I build robots that navigate, see, and act — from simulation to real hardware.',
        ctaWork: 'View selected work',
        ctaGithub: 'GitHub',
        scroll: 'Scroll',
        location: 'Singapore · GMT+8',
        status: 'The lights are on.',
        clockLabel: 'Singapore time, GMT+8',
        sensorHint: 'move — the bench is live',
      },
      bench: {
        indexLabel: 'Workbench',
        lock: 'LOCK',
        arm: '6-DOF arm',
        armTel: '4TH PLACE · 1 WEEK',
        armLock: 'ARM',
        laptop: 'RoboInspect',
        laptopTel: 'ROS 2 · NAV2',
        laptopLock: 'INSPECT',
        tools: 'FlexiLock',
        toolsTel: '10 KG · −60 KPA',
        toolsLock: 'JAM',
        rack: 'Security robot',
        rackTel: '<20 CM · YOLOV8+CLIP',
        rackLock: 'PATROL',
        neon: 'Station interior',
        neonTel: 'ABOUT',
        neonLock: 'INTERIOR',
        window: 'Departures',
        windowTel: 'JOURNEY',
        windowLock: 'JOURNEY',
        lamp: 'Station lights',
        lampTel: 'DAY / NIGHT',
        lampLock: 'LIGHTS',
        crate: 'Music Zone',
        crateTel: 'B1 · AFTER HOURS',
        crateLock: 'B1',
      },
      rigs: {
        armTitle: 'Take the controls',
        armCaption:
          'Toy planar IK on the RA-01 drawing. The competition arm was 6-DOF on real hardware — this is the idea, not the field system.',
        armHint: 'Drag onto a stop',
        armHome: 'Tuck away',
        armCaseHint: 'This is the hand from that week. Tucking it away is home pose.',
        padWork: 'Bench',
        padJourney: 'Board',
        padContact: 'Mail',
        flexiTitle: 'Press until it holds.',
        flexiCaption:
          'Toy of the scale-jamming idea. Drag vacuum toward −60 kPa — the sleeve stiffens, the 10 kg mass stops sagging. The wearable is the paper; this is the feel.',
        flexiHint: 'Pull vacuum',
        flexiSoft: 'soft',
        flexiRigid: 'rigid',
      },
      companion: {
        aria: 'A tiny pixel robot. It lives here.',
        ariaSleep: 'A tiny pixel robot, napping.',
        musing: ['STILL', 'LIGHTS ON', 'UNHURRIED', 'MAKING'],
      },
      led: {
        now: 'NOW',
        next: 'NEXT',
        stop: {
          home: 'PLATFORM',
          work: 'BENCH',
          about: 'INTERIOR',
          journey: 'DEPARTURES',
          contact: 'TERMINUS',
        },
      },
      work: {
        label: 'On the bench',
        title: 'Things that sat on this bench.',
        intro:
          'Simulation to hardware, mechanisms to systems. A few things I actually built and touched.',
        viewCase: 'Look closer',
        closeCase: 'Close',
        prev: 'Previous project',
        next: 'Next project',
        role: 'Role',
        stack: 'Stack',
        year: 'Year',
        paper: 'Read the paper',
        github: 'Source on GitHub',
        mediaHint: 'Click any media to enlarge',
        archiveLabel: 'Archive · 1 file',
        archiveTitle: 'One more thing in the archive',
        archiveNote:
          'Non-robotics work lives here — kept available without competing with the main showcase.',
        archiveOpen: 'Open archive',
        lightbox: 'Media preview',
        lightboxClose: 'Close preview',
      },
      about: {
        label: 'About',
        title: 'The person behind the workbench.',
        intro:
          "Robotics & automation engineer, MSc at SUTD (Class of 2026). Before robotics I worked in consumer-electronics manufacturing — NPI, DFM, and engineering documentation at Foxconn and Luxshare-ICT. Now I focus on mobile robotics: ROS-based system integration, navigation, visual recognition, and automation that survives contact with reality.",
        portraitAlt: 'Portrait of Ryan Wong',
        role: 'Robotics & Automation Engineer',
        capabilitiesLabel: 'Capabilities',
        cards: [
          {
            title: 'Robotics & Automation',
            text: 'Hands-on with TurtleBot3, ROS navigation workflows, SLAM testing, sensor integration, and real-robot demos.',
          },
          {
            title: 'Mechanical & Manufacturing',
            text: 'NPI, engineering drawings, BOM documentation, ECO/ECR tracking, DFM support, and cross-functional coordination.',
          },
          {
            title: 'Code, AI Vision & Docs',
            text: 'Python, ROS, Git/GitHub, YOLO/CLIP-based recognition, and technical writing that makes engineering legible.',
          },
        ],
        offDutyLabel: 'Off duty',
        offDutyTitle: 'When the robots are parked.',
        offDuty:
          'Old games, manga, a book on the night stand. Same person who built the arm — just holding a wrench now.',
        mascotAlt: 'Station mechanic illustration',
        blueprintAria: 'Blueprint of a 6-DOF arm. Drag the gripper onto a stop to go there.',
      },
      journey: {
        label: 'Journey',
        title: 'Departures.',
        intro: 'Where I have been, newest first.',
        clockLabel: 'Singapore time, GMT+8',
        next: 'This platform',
        nextHint: 'The next page is still being written.',
        boarding: 'Here',
        departed: 'Departed',
        highlights: 'Highlights',
        showMore: 'Show highlights',
        showLess: 'Hide highlights',
        mediaAlt: 'Scene from this stop',
      },
      contact: {
        label: 'Contact',
        title: 'End of the line.',
        subtitle:
          'The station master has clocked out — but the mailbox never closes.',
        email: 'Email',
        sendEmail: 'Send an email',
        phoneSg: 'Phone · SG',
        phoneCn: 'Phone · CN',
        copy: 'Copy',
        location: 'Location',
        locationValue: 'Singapore · Hougang',
        linkedin: 'LinkedIn',
        viewLinkedIn: 'View LinkedIn profile',
        github: 'GitHub',
        viewGitHub: 'View GitHub profile',
        copySg: 'Copy Singapore phone number',
        copyCn: 'Copy China phone number',
        copy163: 'Copy 163 email address',
        phoneNote: 'Available on WhatsApp / WeChat',
        terminusWord: 'TERMINUS',
      },
      footer: {
        tagline: 'Built by hand — no templates were harmed.',
        music: 'Music Zone',
        musicNote: 'B1 · The player stays open late.',
        backToTop: 'Back to top',
        clockLabel: 'Singapore time, GMT+8',
        rights: 'Ryan Wong · Ryan’s Station',
      },
      musicModal: {
        title: 'Music Zone',
        body: 'You are about to enter the leisure zone.',
        bodySecond: 'Continue to the music player?',
        stay: 'Not now',
        enter: 'Step in',
      },
      easter: {
        hint: '…the hamster approves.',
      },
      musicPlayer: {
        meta: {
          title: 'Music Zone - Acid Glitch Hub',
          description: 'Ryan Station music player with a resident station DJ.',
        },
        playlistToggle: 'Toggle Playlist',
        playlist: 'Playlist',
        playQueue: 'Play Queue',
        searchLabel: 'Search tracks / 搜索曲目',
        searchPlaceholder: 'Title, artist, or tag / 标题、歌手或标签',
        clearSearch: 'Clear playlist search / 清空播放列表搜索',
        noSearchResults: 'No tracks match your search / 没有找到匹配的曲目',
        tracksShown: '{count} tracks shown / 显示 {count} 首曲目',
        trackAria: 'Track {number}: {title} — {artist}',
        home: 'Home',
        headingLabel: 'Ryan Station',
        title: 'Music Zone',
        unloaded: 'No music loaded',
        terminal: 'STATION DJ',
        collapseTerminal: 'Collapse terminal log',
        systemReady: '> SYSTEM: DJ booth online. Pick a mood.',
        noSignal: 'NO SIGNAL',
        liveSignal: 'LIVE SIGNAL',
        playing: 'PLAYING...',
        signalTracking: 'SIGNAL TRACKING',
        mascotAlt: 'Ryan Station Mascot',
        expandTerminal: 'Expand terminal log',
        playModes: {
          sequential: 'Sequential play',
          random: 'Shuffle play',
          single: 'Single repeat',
          fallback: 'Play mode',
        },
        controls: {
          previous: 'Previous track',
          playPause: 'Play / Pause',
          next: 'Next track',
          volume: 'Volume',
        },
        moodPresetsAria: 'Quick mood picks',
      },
    },

    zh: {
      meta: {
        title: 'Ryan Wong | 机器人与自动化工程师',
        description:
          'Ryan Wong 的个人车站——多机器人巡检、ROS 2 自主系统、AI 视觉、软体机器人，以及背后的制造工程功底。',
      },
      common: {
        skipToContent: '跳到主要内容',
        close: '关闭',
        copy: '复制',
        copied: '已复制',
        loading: '加载中',
        switchLanguage: '切换语言',
        menu: '菜单',
        themeToLight: '切换到亮色主题',
        themeToDark: '切换到暗色主题',
      },
      nav: {
        primaryLabel: '主导航',
        brandAria: "Ryan's Station —— 回到顶部",
        home: '首页',
        work: '作品',
        about: '关于',
        journey: '旅程',
        contact: '联系',
      },
      hero: {
        eyebrow: '机器人与自动化工程师 · 新加坡',
        title: '欢迎来到 Ryan’s Station',
        subtitle:
          '我造能导航、能看、能行动的机器人——从仿真走向真实硬件。',
        ctaWork: '查看精选作品',
        ctaGithub: 'GitHub',
        scroll: '向下',
        location: '新加坡 · GMT+8',
        status: '灯还亮着。',
        clockLabel: '新加坡时间，GMT+8',
        sensorHint: '动一动——工作台是活的',
      },
      bench: {
        indexLabel: '工作台',
        lock: '锁定',
        arm: '六自由度机械臂',
        armTel: '第 4 名 · 一周',
        armLock: '机械臂',
        laptop: 'RoboInspect',
        laptopTel: 'ROS 2 · NAV2',
        laptopLock: '巡检',
        tools: 'FlexiLock',
        toolsTel: '10 KG · −60 KPA',
        toolsLock: '卡锁',
        rack: '安保机器人',
        rackTel: '<20 CM · YOLOV8+CLIP',
        rackLock: '巡逻',
        neon: '车站内部',
        neonTel: '关于',
        neonLock: '内部',
        window: '发车记录',
        windowTel: '旅程',
        windowLock: '旅程',
        lamp: '站台灯光',
        lampTel: '昼 / 夜',
        lampLock: '灯光',
        crate: '音乐区',
        crateTel: 'B1 · 深夜营业',
        crateLock: 'B1',
      },
      rigs: {
        armTitle: '接手控制',
        armCaption:
          'RA-01 图纸上的平面 IK 玩具。比赛用臂是真实硬件上的六自由度——这是原理，不是现场系统。',
        armHint: '拖到站名上',
        armHome: '收回去',
        armCaseHint: '比赛那一周管的就是这只手。收回去，就是收工。',
        padWork: '工作台',
        padJourney: '发车板',
        padContact: '信箱',
        flexiTitle: '抽到它自己站住。',
        flexiCaption:
          '鳞片卡锁的手感玩具。把真空拖向 −60 kPa，袖套变硬，10 kg 不再晃。真正的可穿戴在论文里；这里只留触感。',
        flexiHint: '抽真空',
        flexiSoft: '软',
        flexiRigid: '刚',
      },
      companion: {
        aria: '一只住在这里的像素机器人。',
        ariaSleep: '像素机器人在打盹。',
        musing: ['还在', '灯亮着', '不急', '在做'],
      },
      led: {
        now: '当前',
        next: '下一站',
        stop: {
          home: '站台',
          work: '工作台',
          about: '车内一瞥',
          journey: '到发信息',
          contact: '终点站',
        },
      },
      work: {
        label: '工作台上',
        title: '这张台上放过的东西。',
        intro:
          '从仿真到实机，从机构到系统。几件真正做过、摸过的东西。',
        viewCase: '走近看看',
        closeCase: '合上',
        prev: '上一个项目',
        next: '下一个项目',
        role: '角色',
        stack: '技术栈',
        year: '年份',
        paper: '阅读论文',
        github: 'GitHub 源码',
        mediaHint: '点击任意媒体放大',
        archiveLabel: '档案 · 1 件',
        archiveTitle: '档案里还有一件',
        archiveNote: '非机器人方向的作品收纳在这里——可以看，不抢主展位。',
        archiveOpen: '打开档案',
        lightbox: '媒体预览',
        lightboxClose: '关闭预览',
      },
      about: {
        label: '关于',
        title: '工作台后面的那个人。',
        intro:
          '机器人与自动化工程师，SUTD 硕士（2026 届）。转入机器人之前，我在消费电子制造行业工作——在富士康和立讯精密做 NPI、DFM 与工程文档。现在我专注于移动机器人：基于 ROS 的系统集成、导航、视觉识别，以及经得起现实检验的自动化。',
        portraitAlt: 'Ryan Wong 的照片',
        role: '机器人与自动化工程师',
        capabilitiesLabel: '能力',
        cards: [
          {
            title: '机器人与自动化',
            text: 'TurtleBot3 实机、ROS 导航流程、SLAM 测试、传感器集成与真机演示的一手经验。',
          },
          {
            title: '机械与制造工程',
            text: 'NPI、工程图纸、BOM 文档、ECO/ECR 追踪、DFM 支持与跨职能协调。',
          },
          {
            title: '代码、AI 视觉与文档',
            text: 'Python、ROS、Git/GitHub、YOLO/CLIP 视觉识别，以及让工程工作可读的技术写作。',
          },
        ],
        offDutyLabel: '下班以后',
        offDutyTitle: '机器人停车之后。',
        offDuty:
          '老游戏、漫画、床头一本闲书。造那条臂的人和现在握着扳手的，是同一个人。',
        mascotAlt: '车站机工插画',
        blueprintAria: '六自由度机械臂图纸。把夹爪拖到站名上，车站会去那里。',
      },
      journey: {
        label: '旅程',
        title: '发车记录。',
        intro: '去过哪里，从最新一站开始。',
        clockLabel: '新加坡时间，GMT+8',
        next: '这一站',
        nextHint: '下一页还在写。',
        boarding: '在站',
        departed: '已发车',
        highlights: '要点',
        showMore: '展开要点',
        showLess: '收起要点',
        mediaAlt: '这一站的留影',
      },
      contact: {
        label: '联系',
        title: '终点站到了。',
        subtitle: '站长已经下班——但信箱永远开着。',
        email: '邮箱',
        sendEmail: '发邮件',
        phoneSg: '电话 · 新加坡',
        phoneCn: '电话 · 中国',
        copy: '复制',
        location: '位置',
        locationValue: '新加坡 · 后港',
        linkedin: 'LinkedIn',
        viewLinkedIn: '查看 LinkedIn 主页',
        github: 'GitHub',
        viewGitHub: '查看 GitHub 主页',
        copySg: '复制新加坡电话号码',
        copyCn: '复制中国电话号码',
        copy163: '复制 163 邮箱地址',
        phoneNote: 'WhatsApp / 微信 在线',
        terminusWord: '终点站',
      },
      footer: {
        tagline: '纯手工搭建——没有模板受到伤害。',
        music: '音乐区',
        musicNote: 'B1 · 播放器营业到很晚。',
        backToTop: '回到顶部',
        clockLabel: '新加坡时间，GMT+8',
        rights: 'Ryan Wong · Ryan’s Station',
      },
      musicModal: {
        title: '音乐区',
        body: '你即将进入休闲区域。',
        bodySecond: '继续前往音乐播放器？',
        stay: '先不了',
        enter: '进去',
      },
      easter: {
        hint: '……仓鼠表示认可。',
      },
      musicPlayer: {
        meta: {
          title: '音乐区 - Acid Glitch Hub',
          description: 'Ryan Station 音乐播放器与驻场电台 DJ。',
        },
        playlistToggle: '切换播放列表',
        playlist: '播放列表',
        playQueue: '播放队列',
        searchLabel: '搜索曲目 / Search tracks',
        searchPlaceholder: '标题、歌手或标签 / Title, artist, or tag',
        clearSearch: '清空播放列表搜索 / Clear playlist search',
        noSearchResults: '没有找到匹配的曲目 / No tracks match your search',
        tracksShown: '显示 {count} 首曲目 / {count} tracks shown',
        trackAria: '第 {number} 首：{title} — {artist}',
        home: '首页',
        headingLabel: 'Ryan Station',
        title: '音乐区',
        unloaded: '未加载音乐',
        terminal: '电台 DJ',
        collapseTerminal: '折叠终端日志',
        systemReady: '> 系统：DJ 台在线，点个心情试试。',
        noSignal: '无信号',
        liveSignal: '信号接入 LIVE',
        playing: '播放中...',
        signalTracking: '信号追踪',
        mascotAlt: 'Ryan Station 吉祥物',
        expandTerminal: '展开终端日志',
        playModes: {
          sequential: '顺序播放',
          random: '随机播放',
          single: '单曲循环',
          fallback: '播放模式',
        },
        controls: {
          previous: '上一首',
          playPause: '播放 / 暂停',
          next: '下一首',
          volume: '音量',
        },
        moodPresetsAria: '心情快捷点歌',
      },
    },
  };

  let currentLanguage = 'en';
  const listeners = new Set();

  const getByPath = (source, path) =>
    path.split('.').reduce((value, key) => {
      if (value == null) return undefined;
      return value[key];
    }, source);

  const getStoredLanguage = () => {
    try {
      const stored = localStorage.getItem('preferredLanguage');
      if (stored === 'en' || stored === 'zh') return stored;
    } catch (error) {
      return null;
    }
    return null;
  };

  const getInitialLanguage = () => getStoredLanguage() || 'en';

  const translate = (path, lang = currentLanguage) => {
    const value = getByPath(translations[lang], path);
    if (value !== undefined) return value;
    return getByPath(translations.en, path) || '';
  };

  const applyDocumentMeta = (lang) => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const metaPrefix =
      document.body && document.body.dataset.page === 'music' ? 'musicPlayer.meta' : 'meta';
    document.title = translate(`${metaPrefix}.title`, lang);
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', translate(`${metaPrefix}.description`, lang));
    }
  };

  const applyStaticTranslations = (lang = currentLanguage) => {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n'), lang);
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-aria-label'), lang);
      if (value !== undefined) element.setAttribute('aria-label', value);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-title'), lang);
      if (value !== undefined) element.setAttribute('title', value);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-placeholder'), lang);
      if (value !== undefined) element.setAttribute('placeholder', value);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-alt'), lang);
      if (value !== undefined) element.setAttribute('alt', value);
    });
    document.querySelectorAll('.language-option').forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    document.body.classList.toggle('lang-zh', lang === 'zh');
    applyDocumentMeta(lang);
  };

  const setLanguage = (lang, { persist = true } = {}) => {
    if (lang !== 'en' && lang !== 'zh') return;
    currentLanguage = lang;
    if (persist) {
      try {
        localStorage.setItem('preferredLanguage', lang);
      } catch (error) {
        // localStorage may be unavailable in private browsing contexts.
      }
    }
    applyStaticTranslations(lang);
    listeners.forEach((listener) => listener(lang));
  };

  window.PortfolioI18n = {
    translations,
    getLanguage: () => currentLanguage,
    setLanguage,
    t: translate,
    get(path, lang = currentLanguage) {
      const value = getByPath(translations[lang], path);
      if (value !== undefined) return value;
      return getByPath(translations.en, path);
    },
    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    applyStaticTranslations,
  };

  document.addEventListener('DOMContentLoaded', () => {
    currentLanguage = getInitialLanguage();
    document.querySelectorAll('.language-option').forEach((button) => {
      button.addEventListener('click', () => {
        setLanguage(button.dataset.lang || 'en');
      });
    });
    applyStaticTranslations(currentLanguage);
  });
})();
