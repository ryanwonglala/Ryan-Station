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
const aiInput = document.getElementById('ai-input');
const aiSettingsBtn = document.getElementById('ai-settings-btn');
const terminalLog = document.getElementById('terminal-log');
const terminalToggle = document.getElementById('terminal-toggle');

// State
let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let playMode = 'sequential';
let isSeeking = false;
let sidebarOpen = false;
let terminalCollapsed = true;

const PLAY_MODE_ICONS = {
  sequential: 'fa-list-ul',
  random: 'fa-shuffle',
  single: 'fa-repeat',
};

const PLAY_MODE_LABELS = {
  sequential: '顺序播放',
  random: '随机播放',
  single: '单曲循环',
};

// ========================================================================
// ========================= ⚙️ Gemini Helpers ============================
// ========================================================================

function getGeminiKey() {
  return localStorage.getItem('GEMINI_API_KEY') || '';
}

function setGeminiKey(value) {
  if (value) {
    localStorage.setItem('GEMINI_API_KEY', value);
  }
}

function clearGeminiKey() {
  localStorage.removeItem('GEMINI_API_KEY');
}

function appendToTerminalLog(message, role = 'system') {
  if (!terminalLog) return;
  const line = document.createElement('div');
  line.className = `terminal-line ${role}`;
  line.textContent = message;
  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
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
  const icon = expanded ? 'fa-chevron-up' : 'fa-chevron-down';
  terminalToggle.innerHTML = `<i class="fas ${icon}"></i>`;
  terminalToggle.setAttribute('aria-expanded', expanded.toString());
  terminalToggle.setAttribute('aria-label', expanded ? '折叠终端日志' : '展开终端日志');
  terminalToggle.title = expanded ? 'Collapse terminal log' : 'Expand terminal log';
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
  const iconClass = PLAY_MODE_ICONS[playMode] || PLAY_MODE_ICONS.sequential;
  const label = PLAY_MODE_LABELS[playMode] || '播放模式';
  const isSingle = playMode === 'single';

  const badge = isSingle ? '<span class="mode-badge">1</span>' : '';
  modeBtnPlayer.innerHTML = `<i class="fas ${iconClass}"></i>${badge}`;
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
  const title = track.title || '未加载音乐';
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
    playIconPlayer.className = playing ? 'fas fa-pause' : 'fas fa-play';
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
  crtStatus.textContent = playing ? 'PLAYING...' : 'NO SIGNAL';
  staticNoise.classList.toggle('is-playing', playing);
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
    crtStatus.textContent = 'NO SIGNAL';
  }
  if (staticNoise) {
    staticNoise.classList.remove('is-playing');
  }
}

// ========================================================================
// ========================= 🤖 Gemini Integration ========================
// ========================================================================

async function callGeminiAI(userText) {
  const apiKey = getGeminiKey();
  if (!apiKey) {
    return { error: 'Gemini API key missing. Click the gear icon to add it.' };
  }

  const contextList = playlist.map((track, index) => {
    const tags = Array.isArray(track.tags) && track.tags.length ? track.tags.join(', ') : 'none';
    return `${index + 1}. "${track.title}" [tags: ${tags}]`;
  }).join(', ');

  const payloadText = [
    'System: You are the DJ of Ryan Station. Pick a song from the Context list that matches the user\'s input. If the request is vague, pick a random fitting song.',
    'Output strictly JSON: { "reply": "...", "command": "PLAY_SONG", "target": "Exact Song Title" }.',
    `Context: ${contextList}`,
    `User: ${userText}`
  ].join('\n\n');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: payloadText }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Gemini API error (${response.status}): ${errorText}` };
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || '')
      .join('\n')
      .trim();

    if (!raw) {
      return { error: 'Gemini API returned no response.' };
    }

    return { raw };
  } catch (error) {
    return { error: `Gemini request failed: ${error.message}` };
  }
}

function parseGeminiResponse(rawText) {
  if (!rawText) {
    throw new Error('Empty AI response.');
  }
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('Unable to parse AI JSON response.');
  }
}

function findTrackIndexByTitle(targetTitle) {
  if (!targetTitle) return -1;
  const normalized = targetTitle.trim().toLowerCase();
  return playlist.findIndex(track => (track.title || '').trim().toLowerCase() === normalized);
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

if (aiInput) {
  aiInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const mood = aiInput.value.trim();
      if (!mood) return;
      aiInput.value = '';
      await hackTheSystem(mood);
    }
  });
}

if (aiSettingsBtn) {
  aiSettingsBtn.addEventListener('click', () => {
    const existing = getGeminiKey();
    const input = window.prompt('Enter Gemini API Key (leave blank to clear):', existing);
    if (input === null) return;
    const trimmed = input.trim();
    if (trimmed) {
      setGeminiKey(trimmed);
      appendToTerminalLog('> SYSTEM: Gemini API key saved.', 'system');
    } else {
      clearGeminiKey();
      appendToTerminalLog('> SYSTEM: Gemini API key cleared.', 'system');
    }
  });
}

// ========================================================================
// ========================= 🛰️ AI Terminal Stub ==========================
// ========================================================================

async function hackTheSystem(mood) {
  appendToTerminalLog(`> USER: ${mood}`, 'user');

  const result = await callGeminiAI(mood);
  if (result.error) {
    appendToTerminalLog(`> SYSTEM: ${result.error}`, 'system');
    return;
  }

  let parsed;
  try {
    parsed = parseGeminiResponse(result.raw);
  } catch (error) {
    appendToTerminalLog(`> SYSTEM: ${error.message}`, 'system');
    return;
  }

  const reply = parsed.reply || 'Command acknowledged.';
  appendToTerminalLog(`> AI: ${reply}`, 'ai');

  if (parsed.command && parsed.command.toUpperCase() === 'PLAY_SONG') {
    const target = parsed.target || '';
    const index = findTrackIndexByTitle(target);
    if (index >= 0) {
      loadTrack(index);
      playTrack();
      appendToTerminalLog(`> SYSTEM: Playing "${playlist[index].title}"`, 'system');
    } else {
      appendToTerminalLog(`> SYSTEM: Could not find "${target}".`, 'system');
    }
  } else if (parsed.command) {
    appendToTerminalLog(`> SYSTEM: Unknown command "${parsed.command}".`, 'system');
  }
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
