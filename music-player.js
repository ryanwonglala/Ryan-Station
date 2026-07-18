// ========================================================================
// ========================= 🎵 Acid Glitch Hub ============================
// ========================================================================

// DOM references
const audioPlayer = document.getElementById('audioPlayer');
const vinylDisc = document.getElementById('vinylDisc');
const vinylWrapper = document.querySelector('.vinyl-wrapper');
const vinylLabel = document.getElementById('vinylLabel');
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
const crtTv = document.querySelector('.crt-tv');
const crtVideo = document.getElementById('mv-player');
const terminalLog = document.getElementById('terminal-log');
const terminalToggle = document.getElementById('terminal-toggle');

// State
let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let playMode = 'sequential';
let isSeeking = false;
let sidebarOpen = false;
let terminalCollapsed = false;

const PLAY_MODE_ICONS = {
  sequential: 'icon-list-ul',
  random: 'icon-shuffle',
  single: 'icon-repeat-1',
};

function mpT(path, fallback = '') {
  return (window.PortfolioI18n && window.PortfolioI18n.t(`musicPlayer.${path}`)) || fallback;
}

function formatMpT(path, replacements, fallback = '') {
  return mpT(path, fallback).replace(/\{(\w+)\}/g, (_, key) => replacements[key] || '');
}

const b1ReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function appendToTerminalLog(message, role = 'system') {
  if (!terminalLog) return;
  const line = document.createElement('div');
  line.className = `terminal-line ${role}`;
  terminalLog.appendChild(line);
  if (b1ReducedMotion || role === 'user') {
    line.textContent = message;
    terminalLog.scrollTop = terminalLog.scrollHeight;
    return;
  }
  // CRT 打字机：系统/AI 行逐字输出
  line.classList.add('typing');
  let i = 0;
  const step = () => {
    i += 1 + Math.floor(Math.random() * 2);
    line.textContent = message.slice(0, i);
    terminalLog.scrollTop = terminalLog.scrollHeight;
    if (i < message.length) {
      window.setTimeout(step, 14);
    } else {
      line.classList.remove('typing');
    }
  };
  step();
}

function setSignalReceived(state) {
  if (!crtTv) return;
  if (state && !crtTv.classList.contains('has-mv')) {
    return;
  }
  crtTv.classList.toggle('signal-received', state);
}

function updateTerminalToggleUI() {
  if (!terminalToggle) return;
  const expanded = !terminalCollapsed;
  const iconId = expanded ? 'icon-chevron-up' : 'icon-chevron-down';
  terminalToggle.innerHTML = `<svg class="icon" width="16" height="16" aria-hidden="true"><use href="assets/icons.svg#${iconId}"></use></svg>`;
  terminalToggle.setAttribute('aria-expanded', expanded.toString());
  const label = expanded ? mpT('collapseTerminal', 'Collapse terminal log') : mpT('expandTerminal', 'Expand terminal log');
  terminalToggle.setAttribute('aria-label', label);
  terminalToggle.title = label;
}

function toggleTerminalLogVisibility() {
  if (!terminalLog) return;
  terminalCollapsed = !terminalCollapsed;
  terminalLog.classList.toggle('collapsed', terminalCollapsed);
  updateTerminalToggleUI();
}

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
  configureTrackVideo(track);
  flickChannel();

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

function playPrevious(autoPlay = isPlaying) {
  let newIndex = currentTrackIndex;
  if (playMode === 'random') {
    newIndex = getRandomIndex();
  } else if (playMode === 'sequential') {
    newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
  }

  loadTrack(newIndex);
  if (autoPlay) {
    playTrack();
  }
}

function playNext(autoPlay = isPlaying) {
  let newIndex = currentTrackIndex;
  if (playMode === 'random') {
    newIndex = getRandomIndex();
  } else if (playMode === 'sequential') {
    newIndex = (currentTrackIndex + 1) % playlist.length;
  }

  loadTrack(newIndex);
  if (autoPlay) {
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

function handleTrackEnd() {
  if (playMode === 'single') {
    audioPlayer.currentTime = 0;
    playTrack();
    return;
  }
  playNext(true);
}

function updatePlayModeUI() {
  if (!modeBtnPlayer) return;
  const iconId = PLAY_MODE_ICONS[playMode] || PLAY_MODE_ICONS.sequential;
  const label = mpT(`playModes.${playMode}`, mpT('playModes.fallback', 'Play mode'));
  const isSingle = playMode === 'single';

  const badge = isSingle ? '<span class="mode-badge">1</span>' : '';
  modeBtnPlayer.innerHTML = `<svg class="icon" width="16" height="16" aria-hidden="true"><use href="assets/icons.svg#${iconId}"></use></svg>${badge}`;
  modeBtnPlayer.title = label;
  modeBtnPlayer.setAttribute('aria-label', label);
  modeBtnPlayer.classList.toggle('random', playMode === 'random');
  modeBtnPlayer.classList.toggle('single', isSingle);
}

function togglePlayMode() {
  if (playMode === 'sequential') {
    playMode = 'random';
  } else if (playMode === 'random') {
    playMode = 'single';
  } else {
    playMode = 'sequential';
  }
  updatePlayModeUI();
}

function writeTrackInfo(track = {}) {
  const title = track.title || mpT('unloaded', 'No music loaded');
  const artist = track.artist || '--';

  if (trackTitleEl) trackTitleEl.textContent = title;
  if (trackArtistEl) trackArtistEl.textContent = artist;
}

function updatePlaybackState(playing) {
  isPlaying = playing;
  if (vinylWrapper) {
    vinylWrapper.classList.toggle('playing', playing);
  }
  if (vinylDisc) {
    vinylDisc.classList.toggle('playing', playing);
  }
  if (playIconPlayer) {
    playIconPlayer.setAttribute('href', playing ? 'assets/icons.svg#icon-pause' : 'assets/icons.svg#icon-play');
  }
  updateMascotState(playing);
  updateTvState(playing);
  syncVideoPlayback(playing);
}

function updateMascotState(playing) {
  if (!mascotContainer) return;
  mascotContainer.classList.toggle('visible', playing);
}

function updateTvState(playing) {
  if (!crtStatus || !staticNoise) return;
  const hasMv = crtTv && crtTv.classList.contains('has-mv');
  const scope = Boolean(playing && !hasMv);
  if (crtTv) crtTv.classList.toggle('scope-mode', scope);
  crtStatus.textContent = playing
    ? (hasMv ? mpT('playing', 'PLAYING...') : mpT('liveSignal', 'LIVE SIGNAL'))
    : mpT('noSignal', 'NO SIGNAL');
  staticNoise.classList.toggle('is-playing', playing && !scope);
}

function configureTrackVideo(track) {
  if (!crtVideo || !crtTv) return;

  if (track && track.mv) {
    const nextSrc = track.mv;
    const currentSrc = crtVideo.getAttribute('src');
    if (currentSrc !== nextSrc) {
      crtVideo.src = nextSrc;
    }
    crtVideo.load();
    try {
      crtVideo.currentTime = 0;
    } catch (error) {
      // ignore
    }
    crtTv.classList.add('has-mv');
    if (!isPlaying) {
      setSignalReceived(false);
    }
  } else {
    fallbackToStatic();
  }
}

function alignVideoToCurrentAudio(time = audioPlayer.currentTime) {
  if (!crtVideo || !crtTv || !crtTv.classList.contains('has-mv')) return;
  try {
    crtVideo.currentTime = time;
  } catch (error) {
    // ignore desync adjustments until video is ready
  }
}

function enforceVideoSyncThreshold() {
  if (!crtVideo || !crtTv || !crtTv.classList.contains('has-mv')) return;
  const diff = Math.abs((crtVideo.currentTime || 0) - (audioPlayer.currentTime || 0));
  if (diff > 0.5) {
    alignVideoToCurrentAudio();
  }
}

function syncVideoPlayback(playing) {
  if (!crtVideo || !crtTv || !crtTv.classList.contains('has-mv')) return;
  if (playing) {
    alignVideoToCurrentAudio();
    const playPromise = crtVideo.play();
    const onSuccess = () => setSignalReceived(true);
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(onSuccess).catch((error) => {
        console.warn('MV playback interrupted:', error);
        fallbackToStatic();
      });
    } else {
      onSuccess();
    }
  } else {
    crtVideo.pause();
  }
}

function fallbackToStatic() {
  if (!crtVideo || !crtTv) return;
  try {
    crtVideo.pause();
  } catch (error) {
    // ignore
  }
  if (crtVideo.getAttribute('src')) {
    crtVideo.removeAttribute('src');
  }
  crtVideo.load();
  try {
    crtVideo.currentTime = 0;
  } catch (error) {
    // ignore
  }
  crtTv.classList.remove('has-mv');
  setSignalReceived(false);
  if (crtStatus) {
    crtStatus.textContent = mpT('noSignal', 'NO SIGNAL');
  }
  if (staticNoise) {
    staticNoise.classList.remove('is-playing');
  }
}

// ========================================================================
// ==================== 📻 离线 DJ（预生成台词，零 API） ==================
// 台词库在 dj-lines.json：每首歌的报幕词 + 心情反应词 + 通用兜底模板。
// 点歌 = 本地 tags 匹配；播报 = 查表随机挑一句。加载失败时 DJ 静音，不影响播放。
// ========================================================================

let djLines = null;
let djBusyUntil = 0;

async function loadDjLines() {
  try {
    const res = await fetch('dj-lines.json');
    if (res.ok) djLines = await res.json();
  } catch (err) { /* DJ 静音也不影响播放 */ }
}

function djLang() {
  return (window.PortfolioI18n && window.PortfolioI18n.getLanguage && window.PortfolioI18n.getLanguage()) || 'en';
}

function djRandomLine(pool) {
  if (!Array.isArray(pool) || !pool.length) return '';
  return pool[Math.floor(Math.random() * pool.length)];
}

function djIntroFor(track) {
  if (!djLines || !track) return '';
  const lang = djLang();
  const entry = djLines.tracks && djLines.tracks[track.title];
  const pool = (entry && entry[lang] && entry[lang].length)
    ? entry[lang]
    : (djLines.generic && djLines.generic[lang]) || [];
  return djRandomLine(pool)
    .replace('{title}', track.title || '')
    .replace('{artist}', track.artist || '--');
}

// 报幕调度：开播 0.9s 后才开口，连环切歌不刷屏
let djAnnounceTimer = null;
let lastAnnouncedIndex = -1;

function scheduleDjAnnounce() {
  if (djAnnounceTimer) window.clearTimeout(djAnnounceTimer);
  if (currentTrackIndex === lastAnnouncedIndex) return;
  const idx = currentTrackIndex;
  djAnnounceTimer = window.setTimeout(() => {
    djAnnounceTimer = null;
    if (!isPlaying || currentTrackIndex !== idx) return;
    const line = djIntroFor(playlist[idx]);
    if (!line) return;
    lastAnnouncedIndex = idx;
    appendToTerminalLog(`> DJ: ${line}`, 'ai');
  }, 900);
}

// 心情点歌：本地按 tags 匹配 + 随机挑一首（避开当前曲目）
function djMoodPick(tag, userText) {
  const now = Date.now();
  if (now < djBusyUntil) return;
  djBusyUntil = now + 600;

  appendToTerminalLog(`> USER: ${userText}`, 'user');

  const matches = [];
  playlist.forEach((track, index) => {
    if (Array.isArray(track.tags) && track.tags.includes(tag)) matches.push(index);
  });
  if (!matches.length) return;

  let pool = matches.filter((index) => index !== currentTrackIndex);
  if (!pool.length) pool = matches;
  const idx = pool[Math.floor(Math.random() * pool.length)];

  const moodEntry = djLines && djLines.moods && djLines.moods[tag];
  const moodLine = djRandomLine(moodEntry && moodEntry[djLang()]);
  if (moodLine) appendToTerminalLog(`> DJ: ${moodLine}`, 'ai');

  loadTrack(idx);
  playTrack();
  appendTrackChip(idx);
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
  alignVideoToCurrentAudio(newTime);
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

  if (volumeBtn) {
    const iconId = volume <= 0 ? 'icon-volume-mute' : volume < 0.5 ? 'icon-volume-down' : 'icon-volume-up';
    volumeBtn.innerHTML = `<svg class="icon" width="16" height="16" aria-hidden="true"><use href="assets/icons.svg#${iconId}"></use></svg>`;
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

updatePlayModeUI();
if (terminalLog) {
  terminalLog.classList.toggle('collapsed', terminalCollapsed);
}
updateTerminalToggleUI();

if (playBtnPlayer) playBtnPlayer.addEventListener('click', togglePlay);
if (prevBtnPlayer) prevBtnPlayer.addEventListener('click', playPrevious);
if (nextBtnPlayer) nextBtnPlayer.addEventListener('click', playNext);
if (modeBtnPlayer) modeBtnPlayer.addEventListener('click', togglePlayMode);
if (volumeBtn) volumeBtn.addEventListener('click', toggleVolumeControl);
if (volumeSlider) volumeSlider.addEventListener('input', updateVolume);
if (playlistTab) playlistTab.addEventListener('click', toggleSidebar);
if (terminalToggle) terminalToggle.addEventListener('click', toggleTerminalLogVisibility);
if (crtVideo) {
  crtVideo.addEventListener('error', fallbackToStatic);
}

if (seekBar) {
  seekBar.addEventListener('input', handleSeekInput);
  seekBar.addEventListener('mousedown', () => setSeekingState(true));
  seekBar.addEventListener('touchstart', () => setSeekingState(true));
  ['mouseup', 'touchend', 'mouseleave'].forEach(evt => {
    seekBar.addEventListener(evt, () => setSeekingState(false));
  });
}

audioPlayer.addEventListener('timeupdate', updateProgress);
audioPlayer.addEventListener('timeupdate', enforceVideoSyncThreshold);
audioPlayer.addEventListener('play', () => updatePlaybackState(true));
audioPlayer.addEventListener('pause', () => updatePlaybackState(false));
audioPlayer.addEventListener('loadedmetadata', () => {
  currentTimeDisplay.textContent = '0:00';
  totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
  if (trackDurationEl) {
    trackDurationEl.textContent = formatTime(audioPlayer.duration);
  }
  updateProgress();
});
audioPlayer.addEventListener('ended', handleTrackEnd);

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

// 心情快捷键：从曲库真实标签生成，点一下就点歌
function buildMoodPresets() {
  const box = document.getElementById('moodPresets');
  if (!box || !playlist.length) return;
  const lang = () => (window.PortfolioI18n && window.PortfolioI18n.getLanguage && window.PortfolioI18n.getLanguage()) || 'en';
  const PRESETS = [
    { tag: 'happy', en: 'HAPPY', zh: '开心', promptEn: 'play something happy', promptZh: '来点开心的' },
    { tag: 'energy', en: 'ENERGY', zh: '燃', promptEn: 'something high energy', promptZh: '来首燃的' },
    { tag: 'party', en: 'PARTY', zh: '蹦迪', promptEn: 'party time, drop something danceable', promptZh: '蹦迪时间，来首能跳的' },
    { tag: 'vibe', en: 'VIBE', zh: '松弛', promptEn: 'chill vibes please', promptZh: '来点松弛的氛围' },
    { tag: 'sad', en: 'SAD', zh: 'emo', promptEn: 'in my feelings, something sad', promptZh: '有点 emo，来首伤感的' },
    { tag: 'weird', en: 'WEIRD', zh: '整活', promptEn: 'surprise me with something weird', promptZh: '给我整个活' },
  ];
  const available = new Set();
  playlist.forEach((t) => (t.tags || []).forEach((tag) => available.add(tag)));
  const render = () => {
    box.innerHTML = '';
    PRESETS.filter((p) => available.has(p.tag)).forEach((p) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'mood-chip';
      chip.textContent = lang() === 'zh' ? p.zh : p.en;
      chip.addEventListener('click', () => {
        djMoodPick(p.tag, lang() === 'zh' ? p.promptZh : p.promptEn);
      });
      box.appendChild(chip);
    });
  };
  render();
  if (window.PortfolioI18n) window.PortfolioI18n.onChange(render);
}

(function initMoodPresets() {
  const check = () => (playlist.length ? buildMoodPresets() : window.setTimeout(check, 250));
  check();
})();

// ========================================================================
// ========================= 🚀 初始化 =====================================
// ========================================================================

async function init() {
  loadDjLines();
  const loaded = await loadPlaylist();
  if (loaded && playlist.length > 0) {
    updateVolume();
  } else if (trackTitleEl) {
    trackTitleEl.textContent = mpT('unloaded', 'No music loaded');
  }
  updatePlayModeUI();
  updateTerminalToggleUI();
  updateTvState(isPlaying);

  if (window.PortfolioI18n) {
    window.PortfolioI18n.onChange(() => {
      updatePlayModeUI();
      updateTerminalToggleUI();
      updateTvState(isPlaying);
      if (!playlist.length && trackTitleEl) {
        trackTitleEl.textContent = mpT('unloaded', 'No music loaded');
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', init);

// ========================================================================
// ==================== 🏗 B1 内装修：入场/频谱/示波器 ====================
// ========================================================================

// ---------- 入场衔接：从俱乐部之门推门进来 → 灯光渐亮 ----------
(() => {
  if (b1ReducedMotion) return;
  let fromDoor = false;
  try {
    fromDoor = sessionStorage.getItem('b1-door') === '1';
    sessionStorage.removeItem('b1-door');
  } catch (err) { /* ignore */ }
  document.body.classList.add(fromDoor ? 'b1-arrival' : 'b1-arrival-short');
  window.setTimeout(() => {
    document.body.classList.remove('b1-arrival', 'b1-arrival-short');
  }, fromDoor ? 4200 : 1600);
})();

// ---------- 换台抖动：换曲时 CRT 电流一跳 ----------
function flickChannel() {
  if (!crtTv || b1ReducedMotion) return;
  crtTv.classList.remove('channel-flick');
  void crtTv.offsetWidth;
  crtTv.classList.add('channel-flick');
  window.setTimeout(() => crtTv.classList.remove('channel-flick'), 420);
}

// ---------- AI 歌卡：命中曲目变成可点击的票签 ----------
function appendTrackChip(index) {
  if (!terminalLog || !playlist[index]) return;
  const track = playlist[index];
  const wrap = document.createElement('div');
  wrap.className = 'terminal-line chip-line';
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'terminal-chip';
  chip.innerHTML = `<span class="chip-play" aria-hidden="true">▶</span><span class="chip-title">${track.title}</span><span class="chip-artist">${track.artist || ''}</span>`;
  chip.addEventListener('click', () => {
    loadTrack(index);
    playTrack();
  });
  wrap.appendChild(chip);
  terminalLog.appendChild(wrap);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

// ---------- 频谱引擎：真频谱（R2 开 CORS 后自动启用）/ 节拍合成兜底 ----------
const spectrumBar = document.getElementById('spectrumBar');
const crtScope = document.getElementById('crtScope');
let specMode = null;            // 'real' | 'synthetic'
let audioCtx = null;
let analyserNode = null;
let freqData = null;
let waveData = null;
let specRaf = null;
let synthBars = null;

function sizeCanvas(canvas) {
  if (!canvas) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return null;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  return canvas.getContext('2d');
}

async function detectAudioCors() {
  const probe = playlist[0] && playlist[0].src;
  if (!probe) return false;
  try {
    const res = await fetch(probe, { method: 'GET', headers: { Range: 'bytes=0-0' }, mode: 'cors' });
    return res.ok || res.status === 206;
  } catch (err) {
    return false;
  }
}

function ensureAudioGraph() {
  if (analyserNode || specMode !== 'real') return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
    const source = audioCtx.createMediaElementSource(audioPlayer);
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 256;
    analyserNode.smoothingTimeConstant = 0.78;
    source.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);
    freqData = new Uint8Array(analyserNode.frequencyBinCount);
    waveData = new Uint8Array(analyserNode.fftSize);
  } catch (err) {
    specMode = 'synthetic'; // 图谱失败不影响出声
  }
}

// 节拍合成：无 CORS 时的兜底——随机游走 + 节拍脉冲，视觉成立但非真实频率
function synthFrame(bars, t) {
  if (!synthBars) synthBars = new Float32Array(bars).fill(0.15);
  const beat = Math.pow(Math.max(0, Math.sin(t * 4.4)), 6);
  for (let i = 0; i < bars; i++) {
    const bias = 1 - i / bars;                       // 低频端更活跃
    const target = isPlaying
      ? Math.min(1, 0.12 + bias * 0.45 * (0.55 + 0.45 * Math.sin(t * 2.1 + i * 1.7)) + beat * bias * 0.5 + Math.random() * 0.12)
      : 0;
    synthBars[i] += (target - synthBars[i]) * (target > synthBars[i] ? 0.4 : 0.12);
  }
  return synthBars;
}

function drawSpectrum() {
  specRaf = null;
  const barsCtx = spectrumBar && spectrumBar._ctx;
  const t = performance.now() / 1000;
  const BARS = 40;
  let levels;

  if (specMode === 'real' && analyserNode) {
    analyserNode.getByteFrequencyData(freqData);
    levels = [];
    const usable = Math.floor(freqData.length * 0.72); // 掐掉极高频空段
    for (let i = 0; i < BARS; i++) {
      const start = Math.floor((i / BARS) * usable);
      const end = Math.max(start + 1, Math.floor(((i + 1) / BARS) * usable));
      let sum = 0;
      for (let j = start; j < end; j++) sum += freqData[j];
      levels.push(sum / (end - start) / 255);
    }
  } else {
    levels = synthFrame(BARS, t);
  }

  let alive = false;

  if (barsCtx) {
    const w = spectrumBar.width;
    const h = spectrumBar.height;
    barsCtx.clearRect(0, 0, w, h);
    const gap = Math.max(1, w / BARS * 0.28);
    const bw = (w - gap * (BARS - 1)) / BARS;
    for (let i = 0; i < BARS; i++) {
      const v = Math.max(0, Math.min(1, levels[i]));
      if (v > 0.015) alive = true;
      const bh = Math.max(2, v * (h - 4));
      const x = i * (bw + gap);
      const grad = barsCtx.createLinearGradient(0, h, 0, h - bh);
      grad.addColorStop(0, 'rgba(204, 255, 0, 0.95)');
      grad.addColorStop(1, v > 0.72 ? 'rgba(255, 42, 0, 0.95)' : 'rgba(204, 255, 0, 0.45)');
      barsCtx.fillStyle = grad;
      barsCtx.fillRect(x, h - bh, bw, bh);
    }
  }

  // CRT 示波器（无 MV 曲目）——画布显形后才能量到尺寸，这里懒初始化
  if (crtTv && crtTv.classList.contains('scope-mode') && crtScope && !crtScope._ctx) {
    crtScope._ctx = sizeCanvas(crtScope);
  }
  if (crtTv && crtTv.classList.contains('scope-mode') && crtScope && crtScope._ctx) {
    const c = crtScope._ctx;
    const w = crtScope.width;
    const h = crtScope.height;
    c.fillStyle = 'rgba(4, 8, 2, 0.32)'; // 荧光余晖
    c.fillRect(0, 0, w, h);
    c.beginPath();
    c.lineWidth = Math.max(2, h / 160);
    c.strokeStyle = 'rgba(204, 255, 0, 0.92)';
    c.shadowColor = 'rgba(204, 255, 0, 0.8)';
    c.shadowBlur = 12;
    const N = 160;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * w;
      let y;
      if (specMode === 'real' && analyserNode) {
        analyserNode.getByteTimeDomainData(waveData);
        y = (waveData[Math.floor((i / N) * (waveData.length - 1))] / 255) * h;
      } else {
        const amp = isPlaying ? 0.22 + 0.16 * Math.sin(t * 4.4) : 0.02;
        y = h / 2 + Math.sin(i * 0.19 + t * 7) * h * amp * Math.sin(i * 0.031 + t * 1.3);
      }
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
    c.shadowBlur = 0;
    alive = true;
  }

  if (isPlaying || alive) {
    specRaf = requestAnimationFrame(drawSpectrum);
  }
}

function startSpectrum() {
  if (b1ReducedMotion) return;
  if (spectrumBar && !spectrumBar._ctx) spectrumBar._ctx = sizeCanvas(spectrumBar);
  if (crtScope && !crtScope._ctx) crtScope._ctx = sizeCanvas(crtScope);
  ensureAudioGraph();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (!specRaf) specRaf = requestAnimationFrame(drawSpectrum);
}

window.addEventListener('resize', () => {
  if (spectrumBar && spectrumBar._ctx) spectrumBar._ctx = sizeCanvas(spectrumBar);
  if (crtScope && crtScope._ctx) crtScope._ctx = sizeCanvas(crtScope);
});

// 播放状态钩子：不改原函数签名，包一层
const b1BaseUpdatePlaybackState = updatePlaybackState;
updatePlaybackState = function (playing) {
  b1BaseUpdatePlaybackState(playing);
  if (playing) {
    startSpectrum();
    scheduleDjAnnounce();
  }
};

// CORS 探测：真频谱可用时给 audio 挂 crossOrigin（必须在设 src 前定型）
(async () => {
  const waitPlaylist = () => new Promise((resolve) => {
    const check = () => (playlist.length ? resolve() : window.setTimeout(check, 200));
    check();
  });
  await waitPlaylist();
  const corsOk = await detectAudioCors();
  specMode = corsOk ? 'real' : 'synthetic';
  if (!corsOk) {
    console.info('[B1] Spectrum running in synthetic mode — enable CORS on the R2 bucket to unlock real frequency data (the CORS error above is this probe, playback is unaffected).');
  }
  if (corsOk) {
    audioPlayer.crossOrigin = 'anonymous';
    // 已加载的曲目重挂一次让 crossOrigin 生效
    const src = audioPlayer.src;
    if (src && !isPlaying) {
      audioPlayer.src = src;
      audioPlayer.load();
    }
  }
  window.__b1 = { specMode, startSpectrum, flickChannel, appendTrackChip };
})();
