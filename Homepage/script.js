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
  const detailTriggers = Array.from(projectsSection.querySelectorAll('.project-detail-trigger'));
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

    if (progressCurrent) {
      progressCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
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
      title: 'Lumen Arc',
      subtitle: 'Layered imagery for a window-display illusion.',
      description: 'The detail pass focuses on how the layers sync with the ambient light envelope.',
      meta: ['Role: Creative Direction', 'Timeline: 5 weeks'],
      media1Src: 'assets/project-03.svg',
      media2Src: 'assets/project-03.svg',
      media1Alt: 'Project 3 placeholder media 1',
      media2Alt: 'Project 3 placeholder media 2',
      media1Type: 'image',
      media2Type: 'image',
      splits: [
        {
          title: 'Layer Stack',
          body: 'Composite ordering to avoid visual collision and preserve depth.',
        },
        {
          title: 'Calibration Pass',
          body: 'Final adjustments for color drift and angular brightness.',
        },
      ],
    },
  ];

  const renderDetail = (index) => {
    if (!detailView) return;
    const data = detailContent[index] || detailContent[0];
    const setText = (selector, value) => {
      const el = detailView.querySelector(selector);
      if (el) el.textContent = value;
    };
    const setAll = (selector, values) => {
      const items = Array.from(detailView.querySelectorAll(selector));
      items.forEach((item, idx) => {
        item.textContent = values[idx] || values[values.length - 1] || '';
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
    setText('[data-detail="split1-title"]', data.splits[0].title);
    setText('[data-detail="split1-body"]', data.splits[0].body);
    setText('[data-detail="split2-title"]', data.splits[1].title);
    setText('[data-detail="split2-body"]', data.splits[1].body);
    const split1Title = detailView.querySelector('[data-detail="split1-title"]');
    const split2Title = detailView.querySelector('[data-detail="split2-title"]');
    if (split1Title) split1Title.style.display = data.splits[0].title ? 'block' : 'none';
    if (split2Title) split2Title.style.display = data.splits[1].title ? 'block' : 'none';

    const media1 = detailView.querySelector('[data-detail="media1"]');
    const media2 = detailView.querySelector('[data-detail="media2"]');
    const renderMedia = (container, media) => {
      if (!container) return;
      container.innerHTML = '';
      if (media.type === 'video') {
        const video = document.createElement('video');
        video.src = media.src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.setAttribute('aria-label', media.alt || 'Detail media video');
        container.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = media.alt || 'Detail media image';
        container.appendChild(img);
      }
    };
    renderMedia(media1, { type: data.media1Type || 'image', src: data.media1Src, alt: data.media1Alt });
    renderMedia(media2, { type: data.media2Type || 'image', src: data.media2Src, alt: data.media2Alt });

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
      lightboxImage.alt = alt || 'Detail preview';
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

  detailTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('.project-copy');
      const index = parent ? parseInt(parent.dataset.index, 10) : activeIndex;
      openDetail(Number.isNaN(index) ? activeIndex : index);
    });
  });

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

  updateClasses();
  animateDistortion();
});

// ========================================================================
// ========================= 🗓️ Experience Timeline =======================
// ========================================================================

const experienceItems = [
  {
    id: 'tust-undergrad',
    periodLabel: '2018–2021',
    stageTag: 'Undergraduate',
    orgName: 'Tianjin University of Science and Technology',
    roleOrMajor: 'B.Eng. in Mechatronic Engineering',
    summary: 'Completed undergraduate training in Mechatronic Engineering, following a structured curriculum with foundational exposure to mechanical systems, electronics, and applied engineering coursework.',
    highlights: [
      'Followed a full undergraduate curriculum covering mechanics, electronics, and control fundamentals',
      'Participated in selected academic competitions alongside coursework',
      'Developed disciplined study habits through structured engineering education',
      'University Scholarship recipient (2018–2021); First Prize in a university-level Mathematical Modeling Competition',
    ],
    tags: ['Mechatronics', 'Engineering Fundamentals', 'Mathematical Modeling', 'Undergraduate Study'],
    media: {
      mode: 'none',
      images: [],
    },
  },
  {
    id: 'foxconn-work',
    periodLabel: '2023–2024',
    stageTag: 'Work',
    orgName: 'Foxconn',
    roleOrMajor: 'Project Management (Automation Engineering)',
    summary: 'Supported project management activities within an automation engineering team, contributing to the planning, coordination, and ramp-up of automated production lines for consumer electronics manufacturing.',
    highlights: [
      'Assisted cross-functional teams in automation project execution and schedule alignment',
      'Supported automated production line setup, validation, and readiness for mass production',
      'Supported DFM documentation preparation and manufacturing feasibility verification',
      'Contributed to ramp-up activities to meet production volume and delivery readiness',
    ],
    tags: ['Project Management', 'Automation', 'DFM', 'Cross-functional Collaboration', 'PDCA'],
    media: {
      mode: 'none',
      images: [],
    },
  },
  {
    id: 'luxshare-work',
    periodLabel: '2024–2025',
    stageTag: 'Work',
    orgName: 'Luxshare',
    roleOrMajor: 'Assistant Product Design Engineer',
    summary: 'Worked as an assistant product design engineer, supporting the design and documentation of internal mechanical components for consumer electronics products.',
    highlights: [
      'Assisted in mechanical component design and engineering drawing management',
      'Prepared and maintained design change documentation during development iterations',
      'Supported component design verification and requirement alignment',
      'Collaborated with engineering teams throughout development cycles toward acceptance readiness',
    ],
    tags: ['Product Design', 'Mechanical Components', 'Engineering Documentation', 'AutoCAD', 'UG'],
    media: {
      mode: 'none',
      images: [],
    },
  },
  {
    id: 'sutd-grad',
    periodLabel: '2025–2026',
    stageTag: 'Graduate (Ongoing)',
    orgName: 'Singapore University of Technology and Design (SUTD)',
    roleOrMajor: 'MSc in Robotics and Automation (In Progress)',
    summary: 'Currently pursuing graduate studies in Robotics and Automation, focusing on building a solid foundation in robotics systems, control, and applied programming.',
    highlights: [
      'Studying core robotics and automation coursework during the first academic term',
      'Developing foundational skills in robot control, embedded systems, and system integration',
      'Applying programming and analytical tools through coursework and hands-on projects',
      'Selected course projects and technical work are showcased in the Projects section',
    ],
    tags: ['Robotics', 'Automation', 'Control Systems', 'Python', 'Arduino', 'MATLAB'],
    media: {
      mode: 'none',
      images: [],
    },
  },
];

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
      img.alt = 'Experience media';
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
        img.alt = 'Experience media collage';
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
    const clampedIndex = Math.max(0, Math.min(experienceItems.length - 1, index));
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

    renderDetail(experienceItems[activeIndex]);
  };

  if (timelineList) {
    timelineList.innerHTML = '';
    experienceItems.forEach((item, index) => {
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
        nextIndex = experienceItems.length - 1;
      }

      setActive(nextIndex, { focus: true });
    });
  }

  setActive(0, { force: true });
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
    const originalLabel = button.textContent;
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy');
      if (!text) return;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackCopy(text);
        }
        button.textContent = 'Copied';
        button.disabled = true;
        window.setTimeout(() => {
          button.textContent = originalLabel;
          button.disabled = false;
        }, 1200);
      } catch (error) {
        console.warn('Copy failed', error);
      }
    });
  });
});
