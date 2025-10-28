// ========================================================================
// ========================= 🎬 加载动画控制 START =========================
// ========================================================================

// 页面加载时显示加载动画，3秒后淡出
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
// ========================= 🎵 音乐配置区域 START =========================
// ========================================================================

// 播放列表数据将从 playlist.json 异步加载
let MUSIC_PLAYLIST = [];
let AUTO_PLAY = true;

// 从 JSON 文件加载播放列表
async function loadPlaylist() {
  try {
    const response = await fetch('playlist.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    MUSIC_PLAYLIST = data.tracks;
    AUTO_PLAY = data.autoPlay;
    console.log('播放列表加载成功:', MUSIC_PLAYLIST.length, '首歌曲');
    return true;
  } catch (error) {
    console.error('加载播放列表失败:', error);
    return false;
  }
}

// ========================================================================
// ========================== 🎵 音乐配置区域 END ==========================
// ========================================================================

// 获取DOM元素
const turntableBase = document.getElementById('turntableBase');
const miniVinyl = document.getElementById('miniVinyl');
const playerPanel = document.getElementById('playerPanel');
const statusLight = document.getElementById('statusLight');
const bgMusic = document.getElementById('backgroundMusic');
const panelTitle = document.getElementById('panelTitle');
const panelArtist = document.getElementById('panelArtist');
const panelPlayBtn = document.getElementById('panelPlayBtn');
const panelPlayIcon = document.getElementById('panelPlayIcon');
const panelPrevBtn = document.getElementById('panelPrevBtn');
const panelNextBtn = document.getElementById('panelNextBtn');
const playModeBtn = document.getElementById('playModeBtn');
const modeIcon = document.getElementById('modeIcon');
const playlistContainer = document.getElementById('playlist');
const progressBar = document.getElementById('progressBar');
const progressFilled = document.getElementById('progressFilled');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const audioWaveContainer = document.getElementById('audioWaveContainer');

let isPlaying = false;
let currentTrackIndex = 0;
let isPanelOpen = false;
let isDragging = false;
let dragStartX = 0;
let playMode = 'sequential'; // 'sequential' 或 'random'
let isFading = false;

// 初始化
async function init() {
  // 先加载播放列表
  const loaded = await loadPlaylist();

  if (!loaded) {
    statusLight.classList.remove('active');
    panelTitle.textContent = '加载失败';
    panelArtist.textContent = '无法加载播放列表';
    panelPlayIcon.className = 'play-icon';
    return;
  }

  if (MUSIC_PLAYLIST.length > 0 && MUSIC_PLAYLIST[0].src) {
    loadTrack(0);
    renderPlaylist();

    // 确保初始图标是播放状态
    panelPlayIcon.className = 'play-icon';
  } else {
    statusLight.classList.remove('active');
    panelTitle.textContent = '未加载音乐';
    panelArtist.textContent = '播放列表为空';
    panelPlayIcon.className = 'play-icon';
  }
}

// 淡出音频
function fadeOut(duration = 500) {
  return new Promise((resolve) => {
    if (bgMusic.volume === 0 || !isPlaying) {
      resolve();
      return;
    }

    isFading = true;
    const startVolume = bgMusic.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = Math.max(0, startVolume - (volumeStep * currentStep));
      bgMusic.volume = newVolume;

      if (currentStep >= steps || bgMusic.volume <= 0) {
        clearInterval(fadeInterval);
        bgMusic.volume = 0;
        isFading = false;
        resolve();
      }
    }, stepDuration);
  });
}

// 淡入音频
function fadeIn(duration = 500) {
  return new Promise((resolve) => {
    isFading = true;
    bgMusic.volume = 0;
    const targetVolume = 1;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = Math.min(1, volumeStep * currentStep);
      bgMusic.volume = newVolume;

      if (currentStep >= steps || bgMusic.volume >= 1) {
        clearInterval(fadeInterval);
        bgMusic.volume = 1;
        isFading = false;
        resolve();
      }
    }, stepDuration);
  });
}

// 加载音轨
function loadTrack(index) {
  const track = MUSIC_PLAYLIST[index];
  if (!track || !track.src) return;

  bgMusic.src = track.src;
  panelTitle.textContent = track.title;
  panelArtist.textContent = track.artist;
  currentTrackIndex = index;
  updatePlaylistUI();
}

// 带淡入淡出效果的切换音轨
async function switchTrack(index, autoPlay = false) {
  const wasPlaying = isPlaying;
  const shouldPlay = wasPlaying || autoPlay;

  if (wasPlaying) {
    await fadeOut(400);
    bgMusic.pause();
  }

  loadTrack(index);

  if (shouldPlay) {
    await bgMusic.play();
    await fadeIn(400);
  }
}

// 渲染播放列表
function renderPlaylist() {
  playlistContainer.innerHTML = '';
  MUSIC_PLAYLIST.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <div class="playlist-item-index">${index + 1}</div>
      <div class="playlist-item-info">
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
    `;
    item.addEventListener('click', () => {
      switchTrack(index);
    });
    playlistContainer.appendChild(item);
  });
  updatePlaylistUI();
}

// 更新播放列表UI
function updatePlaylistUI() {
  const items = playlistContainer.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// 切换播放/暂停
function togglePlay() {
  if (!MUSIC_PLAYLIST[currentTrackIndex]?.src) {
    console.log('未加载音频文件');
    return;
  }

  if (isPlaying) {
    bgMusic.pause();
  } else {
    bgMusic.play();
  }
}

// 获取随机索引（不重复当前歌曲）
function getRandomIndex() {
  if (MUSIC_PLAYLIST.length <= 1) return 0;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * MUSIC_PLAYLIST.length);
  } while (randomIndex === currentTrackIndex);
  return randomIndex;
}

// 上一首
function playPrevious() {
  let nextIndex;
  if (playMode === 'random') {
    nextIndex = getRandomIndex();
  } else {
    nextIndex = currentTrackIndex - 1;
    if (nextIndex < 0) {
      nextIndex = MUSIC_PLAYLIST.length - 1;
    }
  }
  switchTrack(nextIndex, false);
}

// 下一首
function playNext(autoPlay = false) {
  let nextIndex;
  if (playMode === 'random') {
    nextIndex = getRandomIndex();
  } else {
    nextIndex = currentTrackIndex + 1;
    if (nextIndex >= MUSIC_PLAYLIST.length) {
      nextIndex = 0;
    }
  }
  switchTrack(nextIndex, autoPlay);
}

// 切换播放模式
function togglePlayMode() {
  if (playMode === 'sequential') {
    playMode = 'random';
    modeIcon.innerHTML = '<i class="fas fa-random"></i>';
    playModeBtn.title = '随机播放';
    playModeBtn.classList.add('random');
  } else {
    playMode = 'sequential';
    modeIcon.innerHTML = '<i class="fas fa-list"></i>';
    playModeBtn.title = '顺序播放';
    playModeBtn.classList.remove('random');
  }
}

// 开始播放
function startPlaying() {
  isPlaying = true;
  miniVinyl.classList.add('playing');
  statusLight.classList.add('active');

  // 显示波浪动画
  if (audioWaveContainer) {
    audioWaveContainer.classList.add('active');
  }

  // 切换为暂停图标
  panelPlayIcon.className = 'pause-icon';
}

// 停止播放
function stopPlaying() {
  isPlaying = false;
  miniVinyl.classList.remove('playing');
  statusLight.classList.remove('active');

  // 隐藏波浪动画
  if (audioWaveContainer) {
    audioWaveContainer.classList.remove('active');
  }

  // 切换为播放图标
  panelPlayIcon.className = 'play-icon';
}

// 切换面板显示
function togglePanel() {
  isPanelOpen = !isPanelOpen;
  if (isPanelOpen) {
    playerPanel.classList.add('show');
  } else {
    playerPanel.classList.remove('show');
  }
}

// 格式化时间（秒转为 分:秒）
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 更新进度条
function updateProgress() {
  // 如果正在拖拽或音频正在跳转，则不更新，防止冲突
  if (isDragging || bgMusic.seeking) return;

  const duration = bgMusic.duration;
  const current = bgMusic.currentTime;

  if (duration && !isNaN(duration)) {
    const percentage = (current / duration) * 100;
    progressFilled.style.transition = 'width 0.1s linear';
    progressFilled.style.width = `${percentage}%`;
    currentTime.textContent = formatTime(current);
    totalTime.textContent = formatTime(duration);
  }
}

// 设置播放进度
function setProgress(clientX) {
  const rect = progressBar.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const width = rect.width;
  const percentage = Math.max(0, Math.min(1, clickX / width));
  const duration = bgMusic.duration;

  if (duration && !isNaN(duration)) {
    // 拖拽时移除过渡效果，立即更新
    progressFilled.style.transition = 'none';
    progressFilled.style.width = `${percentage * 100}%`;

    // 更新时间显示
    const newTime = duration * percentage;
    currentTime.textContent = formatTime(newTime);

    // 实际设置播放时间
    bgMusic.currentTime = newTime;
  }
}

// 处理拖拽开始
function handleDragStart(e) {
  e.preventDefault();
  e.stopPropagation();

  isDragging = true;
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  dragStartX = clientX;

  progressFilled.classList.add('active');
  progressFilled.classList.add('dragging');
  progressBar.classList.add('dragging');
  document.body.classList.add('dragging');
  progressBar.style.cursor = 'grabbing';

  setProgress(clientX);
}

// 处理拖拽中
function handleDragMove(e) {
  if (!isDragging) return;

  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  setProgress(clientX);
}

// 处理拖拽结束
function handleDragEnd(e) {
  if (!isDragging) return;

  isDragging = false;
  progressFilled.classList.remove('active');
  progressFilled.classList.remove('dragging');
  progressBar.classList.remove('dragging');
  document.body.classList.remove('dragging');
  progressBar.style.cursor = 'grab';

  // 恢复过渡效果
  setTimeout(() => {
    progressFilled.style.transition = 'width 0.1s linear';
  }, 50);
}

// 事件监听
turntableBase.addEventListener('click', togglePanel);

panelPlayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePlay();
});

panelPrevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playPrevious();
});

panelNextBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  playNext();
});

playModeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePlayMode();
});

bgMusic.addEventListener('play', startPlaying);
bgMusic.addEventListener('pause', stopPlaying);

// 当歌曲结束时，自动播放下一首
bgMusic.addEventListener('ended', () => {
  playNext(true); // 传入 true 表示自动播放
});

bgMusic.addEventListener('error', () => {
  console.error('音频加载失败:', MUSIC_PLAYLIST[currentTrackIndex]?.src);
  statusLight.classList.remove('active');
});

// 进度条事件监听
bgMusic.addEventListener('timeupdate', updateProgress);
bgMusic.addEventListener('loadedmetadata', updateProgress);

// 进度条拖拽 - 鼠标事件
progressBar.addEventListener('mousedown', (e) => {
  // 确保点击的是进度条区域，而不是其他元素
  handleDragStart(e);
});

// 在整个文档监听移动和释放，确保拖拽不会丢失
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    e.preventDefault();
    e.stopPropagation();
    handleDragMove(e);
  }
}, { capture: true, passive: false });

document.addEventListener('mouseup', (e) => {
  if (isDragging) {
    e.preventDefault();
    handleDragEnd(e);
  }
}, { capture: true });

// 阻止拖拽时的默认选择行为
document.addEventListener('selectstart', (e) => {
  if (isDragging) {
    e.preventDefault();
  }
});

// 防止拖拽时触发其他点击事件
document.addEventListener('click', (e) => {
  if (isDragging) {
    e.preventDefault();
    e.stopPropagation();
  }
}, { capture: true });

// 触摸设备支持
progressBar.addEventListener('touchstart', (e) => {
  handleDragStart(e);
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    e.preventDefault();
    handleDragMove(e);
  }
}, { passive: false });

document.addEventListener('touchend', (e) => {
  if (isDragging) {
    handleDragEnd(e);
  }
});

// 点击面板外部关闭面板
document.addEventListener('click', (e) => {
  if (isPanelOpen && !playerPanel.contains(e.target) && !turntableBase.contains(e.target)) {
    togglePanel();
  }
});

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

// ========================================================================
// ========================= 🧭 侧边栏导航逻辑 =============================
// ========================================================================

let navItems = document.querySelectorAll(".nav li");

function activeLink() {
  navItems.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}

navItems.forEach((item) => item.addEventListener("click", activeLink));

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
