// ========================================================================
// ========================= 🎬 加载动画控制 START =========================
// ========================================================================

// 页面加载时显示加载动画,3秒后淡出
window.addEventListener('DOMContentLoaded', () => {
  const loadingOverlay = document.getElementById('loading-overlay');

  // 3秒后开始淡出
  setTimeout(() => {
    loadingOverlay.classList.add('fade-out');

    // 淡出动画完成后移除元素
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 800); // 0.8秒淡出动画时长
  }, 3000); // 3秒加载时长
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
