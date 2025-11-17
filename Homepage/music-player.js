// ========================================================================
// ========================= 🎵 音乐播放器核心逻辑 =========================
// ========================================================================

// 获取DOM元素
const audioPlayer = document.getElementById('audioPlayer');
const vinylDisc = document.getElementById('vinylDisc');
const vinylLabel = document.getElementById('vinylLabel');
const labelTitle = document.getElementById('labelTitle');
const labelArtist = document.getElementById('labelArtist');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const playBtnPlayer = document.getElementById('playBtnPlayer');
const playIconPlayer = document.getElementById('playIconPlayer');
const prevBtnPlayer = document.getElementById('prevBtnPlayer');
const nextBtnPlayer = document.getElementById('nextBtnPlayer');
const modeBtnPlayer = document.getElementById('modeBtnPlayer');
const volumeBtn = document.getElementById('volumeBtn');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');
const volumeFill = document.getElementById('volumeFill');
const volumeThumb = document.getElementById('volumeThumb');
const progressBarContainer = document.getElementById('progressBarContainer');
const progressBarFill = document.getElementById('progressBarFill');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const totalTimeDisplay = document.getElementById('totalTimeDisplay');
const playlistItems = document.getElementById('playlistItems');
const audioVisualizer = document.getElementById('audioVisualizer');
const playlistToggle = document.getElementById('playlistToggle');
const playlistToggleIcon = document.getElementById('playlistToggleIcon');
const playlistContainer = document.querySelector('.playlist-container');
const playlistCount = document.getElementById('playlistCount');

// 播放状态变量
let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let playMode = 'sequential'; // 'sequential' 或 'random'
let isDraggingProgress = false;
let isPlaylistCollapsed = false;

// ========================================================================
// ========================= 🎼 播放列表加载 ===============================
// ========================================================================

async function loadPlaylist() {
  try {
    const response = await fetch('playlist.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    playlist = data.tracks;
    console.log('播放列表加载成功:', playlist.length, '首歌曲');

    if (playlist.length > 0) {
      renderPlaylist();
      loadTrack(0);
      updatePlaylistCount();
    } else {
      console.error('播放列表为空');
    }

    return true;
  } catch (error) {
    console.error('加载播放列表失败:', error);
    currentTitle.textContent = '加载失败';
    currentArtist.textContent = '无法加载播放列表';
    return false;
  }
}

// ========================================================================
// ========================= 🎵 播放列表渲染 ===============================
// ========================================================================

function renderPlaylist() {
  playlistItems.innerHTML = '';

  playlist.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <div class="playlist-item-number">${index + 1}</div>
      <div class="playlist-item-info">
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
    `;

    item.addEventListener('click', () => {
      if (currentTrackIndex === index && isPlaying) {
        pauseTrack();
      } else {
        loadTrack(index);
        playTrack();
      }
    });

    playlistItems.appendChild(item);
  });

  updatePlaylistUI();
}

function updatePlaylistUI() {
  const items = playlistItems.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// ========================================================================
// ========================= 🎼 音轨加载和控制 =============================
// ========================================================================

function loadTrack(index) {
  if (!playlist[index] || !playlist[index].src) {
    console.error('无效的音轨索引或音轨源');
    return;
  }

  const track = playlist[index];
  currentTrackIndex = index;

  audioPlayer.src = track.src;
  currentTitle.textContent = track.title;
  currentArtist.textContent = track.artist;
  labelTitle.textContent = track.title;
  labelArtist.textContent = track.artist;

  updatePlaylistUI();
}

function playTrack() {
  audioPlayer.play().then(() => {
    isPlaying = true;
    vinylDisc.classList.add('playing');
    audioVisualizer.classList.add('active');
    playIconPlayer.className = 'fas fa-pause';
  }).catch(error => {
    console.error('播放失败:', error);
  });
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  vinylDisc.classList.remove('playing');
  audioVisualizer.classList.remove('active');
  playIconPlayer.className = 'fas fa-play';
}

function togglePlay() {
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playPrevious() {
  let newIndex;
  if (playMode === 'random') {
    newIndex = getRandomIndex();
  } else {
    newIndex = currentTrackIndex - 1;
    if (newIndex < 0) {
      newIndex = playlist.length - 1;
    }
  }
  loadTrack(newIndex);
  if (isPlaying) {
    playTrack();
  }
}

function playNext() {
  let newIndex;
  if (playMode === 'random') {
    newIndex = getRandomIndex();
  } else {
    newIndex = currentTrackIndex + 1;
    if (newIndex >= playlist.length) {
      newIndex = 0;
    }
  }
  loadTrack(newIndex);
  if (isPlaying) {
    playTrack();
  }
}

function getRandomIndex() {
  if (playlist.length <= 1) return 0;
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * playlist.length);
  } while (randomIndex === currentTrackIndex);
  return randomIndex;
}

function togglePlayMode() {
  if (playMode === 'sequential') {
    playMode = 'random';
    modeBtnPlayer.innerHTML = '<i class="fas fa-random"></i>';
    modeBtnPlayer.title = '随机播放';
    modeBtnPlayer.classList.add('random');
  } else {
    playMode = 'sequential';
    modeBtnPlayer.innerHTML = '<i class="fas fa-list"></i>';
    modeBtnPlayer.title = '顺序播放';
    modeBtnPlayer.classList.remove('random');
  }
}

// ========================================================================
// ========================= ⏱️ 进度条控制 =================================
// ========================================================================

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
  if (isDraggingProgress || audioPlayer.seeking) return;

  const duration = audioPlayer.duration;
  const current = audioPlayer.currentTime;

  if (duration && !isNaN(duration)) {
    const percentage = (current / duration) * 100;
    progressBarFill.style.width = `${percentage}%`;
    currentTimeDisplay.textContent = formatTime(current);
    totalTimeDisplay.textContent = formatTime(duration);
  }
}

function setProgress(clientX) {
  const rect = progressBarContainer.getBoundingClientRect();
  const clickX = clientX - rect.left;
  const width = rect.width;
  const percentage = Math.max(0, Math.min(1, clickX / width));
  const duration = audioPlayer.duration;

  if (duration && !isNaN(duration)) {
    progressBarFill.style.width = `${percentage * 100}%`;
    const newTime = duration * percentage;
    currentTimeDisplay.textContent = formatTime(newTime);
    audioPlayer.currentTime = newTime;
  }
}

function handleProgressDragStart(e) {
  e.preventDefault();
  isDraggingProgress = true;
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  setProgress(clientX);
  progressBarContainer.style.cursor = 'grabbing';
}

function handleProgressDragMove(e) {
  if (!isDraggingProgress) return;
  const clientX = e.clientX || (e.touches && e.touches[0].clientX);
  setProgress(clientX);
}

function handleProgressDragEnd() {
  if (!isDraggingProgress) return;
  isDraggingProgress = false;
  progressBarContainer.style.cursor = 'grab';
}

// ========================================================================
// ========================= 🔊 音量控制 ===================================
// ========================================================================

function toggleVolumeControl() {
  volumeControl.classList.toggle('show');
}

function updateVolume() {
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;

  // 更新音量图标
  let iconClass;
  if (volume === 0) {
    iconClass = 'fa-volume-mute';
  } else if (volume < 0.5) {
    iconClass = 'fa-volume-down';
  } else {
    iconClass = 'fa-volume-up';
  }

  volumeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
  if (volumeControl) {
    volumeControl.style.setProperty('--volume-percent', volumeSlider.value);
  }

  if (volumeFill) {
    volumeFill.style.height = `${volumeSlider.value}%`;
  }

  if (volumeThumb) {
    volumeThumb.style.bottom = `${volumeSlider.value}%`;
  }
}

// ========================================================================
// ========================= 📡 事件监听器 =================================
// ========================================================================

// 播放控制按钮
playBtnPlayer.addEventListener('click', togglePlay);
prevBtnPlayer.addEventListener('click', playPrevious);
nextBtnPlayer.addEventListener('click', playNext);
modeBtnPlayer.addEventListener('click', togglePlayMode);
volumeBtn.addEventListener('click', toggleVolumeControl);

// 音量控制
volumeSlider.addEventListener('input', updateVolume);

// 音频事件
audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('loadedmetadata', updateProgress);
audioPlayer.addEventListener('ended', () => {
  playNext();
});

// 进度条拖拽 - 鼠标事件
progressBarContainer.addEventListener('mousedown', handleProgressDragStart);
document.addEventListener('mousemove', handleProgressDragMove);
document.addEventListener('mouseup', handleProgressDragEnd);

// 进度条拖拽 - 触摸事件
progressBarContainer.addEventListener('touchstart', handleProgressDragStart, { passive: false });
document.addEventListener('touchmove', handleProgressDragMove, { passive: false });
document.addEventListener('touchend', handleProgressDragEnd);

// 键盘快捷键
document.addEventListener('keydown', (e) => {
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      playPrevious();
      break;
    case 'ArrowRight':
      e.preventDefault();
      playNext();
      break;
    case 'ArrowUp':
      e.preventDefault();
      volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
      updateVolume();
      break;
    case 'ArrowDown':
      e.preventDefault();
      volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
      updateVolume();
      break;
  }
});

// 初始化音量显示
updateVolume();

// ========================================================================
// ========================= 📋 播放列表折叠控制 ===========================
// ========================================================================

// 切换播放列表折叠状态
function togglePlaylist() {
  isPlaylistCollapsed = !isPlaylistCollapsed;

  if (isPlaylistCollapsed) {
    playlistContainer.classList.add('collapsed');
  } else {
    playlistContainer.classList.remove('collapsed');
  }

  // 保存折叠状态到localStorage
  localStorage.setItem('playlistCollapsed', isPlaylistCollapsed);
}

// 更新播放列表歌曲数量显示
function updatePlaylistCount() {
  if (playlistCount) {
    playlistCount.textContent = `(${playlist.length})`;
  }
}

// 从localStorage加载折叠状态
function loadPlaylistCollapseState() {
  const savedState = localStorage.getItem('playlistCollapsed');
  if (savedState === 'true') {
    isPlaylistCollapsed = true;
    playlistContainer.classList.add('collapsed');
  }
}

// 播放列表标题点击事件
if (playlistToggle) {
  playlistToggle.addEventListener('click', togglePlaylist);
}

// ========================================================================
// ========================= 🚀 初始化 =====================================
// ========================================================================

async function init() {
  const loaded = await loadPlaylist();
  if (loaded && playlist.length > 0) {
    console.log('音乐播放器初始化成功');
    loadPlaylistCollapseState(); // 加载折叠状态
  } else {
    console.error('音乐播放器初始化失败');
  }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
