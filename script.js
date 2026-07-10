// ========================================================================
// ========================= 🎬 加载动画控制 START =========================
// ========================================================================

// 页面加载时显示开屏动画，资源就绪后再淡出
window.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.getElementById('loading-overlay');
  const pageContent = document.getElementById('page-content');
  const heroCta = document.querySelector('.hero-cta');

  if (!loadingOverlay || !pageContent) {
    document.body.classList.add('hero-reveal');
    return;
  }

  if (!location.hash || location.hash === '#home') {
    document.body.classList.add('home-locked');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  if (heroCta) {
    heroCta.addEventListener('click', () => {
      document.body.classList.remove('home-locked');
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        requestAnimationFrame(() => {
          aboutSection.scrollIntoView({ behavior: 'smooth' });
          history.replaceState(null, '', '#about');
        });
      }
    });
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    loadingOverlay.remove();
    document.body.classList.remove('splash-active', 'splash-exit');
    document.body.classList.add('hero-reveal');
    return;
  }

  const parseDuration = (value) => {
    const trimmed = value.trim();
    if (trimmed.endsWith('ms')) return parseFloat(trimmed);
    if (trimmed.endsWith('s')) return parseFloat(trimmed) * 1000;
    return parseFloat(trimmed);
  };

  const rootStyles = getComputedStyle(document.documentElement);
  const fadeInMs = parseDuration(rootStyles.getPropertyValue('--splash-fade-in'));
  const holdMs = parseDuration(rootStyles.getPropertyValue('--splash-hold'));
  const fadeOutMs = parseDuration(rootStyles.getPropertyValue('--splash-fade-out'));
  const minDisplayMs = fadeInMs + holdMs;
  const startTime = performance.now();

  const startExit = () => {
    document.body.classList.add('splash-exit');

    window.setTimeout(() => {
      loadingOverlay.remove();
      document.body.classList.remove('splash-active', 'splash-exit');
      document.body.classList.add('hero-reveal');
    }, fadeOutMs);
  };

  window.addEventListener('load', () => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, minDisplayMs - elapsed);
    window.setTimeout(startExit, remaining);
  }, { once: true });
});

// ========================================================================
// ========================== 🎬 加载动画控制 END ==========================
// ========================================================================

// ========================================================================
// ========================= 🧭 胶囊导航逻辑 ===============================
// ========================================================================

const navItems = document.querySelectorAll(".glass-capsule-nav .nav-links li");

function activeLink() {
  navItems.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}

navItems.forEach((item) => item.addEventListener("click", activeLink));

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.glass-capsule-nav');
  const cursor = document.getElementById('nav-cursor');
  const navLinks = document.querySelectorAll('.glass-capsule-nav .nav-links a');
  const musicTrigger = document.getElementById('music-trigger');
  const languageSwitcher = document.querySelector('.language-switcher');
  const themeSwitchLi = document.querySelector('.theme-switch-li');

  if (!nav || !cursor) {
    return;
  }

  const resetToContainer = () => {
    cursor.style.left = '0px';
    cursor.style.width = `${nav.clientWidth}px`;
    cursor.classList.remove('highlight');
  };

  const snapToLink = (target) => {
    if (!target) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = target.getBoundingClientRect();
    const navOffsetLeft = navRect.left + nav.clientLeft;
    cursor.style.left = `${linkRect.left - navOffsetLeft}px`;
    cursor.style.width = `${linkRect.width}px`;
    cursor.classList.add('highlight');
  };

  navLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => snapToLink(link));
    link.addEventListener('focus', () => snapToLink(link));
  });

  nav.addEventListener('mouseleave', resetToContainer);

  if (musicTrigger) {
    musicTrigger.addEventListener('mouseenter', resetToContainer);
    musicTrigger.addEventListener('focus', resetToContainer);
  }

  if (languageSwitcher) {
    languageSwitcher.addEventListener('mouseenter', resetToContainer);
    languageSwitcher.addEventListener('focusin', resetToContainer);
  }

  if (themeSwitchLi) {
    themeSwitchLi.addEventListener('mouseenter', resetToContainer);
    themeSwitchLi.addEventListener('focusin', resetToContainer);
  }

  window.addEventListener('resize', resetToContainer);

  requestAnimationFrame(resetToContainer);
});

// ========================================================================
// ========================= 🧾 About 入场/退场 ============================
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const aboutSection = document.getElementById('about');
  const nextSection = document.getElementById('projects');
  if (!aboutSection) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    aboutSection.classList.add('about-enter');
    return;
  }

  const parseDuration = (value, fallback) => {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (trimmed.endsWith('ms')) return parseFloat(trimmed);
    if (trimmed.endsWith('s')) return parseFloat(trimmed) * 1000;
    return parseFloat(trimmed);
  };

  const rootStyles = getComputedStyle(document.documentElement);
  const enterThresholdValue = parseFloat(rootStyles.getPropertyValue('--about-enter-threshold')) || 0.3;
  const exitTriggerValue = parseDuration(rootStyles.getPropertyValue('--about-exit-trigger'), 160);

  const entryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        aboutSection.classList.add('about-enter');
      }
    });
  }, { threshold: enterThresholdValue });

  entryObserver.observe(aboutSection);

  if (nextSection) {
    const exitObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          aboutSection.classList.add('about-exit');
        } else {
          aboutSection.classList.remove('about-exit');
        }
      });
    }, { rootMargin: `0px 0px -${exitTriggerValue}px 0px` });

    exitObserver.observe(nextSection);
  }
});

// ========================================================================
// ========================= 🎛 Projects 展柜交互 ==========================
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const viewHintModal = document.getElementById('view-hint-modal');
  const viewHintConfirm = document.getElementById('view-hint-confirm');
  if (!viewHintModal || !viewHintConfirm) {
    return;
  }

  const seenKey = 'viewHintSeen';
  const hideHint = () => {
    viewHintModal.classList.remove('show');
    viewHintModal.setAttribute('aria-hidden', 'true');
  };

  const acknowledge = () => {
    localStorage.setItem(seenKey, '1');
    hideHint();
  };

  viewHintConfirm.addEventListener('click', acknowledge);
  viewHintModal.addEventListener('click', (event) => {
    if (event.target === viewHintModal) {
      acknowledge();
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const projectsSection = document.querySelector('.projects-section');
  if (!projectsSection) {
    return;
  }

  const copyItems = Array.from(projectsSection.querySelectorAll('.project-copy'));
  const sphereImages = Array.from(projectsSection.querySelectorAll('.sphere-image'));
  const progressCurrent = projectsSection.querySelector('.project-progress-current');
  const progressTotal = projectsSection.querySelector('.project-progress-total');
  const displacementMap = projectsSection.querySelector('#sphere-distortion feDisplacementMap');
  const detailView = projectsSection.querySelector('.project-detail-view');
  const detailHotspot = projectsSection.querySelector('.project-detail-hotspot');
  const backButton = projectsSection.querySelector('.project-back');
  const lightbox = projectsSection.querySelector('.detail-lightbox');
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lightboxVideo = lightbox ? lightbox.querySelector('.lightbox-video') : null;
  const lightboxFrame = lightbox ? lightbox.querySelector('.lightbox-frame') : null;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rootStyles = getComputedStyle(document.documentElement);
  const parseNumber = (value, fallback) => {
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  };
  const parseDuration = (value, fallback) => {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (trimmed.endsWith('ms')) return parseFloat(trimmed);
    if (trimmed.endsWith('s')) return parseFloat(trimmed) * 1000;
    return parseFloat(trimmed);
  };

  const transitionMs = parseDuration(rootStyles.getPropertyValue('--projects-transition'), 780);
  const distortBase = parseNumber(rootStyles.getPropertyValue('--projects-distort-base'), 14);
  const distortPeak = parseNumber(rootStyles.getPropertyValue('--projects-distort-peak'), 28);
  const swipeThreshold = parseNumber(rootStyles.getPropertyValue('--projects-swipe-threshold'), 60);

  let activeIndex = 0;
  let isAnimating = false;
  let wheelAccum = 0;
  let wheelTimeout = null;
  let detailOpen = false;

  if (progressTotal) {
    progressTotal.textContent = String(copyItems.length).padStart(2, '0');
  }

  // T107: 球体视频按需播放——仅当 Projects 区块在视口内时才播放当前 active 视频，
  // 其余（含离屏时）一律暂停，避免多路 R2 视频同时解码。
  const applyVideoPlayback = () => {
    const inView = projectsSection.classList.contains('is-active');
    sphereImages.forEach((image, index) => {
      if (image.tagName !== 'VIDEO') return;
      if (inView && index === activeIndex) {
        image.play().catch(() => {});
      } else {
        image.pause();
      }
    });
  };

  const updateClasses = () => {
    const total = copyItems.length;
    copyItems.forEach((item, index) => {
      item.classList.toggle('is-active', index === activeIndex);
      item.classList.toggle('is-prev', index === (activeIndex - 1 + total) % total);
      item.classList.toggle('is-next', index === (activeIndex + 1) % total);
    });

    sphereImages.forEach((image, index) => {
      image.classList.toggle('is-active', index === activeIndex);
    });

    applyVideoPlayback();

    if (progressCurrent) {
      progressCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
    }

    if (detailHotspot) {
      detailHotspot.classList.remove('is-disabled');
    }
  };

  const detailContent = [
    {
      kicker: '',
      title: '',
      subtitle: '',
      descriptionHtml: 'This project is a one-week team-based competition combining mechanism design and control theory on a real robotic platform.<br><br>The task required a 6-DOF robotic arm to grasp objects at arbitrary positions, place them onto a mobile vehicle, and trigger the vehicle to autonomously navigate a color-coded maze.<br><br>I was primarily responsible for the robotic arm control, focusing on motion planning, calibration, and reliable execution under real-world hardware constraints.',
      meta: [],
      media1Src: 'assets/projects/project1/pic2.JPG',
      media2Src: 'assets/projects/project1/pic3.png',
      media1Alt: 'Project 1 detail media 1',
      media2Alt: 'Project 1 detail media 2',
      media1Type: 'image',
      media2Type: 'image',
      splits: [
        {
          title: 'Competition Outcome',
          body: 'The system was evaluated in a final live competition. Our team achieved 4th place, with all grasping tasks completed reliably during the final runs.',
        },
        {
          title: 'System Workflow',
          body: 'The workflow reflects how ideal kinematic models were adapted to real hardware conditions, including servo offsets, polarity differences, and power-related variation.',
        },
      ],
    },
    {
      kicker: '',
      title: 'Hango',
      subtitle: 'A semester-long interdisciplinary innovation design project.',
      description: 'Hango is a semester-long collaborative design project developed by a five-person interdisciplinary team. Through four staged presentations, we refined the concept from early research into a final prototype and exhibition narrative—balancing clarity, feasibility, and visitor experience. My contributions focused on visual communication, presentation structure, and the final exhibition prototype display video.',
      meta: [],
      media1Type: 'image',
      media1Src: 'assets/projects/project2/Pic1.jpg',
      media1Alt: 'Project 2 poster image',
      media2Type: 'image',
      media2Src: 'assets/projects/project2/Pic3.JPG',
      media2Alt: 'Project 2 detail photo',
      splits: [
        {
          title: 'Design Synthesis',
          body: 'The final exhibition poster condensed insights from four design phases into a single, cohesive narrative structure.',
        },
        {
          title: 'Team Collaboration',
          body: 'An interdisciplinary team of five, bringing together diverse backgrounds throughout the full design process.',
        },
      ],
    },
    {
      kicker: 'Project 03',
      title: 'FlexiLock: Variable Stiffness Support',
      subtitle: 'Soft compliant rest, rigid on demand.',
      description: 'Addressing the clinical need for "compliant at rest and stiff on demand" support, FlexiLock utilizes a bio-inspired vacuum-actuated scale jamming mechanism. It transitions from a highly flexible state to a rigid structure capable of outputting 5.88 Nm of bending moment at -60 kPa, specifically designed to manage MAS Grade 3-4 upper-limb spasticity.',
      meta: ['Role: Soft Robotics & Mechanism Design', 'Tech: 3D Printing, Vacuum Actuation'],
      paperUrl: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/Team%20Paper.pdf',
      splits: [
        {
          title: 'Bio-Inspired Scale Jamming',
          body: 'Inspired by pangolin armour geometry, we developed a variable stiffness mechanism utilizing geometric interlocking. Vacuum actuation creates robust friction between overlapping scales, allowing for rapid transition from soft to rigid states.',
          mediaSrcs: ['https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%90%AF%E5%8F%91.png'],
          mediaAlts: ['Bio-inspired scale jamming mechanism'],
        },
        {
          title: 'Design Iteration & Fabrication',
          body: 'The scale morphology underwent rigorous iterations to optimize the overlap ratio and friction interface. The final wearable assembly integrates these 3D-printed PLA scales within a custom-sealed nylon envelope to ensure reliable vacuum distribution.',
          mediaSrcs: [
            'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E9%B3%9E%E7%89%87%E8%BF%AD%E4%BB%A3.png',
            'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%B7%A5%E8%89%BA%E6%B5%81%E7%A8%8B.png',
          ],
          mediaAlts: ['Scale morphology iterations', 'Fabrication process workflow'],
        },
        {
          title: 'Mechanical Validation',
          body: 'Quantitative testing demonstrated the device\'s exceptional load-bearing capacity. Under a -60 kPa operating pressure, FlexiLock successfully withstood a 10 kg dead-weight load without visible deformation, yielding a 5.88 Nm bending moment.',
          mediaSrcs: ['https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/10kg%E8%B4%9F%E8%BD%BD%E8%AF%95%E9%AA%8C.png'],
          mediaAlts: ['10 kg dead-weight load validation test'],
        },
        {
          title: 'Mathematical Modeling & Analysis',
          body: 'Beyond physical prototyping, a dimensional analysis was performed to extract core non-dimensional groups. A power-law regression model was subsequently established to accurately predict force output based on overlap ratio, vacuum pressure, and structural deflection.',
          mediaSrcs: ['https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/model.png'],
          mediaAlts: ['Mathematical modeling and regression analysis'],
        },
      ],
    },
    {
      kicker: 'Project 04',
      title: 'Lab Security Guardian',
      subtitle: 'From Uncharted Exploration to AI-Driven Threat Detection.',
      description: 'This project implements a fully autonomous security agent for the SUTD Robotics Lab. The system is capable of exploring unknown environments without prior maps using a custom frontier-based SLAM algorithm. Once mapped, the robot executes multi-room patrol missions, utilizing an asynchronous vision server that combines YOLOv8 with OpenAI\'s CLIP model for real-time, zero-shot classification of staff and intruders.',
      meta: ['Role: System Architecture & Control | Tech: ROS2, YOLOv8, CLIP (ViT-B/32), Nav2, Lidar'],
      splits: [
        {
          title: 'AI Vision & Asynchronous Reasoning',
          body: 'To ensure non-blocking navigation, the vision server operates via an asynchronous task queue. It integrates YOLOv8 for detection and the CLIP (ViT-B/32) model for semantic classification. By fusing horizontal camera bearings with Lidar point clouds, the system accurately projects classified threat markers (Staff vs. Intruder) onto the global map with <20cm error.',
          mediaSrcs: [
            'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/intruder%E6%A3%80%E6%B5%8B.png',
            'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/staff%E6%A3%80%E6%B5%8B.png',
          ],
          mediaAlts: ['Intruder detection result', 'Staff detection result'],
        },
        {
          title: 'Mission Orchestration & Navigation',
          body: 'A robust state machine (MissionState) manages the patrolling lifecycle. The scheduler dispatches the robot to target rooms using Nav2, performs systematic 360° surveillance through timed 90° incremental rotations, and monitors for visual \'STOP\' signs to dynamically respect restricted operational zones.',
          mediaSrcs: ['https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%AE%9E%E6%8B%8D%E5%9B%BE.jpg'],
          mediaAlts: ['Test environment photo'],
        },
      ],
    },
  ];

  const getProjectItems = () => (
    (window.PortfolioI18n && window.PortfolioI18n.get('projects.items')) || []
  );

  const mergeProjectDetail = (base, translated) => {
    const merged = { ...(base || {}), ...(translated || {}) };
    const baseSplits = (base && base.splits) || [];
    const translatedSplits = (translated && translated.splits) || [];
    merged.splits = baseSplits.map((split, index) => ({
      ...split,
      ...(translatedSplits[index] || {}),
    }));
    if (translatedSplits.length > baseSplits.length) {
      merged.splits = merged.splits.concat(translatedSplits.slice(baseSplits.length));
    }
    return merged;
  };

  const getProjectDetail = (index) => {
    const translatedDetails = (window.PortfolioI18n && window.PortfolioI18n.get('projects.details')) || [];
    return mergeProjectDetail(detailContent[index] || detailContent[0], translatedDetails[index]);
  };

  const updateProjectCopy = () => {
    const items = getProjectItems();
    copyItems.forEach((item, index) => {
      const data = items[index];
      if (!data) return;
      const eyebrow = item.querySelector('.project-eyebrow');
      const title = item.querySelector('.project-title');
      const subtitle = item.querySelector('.project-subtitle');
      if (eyebrow) eyebrow.textContent = data.eyebrow || '';
      if (title) title.textContent = data.title || '';
      if (subtitle) subtitle.textContent = data.subtitle || '';
    });
  };

  const renderDetail = (index) => {
    if (!detailView) return;
    const data = getProjectDetail(index);
    const setText = (selector, value) => {
      const el = detailView.querySelector(selector);
      if (el) el.textContent = value;
    };
    const setAll = (selector, values) => {
      const items = Array.from(detailView.querySelectorAll(selector));
      items.forEach((item, idx) => {
        const text = values[idx] || '';
        item.textContent = text;
        item.style.display = text ? '' : 'none';
      });
    };
    setText('[data-detail="kicker"]', data.kicker);
    setText('[data-detail="title"]', data.title);
    setText('[data-detail="subtitle"]', data.subtitle);
    const kickerEl = detailView.querySelector('[data-detail="kicker"]');
    const titleEl = detailView.querySelector('[data-detail="title"]');
    const subtitleEl = detailView.querySelector('[data-detail="subtitle"]');
    if (kickerEl) kickerEl.style.display = data.kicker ? 'block' : 'none';
    if (titleEl) titleEl.style.display = data.title ? 'block' : 'none';
    if (subtitleEl) subtitleEl.style.display = data.subtitle ? 'block' : 'none';
    const descriptionEl = detailView.querySelector('[data-detail="description"]');
    if (descriptionEl) {
      const hasHtml = Boolean(data.descriptionHtml);
      const hasText = Boolean(data.description);
      if (hasHtml) {
        descriptionEl.innerHTML = data.descriptionHtml;
      } else {
        descriptionEl.textContent = data.description || '';
      }
      descriptionEl.style.display = hasHtml || hasText ? 'block' : 'none';
    }
    setAll('[data-detail="meta1"], [data-detail="meta2"]', data.meta);
    const metaBlock = detailView.querySelector('.detail-meta');
    if (metaBlock) {
      metaBlock.style.display = data.meta.length ? 'grid' : 'none';
    }

    const panel = detailView.querySelector('.project-detail-panel');
    const existingPaperLink = detailView.querySelector('.detail-paper-link');
    if (existingPaperLink) existingPaperLink.remove();
    if (data.paperUrl && panel) {
      const paperLink = document.createElement('a');
      paperLink.className = 'detail-paper-link';
      paperLink.href = data.paperUrl;
      paperLink.target = '_blank';
      paperLink.rel = 'noopener noreferrer';
      const paperText = (window.PortfolioI18n && window.PortfolioI18n.t('projects.paperLink')) || 'View Full Research Paper';
      paperLink.innerHTML = `<svg class="icon" width="16" height="16" aria-hidden="true"><use href="assets/icons.svg#icon-file-pdf"></use></svg> ${paperText}`;
      panel.appendChild(paperLink);
    }

    const sectionsContainer = detailView.querySelector('.project-detail-sections');
    if (sectionsContainer) {
      sectionsContainer.innerHTML = '';
      (data.splits || []).forEach((split, idx) => {
        const article = document.createElement('article');
        article.className = 'detail-split';

        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'detail-media';
        mediaDiv.setAttribute('data-detail', `media${idx + 1}`);

        if (split.mediaSrcs && split.mediaSrcs.length > 0) {
          if (split.mediaSrcs.length > 1) {
            mediaDiv.classList.add('detail-media--pair');
            const pair = document.createElement('div');
            pair.className = 'detail-media-pair';
            split.mediaSrcs.forEach((src, imgIdx) => {
              const img = document.createElement('img');
              img.src = src;
              img.alt = (split.mediaAlts && split.mediaAlts[imgIdx]) || '';
              pair.appendChild(img);
            });
            mediaDiv.appendChild(pair);
          } else if (split.mediaType === 'video') {
            const video = document.createElement('video');
            video.src = split.mediaSrcs[0];
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.setAttribute('aria-label', (split.mediaAlts && split.mediaAlts[0]) || ((window.PortfolioI18n && window.PortfolioI18n.t('projects.detailVideoLabel')) || 'Detail media video'));
            mediaDiv.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = split.mediaSrcs[0];
            img.alt = (split.mediaAlts && split.mediaAlts[0]) || '';
            mediaDiv.appendChild(img);
          }
        } else {
          const legacySrc = idx === 0 ? data.media1Src : data.media2Src;
          const legacyAlt = idx === 0 ? data.media1Alt : data.media2Alt;
          const legacyType = idx === 0 ? (data.media1Type || 'image') : (data.media2Type || 'image');
          if (legacySrc) {
            if (legacyType === 'video') {
              const video = document.createElement('video');
              video.src = legacySrc;
              video.muted = true;
              video.loop = true;
              video.playsInline = true;
              video.autoplay = true;
              video.setAttribute('aria-label', legacyAlt || ((window.PortfolioI18n && window.PortfolioI18n.t('projects.detailVideoLabel')) || 'Detail media video'));
              mediaDiv.appendChild(video);
            } else {
              const img = document.createElement('img');
              img.src = legacySrc;
              img.alt = legacyAlt || '';
              mediaDiv.appendChild(img);
            }
          }
        }

        const textDiv = document.createElement('div');
        textDiv.className = 'detail-split-text';
        const h4 = document.createElement('h4');
        h4.textContent = split.title;
        const p = document.createElement('p');
        p.textContent = split.body;
        textDiv.appendChild(h4);
        textDiv.appendChild(p);

        if (mediaDiv.hasChildNodes()) {
          article.appendChild(mediaDiv);
        }
        article.appendChild(textDiv);
        sectionsContainer.appendChild(article);
      });
    }

    detailView.querySelectorAll('.detail-media').forEach((media) => {
      media.onclick = () => {
        const target = media.querySelector('video') || media.querySelector('img');
        if (target) {
          openMediaFromElement(target);
        }
      };
    });
  };

  const scrollToProjects = () => {
    projectsSection.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-active', 'is-prep', 'is-image', 'is-video');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxFrame) {
      lightboxFrame.style.setProperty('--lightbox-drag-y', '0px');
    }
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
    }
    if (lightboxImage) {
      lightboxImage.removeAttribute('src');
      lightboxImage.alt = '';
    }
  };

  const openMediaFromElement = (element) => {
    if (!element) return;
    if (element.tagName === 'VIDEO') {
      openLightbox({
        type: 'video',
        src: element.currentSrc || element.src,
        originEl: element,
      });
      return;
    }
    if (element.tagName === 'IMG') {
      openLightbox({
        type: 'image',
        src: element.currentSrc || element.src,
        alt: element.alt,
        originEl: element,
      });
    }
  };

  const openLightbox = ({ type, src, alt, originEl }) => {
    if (!lightbox || !src) return;
    if (lightboxFrame && originEl) {
      const originRect = originEl.getBoundingClientRect();
      const frameRect = lightboxFrame.getBoundingClientRect();
      const scale = Math.min(
        originRect.width / frameRect.width,
        originRect.height / frameRect.height,
      );
      const translateX = originRect.left - frameRect.left;
      const translateY = originRect.top - frameRect.top;
      lightboxFrame.style.setProperty('--lightbox-x', `${translateX}px`);
      lightboxFrame.style.setProperty('--lightbox-y', `${translateY}px`);
      lightboxFrame.style.setProperty('--lightbox-scale', `${scale}`);
    }
    lightbox.classList.add('is-prep');
    lightbox.classList.toggle('is-image', type === 'image');
    lightbox.classList.toggle('is-video', type === 'video');
    lightbox.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      lightbox.classList.add('is-active');
    });
    if (type === 'video' && lightboxVideo) {
      lightboxVideo.src = src;
      lightboxVideo.currentTime = 0;
      lightboxVideo.play().catch(() => {});
    }
    if (type === 'image' && lightboxImage) {
      lightboxImage.src = src;
      lightboxImage.alt = alt || ((window.PortfolioI18n && window.PortfolioI18n.t('projects.detailPreview')) || 'Detail preview');
    }
  };

  const openDetail = (index, fromHistory = false) => {
    if (detailOpen && activeIndex === index) return;
    detailOpen = true;
    activeIndex = index;
    updateClasses();
    renderDetail(activeIndex);
    projectsSection.classList.add('is-detail');
    if (detailView) {
      detailView.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('detail-mode');
    scrollToProjects();
    if (!fromHistory) {
      history.pushState({ detail: true, index: activeIndex }, '', '#projects-detail');
    }
  };

  const sphere = projectsSection.querySelector('.project-sphere');
  if (sphere) {
    sphere.addEventListener('click', () => {
      if (!detailOpen) return;
      const sphereVideo = sphere.querySelector('video.is-active') || sphere.querySelector('video');
      if (sphereVideo) {
        openMediaFromElement(sphereVideo);
        return;
      }
      const sphereImage = sphere.querySelector('img.is-active') || sphere.querySelector('img');
      if (sphereImage) {
        openMediaFromElement(sphereImage);
      }
    });
  }

  const closeDetail = (fromHistory = false) => {
    if (!detailOpen) return;
    detailOpen = false;
    closeLightbox();
    projectsSection.classList.remove('is-detail');
    if (detailView) {
      detailView.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('detail-mode');
    scrollToProjects();
    if (!fromHistory && history.state && history.state.detail) {
      history.back();
    }
  };

  const animateDistortion = () => {
    if (prefersReducedMotion || !displacementMap) {
      return;
    }
    const start = performance.now();
    const from = distortPeak;
    const to = distortBase;
    const animate = (time) => {
      const progress = Math.min((time - start) / transitionMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = from - (from - to) * eased;
      displacementMap.setAttribute('scale', value.toFixed(2));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    displacementMap.setAttribute('scale', String(from));
    requestAnimationFrame(animate);
  };

  const goToIndex = (nextIndex) => {
    if (isAnimating) return;
    const total = copyItems.length;
    const boundedIndex = (nextIndex + total) % total;
    if (boundedIndex === activeIndex) return;
    isAnimating = true;
    activeIndex = boundedIndex;
    updateClasses();
    animateDistortion();
    window.setTimeout(() => {
      isAnimating = false;
    }, transitionMs);
  };

  const goNext = () => goToIndex(activeIndex + 1);
  const goPrev = () => goToIndex(activeIndex - 1);

  document.addEventListener('keydown', (event) => {
    if (detailOpen) return;
    if (!projectsSection.matches(':hover') && !projectsSection.contains(document.activeElement)) {
      return;
    }
    if (event.key === 'ArrowRight') {
      goNext();
    }
    if (event.key === 'ArrowLeft') {
      goPrev();
    }
  });

  const projectsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        projectsSection.classList.add('is-active');
      } else {
        projectsSection.classList.remove('is-active');
      }
    });
    applyVideoPlayback();
  }, { threshold: 0.5 });

  projectsObserver.observe(projectsSection);

  projectsSection.addEventListener('wheel', (event) => {
    if (detailOpen) return;
    const useHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!useHorizontal && !event.shiftKey) {
      return;
    }
    const delta = useHorizontal ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 4) return;
    event.preventDefault();
    wheelAccum += delta;
    window.clearTimeout(wheelTimeout);
    wheelTimeout = window.setTimeout(() => {
      wheelAccum = 0;
    }, 180);
    if (Math.abs(wheelAccum) >= swipeThreshold) {
      if (wheelAccum > 0) {
        goNext();
      } else {
        goPrev();
      }
      wheelAccum = 0;
    }
  }, { passive: false });

  let pointerStartX = 0;
  let pointerActive = false;
  let pointerLocked = false;

  projectsSection.addEventListener('pointerdown', (event) => {
    if (detailOpen) return;
    if (event.button !== 0) return;
    if (event.target.closest('button, a, input, textarea, select')) {
      return;
    }
    pointerActive = true;
    pointerLocked = false;
    pointerStartX = event.clientX;
    projectsSection.setPointerCapture(event.pointerId);
  });

  projectsSection.addEventListener('pointermove', (event) => {
    if (detailOpen) return;
    if (!pointerActive || pointerLocked) return;
    const deltaX = event.clientX - pointerStartX;
    if (Math.abs(deltaX) >= swipeThreshold) {
      pointerLocked = true;
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
  });

  projectsSection.addEventListener('pointerup', () => {
    if (detailOpen) return;
    pointerActive = false;
    pointerLocked = false;
  });

  projectsSection.addEventListener('pointercancel', () => {
    if (detailOpen) return;
    pointerActive = false;
    pointerLocked = false;
  });

  if (detailHotspot) {
    detailHotspot.addEventListener('click', () => {
      openDetail(activeIndex);
    });
  }

  projectsSection.addEventListener('click', (event) => {
    if (!detailOpen) return;
    const detailImage = event.target.closest('.detail-media img');
    if (detailImage) {
      openLightbox({
        type: 'image',
        src: detailImage.currentSrc || detailImage.src,
        alt: detailImage.alt,
        originEl: detailImage,
      });
      return;
    }
    const detailMedia = event.target.closest('.detail-media');
    if (detailMedia) {
      const detailVideo = detailMedia.querySelector('video');
      if (detailVideo) {
        openLightbox({
          type: 'video',
          src: detailVideo.currentSrc || detailVideo.src,
          originEl: detailVideo,
        });
        return;
      }
    }
    const heroVideo = event.target.closest('.project-sphere video');
    if (heroVideo) {
      openLightbox({ type: 'video', src: heroVideo.currentSrc || heroVideo.src, originEl: heroVideo });
      return;
    }
    const heroSphere = event.target.closest('.project-sphere');
    if (heroSphere) {
      const heroImage = heroSphere.querySelector('img');
      if (heroImage) {
        openLightbox({
          type: 'image',
          src: heroImage.currentSrc || heroImage.src,
          alt: heroImage.alt,
          originEl: heroImage,
        });
        return;
      }
      const sphereVideo = heroSphere.querySelector('video');
      if (sphereVideo) {
        openLightbox({
          type: 'video',
          src: sphereVideo.currentSrc || sphereVideo.src,
          originEl: sphereVideo,
        });
      }
    }
  });

  if (lightbox && lightboxFrame) {
    let dragStartY = 0;
    let dragStartOffset = 0;
    let isDragging = false;

    const getDragOffset = () => {
      const value = getComputedStyle(lightboxFrame).getPropertyValue('--lightbox-drag-y');
      return parseFloat(value) || 0;
    };

    const onPointerDown = (event) => {
      if (event.button === 2) return;
      isDragging = true;
      dragStartY = event.clientY;
      dragStartOffset = getDragOffset();
      lightbox.classList.add('is-dragging');
      lightboxFrame.setPointerCapture(event.pointerId);
      event.preventDefault();
    };

    const onPointerMove = (event) => {
      if (!isDragging) return;
      const next = dragStartOffset + (event.clientY - dragStartY);
      lightboxFrame.style.setProperty('--lightbox-drag-y', `${next}px`);
      event.preventDefault();
    };

    const onPointerUp = (event) => {
      if (!isDragging) return;
      isDragging = false;
      lightbox.classList.remove('is-dragging');
      lightboxFrame.releasePointerCapture(event.pointerId);
    };

    lightboxFrame.addEventListener('pointerdown', onPointerDown);
    lightboxFrame.addEventListener('pointermove', onPointerMove);
    lightboxFrame.addEventListener('pointerup', onPointerUp);
    lightboxFrame.addEventListener('pointercancel', onPointerUp);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  if (backButton) {
    backButton.addEventListener('click', () => {
      closeDetail();
    });
  }

  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.detail) {
      openDetail(event.state.index, true);
      return;
    }
    closeDetail(true);
  });

  if (location.hash === '#projects-detail') {
    openDetail(activeIndex, true);
  }

  updateProjectCopy();
  updateClasses();
  animateDistortion();

  if (window.PortfolioI18n) {
    window.PortfolioI18n.onChange(() => {
      updateProjectCopy();
      if (detailOpen) {
        renderDetail(activeIndex);
      }
    });
  }
});

// ========================================================================
// ========================= 🗓️ Experience Timeline =======================
// ========================================================================

const experienceItems = [
  {
    id: 'tust-undergrad',
    periodLabel: '2018–2021',
    stageTag: 'Undergraduate',
    orgName: 'Tianjin University of Science & Technology',
    roleOrMajor: 'B.Eng. in Mechatronic Engineering',
    summary: 'Completed undergraduate training in mechatronic engineering, building a foundation in mechanical systems, electronics, control fundamentals, and applied engineering coursework.',
    highlights: [
      'Studied mechanical design, electronics, control fundamentals, and engineering mathematics.',
      'Developed early exposure to mathematical modeling and structured engineering problem solving.',
      'Received university scholarship recognition and participated in academic competitions.',
    ],
    tags: ['Mechatronics', 'Control Fundamentals', 'Engineering Mathematics', 'Mechanical Systems'],
    media: {
      mode: 'single',
      images: ['assets/experience/1.jpeg'],
    },
  },
  {
    id: 'foxconn-work',
    periodLabel: '2023–2024',
    stageTag: 'Work',
    orgName: 'Foxconn',
    roleOrMajor: 'Assistant Project Manager / Automation Engineering Support',
    summary: 'Supported project management and manufacturing coordination activities for automated production line ramp-up in consumer electronics manufacturing.',
    highlights: [
      'Coordinated cross-functional project tasks, meeting follow-ups, and action tracking during production preparation.',
      'Supported RFP preparation, DFM review, and project documentation for new product introduction activities.',
      'Tracked MP-stage anomalies and followed up corrective actions with manufacturing teams.',
      'Contributed to production ramp-up readiness through schedule alignment, documentation control, and issue tracking.',
    ],
    tags: ['Project Management', 'Automation', 'NPI', 'DFM', 'Manufacturing Coordination'],
    media: {
      mode: 'single',
      images: ['assets/experience/2.jpeg'],
    },
  },
  {
    id: 'luxshare-work',
    periodLabel: '2024–2025',
    stageTag: 'Work',
    orgName: 'Luxshare-ICT',
    roleOrMajor: 'Assistant Product Design Engineer',
    summary: 'Supported internal mechanical component design documentation, engineering change tracking, and NPI build documentation for consumer electronics products.',
    highlights: [
      'Managed engineering drawing and BOM documentation for NPI builds, supporting version accuracy and release readiness.',
      'Prepared ECR/ECO comparison reports to track design changes, revision impact, and approval requirements.',
      'Used Siemens NX and AutoCAD to review 3D/2D drawings, mark up changes, and support manufacturing communication.',
      'Supported component design verification, installation documentation, and cross-functional engineering coordination.',
    ],
    tags: ['Product Design', 'NPI', 'Engineering Documentation', 'ECO/ECR', 'Siemens NX', 'AutoCAD'],
    media: {
      mode: 'single',
      images: ['assets/experience/3.jpg'],
    },
  },
  {
    id: 'sutd-grad',
    periodLabel: '2025–2026',
    stageTag: 'Graduate (Ongoing)',
    orgName: 'Singapore University of Technology and Design (SUTD)',
    roleOrMajor: 'MSc in Robotics & Automation',
    summary: 'Pursuing graduate study in Robotics & Automation with hands-on coursework and projects covering mobile robotics, control, robot intelligence, soft robotics, and design project development.',
    highlights: [
      'Built and tested course projects involving TurtleBot3, ROS navigation, visual recognition, SLAM testing, and robotic arm control.',
      'Completed a real-robot Autonomous Security Robot demo using Ubuntu laptop + TurtleBot3, ROS navigation, YOLO/CLIP-based visual recognition, and exploratory SLAM testing.',
      'Completed a Robotic Arm Challenge involving 6-DOF arm control, calibration, object grasping, and task integration with a mobile robot.',
      'Developing a capstone Design Project focused on robotics/automation system integration, prototyping, testing, and final demonstration.',
    ],
    tags: ['ROS', 'TurtleBot3', 'Robot Navigation', 'YOLO', 'CLIP', 'SLAM Testing', 'Robotic Arm', 'System Integration'],
    media: {
      mode: 'single',
      images: ['assets/experience/4.jpg'],
    },
  },
];

const getExperienceItems = () => {
  const translatedItems = (window.PortfolioI18n && window.PortfolioI18n.get('experience.items')) || [];
  if (!translatedItems.length) return experienceItems;
  return experienceItems.map((item, index) => ({
    ...item,
    ...(translatedItems[index] || {}),
    media: item.media,
  }));
};

const experienceSection = document.getElementById('experience');
if (experienceSection) {
  const timelineList = experienceSection.querySelector('.experience-timeline-list');
  const card = experienceSection.querySelector('[data-experience-card]');
  const mediaEl = experienceSection.querySelector('[data-experience-media]');
  const orgEl = experienceSection.querySelector('[data-experience-org]');
  const roleEl = experienceSection.querySelector('[data-experience-role]');
  const summaryEl = experienceSection.querySelector('[data-experience-summary]');
  const highlightsEl = experienceSection.querySelector('[data-experience-highlights]');
  const tagsEl = experienceSection.querySelector('[data-experience-tags]');
  const linksEl = experienceSection.querySelector('[data-experience-links]');

  let activeIndex = 0;

  const buildMedia = (media) => {
    if (!mediaEl) return;
    mediaEl.innerHTML = '';
    mediaEl.classList.remove('is-collage', 'is-single', 'is-none');

    if (media.mode === 'single' && media.images && media.images.length > 0) {
      mediaEl.classList.add('is-single');
      const img = document.createElement('img');
      img.src = media.images[0];
      img.alt = (window.PortfolioI18n && window.PortfolioI18n.t('experience.mediaAlt')) || 'Experience media';
      mediaEl.appendChild(img);
      return;
    }

    if (media.mode === 'collage' && media.images && media.images.length > 1) {
      mediaEl.classList.add('is-collage');
      const collage = document.createElement('div');
      collage.className = 'experience-media-collage';
      media.images.slice(0, 2).forEach((src) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = (window.PortfolioI18n && window.PortfolioI18n.t('experience.mediaCollageAlt')) || 'Experience media collage';
        collage.appendChild(img);
      });
      mediaEl.appendChild(collage);
      return;
    }

    mediaEl.classList.add('is-none');
    const placeholder = document.createElement('div');
    placeholder.className = 'experience-media-placeholder';
    mediaEl.appendChild(placeholder);
  };

  const renderDetail = (item) => {
    if (!item || !card) return;
    card.classList.remove('is-visible');

    if (orgEl) orgEl.textContent = item.orgName;
    if (roleEl) roleEl.textContent = item.roleOrMajor;
    if (summaryEl) summaryEl.textContent = item.summary;

    if (highlightsEl) {
      highlightsEl.innerHTML = '';
      item.highlights.forEach((highlight) => {
        const li = document.createElement('li');
        li.textContent = highlight;
        highlightsEl.appendChild(li);
      });
    }

    if (tagsEl) {
      tagsEl.innerHTML = '';
      item.tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'experience-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }

    if (linksEl) {
      linksEl.innerHTML = '';
      if (item.links && item.links.length > 0) {
        linksEl.style.display = '';
        item.links.forEach((link) => {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = link.label;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          linksEl.appendChild(a);
        });
      } else {
        linksEl.style.display = 'none';
      }
    }

    buildMedia(item.media);

    requestAnimationFrame(() => {
      card.classList.add('is-visible');
    });
  };

  const setActive = (index, { focus = false, force = false } = {}) => {
    if (!timelineList) return;
    const items = getExperienceItems();
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    if (!force && clampedIndex === activeIndex) return;
    activeIndex = clampedIndex;

    const buttons = Array.from(timelineList.querySelectorAll('.experience-timeline-item'));
    buttons.forEach((button, idx) => {
      const isActive = idx === activeIndex;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.setAttribute('tabindex', isActive ? '0' : '-1');
      if (isActive && focus) {
        button.focus({ preventScroll: true });
        button.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    });

    renderDetail(items[activeIndex]);
  };

  const buildTimeline = () => {
    if (!timelineList) return;
    const items = getExperienceItems();
    activeIndex = Math.max(0, Math.min(items.length - 1, activeIndex));
    timelineList.innerHTML = '';
    items.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'experience-timeline-item';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('tabindex', index === 0 ? '0' : '-1');
      button.dataset.index = String(index);

      const period = document.createElement('span');
      period.className = 'experience-period';
      period.textContent = item.periodLabel;

      const stage = document.createElement('span');
      stage.className = 'experience-stage-tag';
      stage.textContent = item.stageTag;

      if (index === 0) {
        button.classList.add('is-active');
      }

      button.appendChild(period);
      button.appendChild(stage);
      button.addEventListener('click', () => setActive(index, { focus: true }));
      timelineList.appendChild(button);
    });
  };

  if (timelineList) {
    buildTimeline();
    timelineList.addEventListener('keydown', (event) => {
      const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();

      let nextIndex = activeIndex;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        nextIndex = activeIndex + 1;
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        nextIndex = activeIndex - 1;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = getExperienceItems().length - 1;
      }

      setActive(nextIndex, { focus: true });
    });
  }

  setActive(0, { force: true });

  if (window.PortfolioI18n) {
    window.PortfolioI18n.onChange(() => {
      buildTimeline();
      setActive(activeIndex, { force: true });
    });
  }
}

// ========================================================================
// ========================= 🌓 明暗主题切换逻辑 ===========================
// ========================================================================

const themeSwitch = document.querySelector('.theme-switch');
const body = document.body;

// 页面加载时检查并应用保存的主题
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light-mode') {
    body.classList.add('light-mode');

    // 🎨 确保 Shader 背景同步
    if (window.shaderBackground) {
      window.shaderBackground.transitionProgress = 1;
    }
  }
}

// 切换主题
function toggleTheme() {
  body.classList.toggle('light-mode');

  // 🎨 触发 Shader 背景过渡
  if (window.shaderBackground) {
    if (body.classList.contains('light-mode')) {
      window.shaderBackground.transitionToLight(1500); // 1.5秒过渡
    } else {
      window.shaderBackground.transitionToDark(1500);
    }
  }

  // 保存主题选择到 localStorage
  if (body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light-mode');
  } else {
    localStorage.setItem('theme', 'dark-mode');
  }
}

// 添加点击事件监听器
if (themeSwitch) {
  themeSwitch.addEventListener('click', toggleTheme);
}

// 页面加载时立即应用保存的主题
loadSavedTheme();

// ========================================================================
// ========================= 🎵 音乐区域确认弹窗 ===========================
// ========================================================================

const musicTrigger = document.getElementById('music-trigger');
const musicModal = document.getElementById('music-confirm-modal');
const musicCancelBtn = document.getElementById('music-cancel-btn');
const musicConfirmBtn = document.getElementById('music-confirm-btn');

// 点击Music Zone按钮显示弹窗
if (musicTrigger) {
  musicTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (musicModal) {
      musicModal.classList.add('show');
    }
  });
}

// 点击取消按钮关闭弹窗
if (musicCancelBtn) {
  musicCancelBtn.addEventListener('click', () => {
    if (musicModal) {
      musicModal.classList.remove('show');
    }
  });
}

// 点击确认按钮跳转到音乐页面
if (musicConfirmBtn) {
  musicConfirmBtn.addEventListener('click', () => {
    window.location.href = 'music-player.html';
  });
}

// 点击弹窗外部区域关闭弹窗
if (musicModal) {
  musicModal.addEventListener('click', (e) => {
    if (e.target === musicModal) {
      musicModal.classList.remove('show');
    }
  });
}

// ========================================================================
// ====================== 📋 Contact Copy Buttons ==========================
// ========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const copyButtons = document.querySelectorAll('[data-copy]');
  if (!copyButtons.length) return;

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.setAttribute('readonly', '');
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy');
      if (!text) return;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackCopy(text);
        }
        button.textContent = (window.PortfolioI18n && window.PortfolioI18n.t('common.copied')) || 'Copied';
        button.disabled = true;
        window.setTimeout(() => {
          button.textContent = (window.PortfolioI18n && window.PortfolioI18n.t('common.copy')) || 'Copy';
          button.disabled = false;
        }, 1200);
      } catch (error) {
        console.warn('Copy failed', error);
      }
    });
  });
});
