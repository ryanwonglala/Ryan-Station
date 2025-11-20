// ========================================================================
// ========================= 🎵 Acid Glitch Hub ============================
// ========================================================================

// DOM references
const audioPlayer = document.getElementById('audioPlayer');
const vinylDisc = document.getElementById('vinylDisc');
const vinylLabel = document.getElementById('vinylLabel');
const labelTitle = document.getElementById('labelTitle');
const labelArtist = document.getElementById('labelArtist');
const trackTitleEl = document.querySelector('.track-title');
const trackArtistEl = document.querySelector('.track-artist');
const trackDurationEl = document.querySelector('.track-duration');
const playBtnPlayer = document.getElementById('playBtnPlayer');
const playIconPlayer = document.getElementById('playIconPlayer');
const prevBtnPlayer = document.getElementById('prevBtnPlayer');
const nextBtnPlayer = document.getElementById('nextBtnPlayer');
const modeBtnPlayer = document.getElementById('modeBtnPlayer');
const volumeBtn = document.getElementById('volumeBtn');
const volumeControl = document.getElementById('volumeControl');
const volumeSlider = document.getElementById('volumeSlider');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const totalTimeDisplay = document.getElementById('totalTimeDisplay');
const playlistItems = document.getElementById('playlistItems');
const playlistCount = document.getElementById('playlistCount');
const playlistSidebar = document.getElementById('playlistSidebar');
const playlistTab = document.getElementById('playlistTab');
const seekBar = document.getElementById('seekBar');
const mascotContainer = document.querySelector('.mascot-container');
const crtStatus = document.querySelector('.crt-status');
const staticNoise = document.querySelector('.static-noise');
const aiInput = document.getElementById('ai-input');

// State
let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let playMode = 'sequential';
let isSeeking = false;
let sidebarOpen = false;

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
    playlist = data.tracks || [];

    if (playlist.length > 0) {
      renderPlaylist();
      loadTrack(0);
      updatePlaylistCount();
    }

    return true;
  } catch (error) {
    console.error('加载播放列表失败:', error);
    writeTrackInfo({ title: '加载失败', artist: '无法加载播放列表' });
    return false;
  }
}

// ========================================================================
// ========================= 🎵 播放列表渲染 ===============================
// ========================================================================

function renderPlaylist() {
  if (!playlistItems) return;
  playlistItems.innerHTML = '';

  playlist.forEach((track, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <div class="playlist-item-number">${index + 1}</div>
      <div class="playlist-item-info">
        <div class="playlist-item-title">${track.title || 'Untitled'}</div>
        <div class="playlist-item-artist">${track.artist || '--'}</div>
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
  if (!playlistItems) return;
  const items = playlistItems.querySelectorAll('.playlist-item');
  items.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function updatePlaylistCount() {
  if (playlistCount) {
    playlistCount.textContent = `(${playlist.length})`;
  }
}

// ========================================================================
// ========================= 🎼 音轨加载和控制 =============================
// ========================================================================

function loadTrack(index) {
  const track = playlist[index];
  if (!track || !track.src) {
    console.error('无效的音轨索引或音轨源');
    return;
  }

  currentTrackIndex = index;
  audioPlayer.src = track.src;
  audioPlayer.load();

  writeTrackInfo(track);
  if (trackDurationEl) {
    trackDurationEl.textContent = track.duration || '--:--';
  }
  totalTimeDisplay.textContent = '0:00';
  if (seekBar) {
    seekBar.value = 0;
  }

  updatePlaylistUI();
}

function playTrack() {
  audioPlayer.play().then(() => {
    updatePlaybackState(true);
  }).catch(error => {
    console.error('播放失败:', error);
  });
}

function pauseTrack() {
  audioPlayer.pause();
  updatePlaybackState(false);
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
    if (newIndex < 0) newIndex = playlist.length - 1;
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
    newIndex = (currentTrackIndex + 1) % playlist.length;
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
    modeBtnPlayer.textContent = 'RND';
    modeBtnPlayer.title = '随机播放';
    modeBtnPlayer.classList.add('random');
  } else {
    playMode = 'sequential';
    modeBtnPlayer.textContent = 'SEQ';
    modeBtnPlayer.title = '顺序播放';
    modeBtnPlayer.classList.remove('random');
  }
}

function writeTrackInfo(track = {}) {
  const title = track.title || '未加载音乐';
  const artist = track.artist || '--';

  if (trackTitleEl) trackTitleEl.textContent = title;
  if (trackArtistEl) trackArtistEl.textContent = artist;
  if (labelTitle) labelTitle.textContent = title;
  if (labelArtist) labelArtist.textContent = artist;
}

function updatePlaybackState(playing) {
  isPlaying = playing;
  if (vinylDisc) {
    vinylDisc.classList.toggle('playing', playing);
  }
  if (playIconPlayer) {
    playIconPlayer.className = playing ? 'fas fa-pause' : 'fas fa-play';
  }
  updateMascotState(playing);
  updateTvState(playing);
}

function updateMascotState(playing) {
  if (!mascotContainer) return;
  mascotContainer.classList.toggle('visible', playing);
}

function updateTvState(playing) {
  if (!crtStatus || !staticNoise) return;
  crtStatus.textContent = playing ? 'PLAYING...' : 'NO SIGNAL';
  staticNoise.classList.toggle('is-playing', playing);
}

// ========================================================================
// ========================= ⏱️ 进度条控制 =================================
// ========================================================================

function formatTime(seconds) {
  if (isNaN(seconds) || typeof seconds !== 'number') return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateProgress() {
  if (isSeeking || !seekBar) return;
  const duration = audioPlayer.duration;
  const current = audioPlayer.currentTime;
  if (!duration || isNaN(duration)) return;

  const percentage = (current / duration) * 100;
  seekBar.value = percentage;
  currentTimeDisplay.textContent = formatTime(current);
  totalTimeDisplay.textContent = formatTime(duration);
  if (trackDurationEl) {
    trackDurationEl.textContent = formatTime(duration);
  }
}

function handleSeekInput(event) {
  if (!audioPlayer.duration || isNaN(audioPlayer.duration)) return;
  const percentage = event.target.value / 100;
  const newTime = audioPlayer.duration * percentage;
  audioPlayer.currentTime = newTime;
  currentTimeDisplay.textContent = formatTime(newTime);
}

function setSeekingState(state) {
  isSeeking = state;
}

// ========================================================================
// ========================= 🔊 音量控制 ===================================
// ========================================================================

function toggleVolumeControl() {
  if (volumeControl) {
    volumeControl.classList.toggle('show');
  }
}

function updateVolume() {
  if (!volumeSlider) return;
  const volume = volumeSlider.value / 100;
  audioPlayer.volume = volume;

  let iconClass;
  if (volume === 0) iconClass = 'fa-volume-mute';
  else if (volume < 0.5) iconClass = 'fa-volume-down';
  else iconClass = 'fa-volume-up';

  if (volumeBtn) {
    volumeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
  }
}

// ========================================================================
// ========================= 📂 侧边栏控制 ==================================
// ========================================================================

function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  if (playlistSidebar) {
    playlistSidebar.classList.toggle('open', sidebarOpen);
  }
}

// ========================================================================
// ========================= 📡 事件监听器 =================================
// ========================================================================

if (playBtnPlayer) playBtnPlayer.addEventListener('click', togglePlay);
if (prevBtnPlayer) prevBtnPlayer.addEventListener('click', playPrevious);
if (nextBtnPlayer) nextBtnPlayer.addEventListener('click', playNext);
if (modeBtnPlayer) modeBtnPlayer.addEventListener('click', togglePlayMode);
if (volumeBtn) volumeBtn.addEventListener('click', toggleVolumeControl);
if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
if (playlistTab) playlistTab.addEventListener('click', toggleSidebar);

if (seekBar) {
  seekBar.addEventListener('input', handleSeekInput);
  seekBar.addEventListener('mousedown', () => setSeekingState(true));
  seekBar.addEventListener('touchstart', () => setSeekingState(true));
  ['mouseup', 'touchend', 'mouseleave'].forEach(evt => {
    seekBar.addEventListener(evt, () => setSeekingState(false));
  });
}

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('loadedmetadata', () => {
  currentTimeDisplay.textContent = '0:00';
  totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
  if (trackDurationEl) {
    trackDurationEl.textContent = formatTime(audioPlayer.duration);
  }
  updateProgress();
});
audioPlayer.addEventListener('ended', () => {
  playNext();
});

document.addEventListener('keydown', (e) => {
  switch (e.code) {
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
      if (volumeSlider) {
        e.preventDefault();
        volumeSlider.value = Math.min(100, parseInt(volumeSlider.value, 10) + 10);
        updateVolume();
      }
      break;
    case 'ArrowDown':
      if (volumeSlider) {
        e.preventDefault();
        volumeSlider.value = Math.max(0, parseInt(volumeSlider.value, 10) - 10);
        updateVolume();
      }
      break;
    case 'KeyP':
      if (playlistTab) {
        e.preventDefault();
        toggleSidebar();
      }
      break;
  }
});

if (aiInput) {
  aiInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const mood = aiInput.value.trim();
      if (!mood) return;
      hackTheSystem(mood);
      aiInput.value = '';
    }
  });
}

// ========================================================================
// ========================= 🛰️ AI Terminal Stub ==========================
// ========================================================================

function hackTheSystem(mood) {
  console.log('[AI TERMINAL] hackTheSystem ->', mood);
  // TODO: integrate Gemini API here
}

// ========================================================================
// ========================= 🚀 初始化 =====================================
// ========================================================================

async function init() {
  const loaded = await loadPlaylist();
  if (loaded && playlist.length > 0) {
    updateVolume();
  }
}

window.addEventListener('DOMContentLoaded', init);
