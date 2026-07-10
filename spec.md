# Ryan-Station Music Zone – Acid Glitch Spec

## Goal
Rebuild the existing music player UI into an “Acid Glitch” experience while keeping the current audio/playlist logic. This spec describes the required structure and styling changes plus the JS hooks needed for the interactive components.

---

## 1. `music-player.html`

- **Replace the old panel layout** with a single `.brutalist-container` that holds two columns: `.control-stack` (left) and `.visual-stack` (right). Remove `.panel-card`, glassmorphism wrappers, and prior flex splits.
- **Left column**
  - Add `.vinyl-wrapper` containing a square frame plus a circular `.vinyl` with `.vinyl-center`.
  - Below the vinyl, add `.track-data` that behaves like a code block. Include placeholders for title, artist, album, and duration (spans with IDs/classes so JS can inject data).
- **Right column**
  - **CRT block**: Create `.crt-tv` with a child `.static-noise` div and a `<p class="crt-status">NO SIGNAL</p>` element for the text overlay. This element needs to be easily updatable from JS.
  - **Mascot block**: `.mascot-container` wraps the mascot image. Use `<img src="../吉祥物/成品/IMG_20251103_163648.png" alt="Ryan Station Mascot">`. (If you prefer `.jpg`, update the asset accordingly.)
  - **Controls**: Replace existing rounded buttons with a `.glitch-controls` div containing square buttons (`.glitch-btn`) for previous/play/pause/next and the progress slider. Keep IDs or data attributes referenced by the JS (e.g., `#prev-btn`, `#play-btn`, `#next-btn`, `#seek-bar`). Volume control can stay but must adopt the new styling.
  - **AI terminal**: Add `.ai-terminal` wrapping a `<label>` and `<input type="text" id="ai-input" placeholder="> enter mood to hack the system">`.
- Ensure the scanline overlay is represented via an empty `<div class="scanlines" aria-hidden="true"></div>` placed near the root of the page so it spans the viewport.

### Suggested HTML skeleton
```html
<body>
  <div class="grid-warp"></div>
  <div class="scanlines" aria-hidden="true"></div>
  <main class="brutalist-container">
    <section class="control-stack">
      <div class="vinyl-wrapper">
        <div class="vinyl">
          <div class="vinyl-center"></div>
        </div>
      </div>
      <pre class="track-data" id="track-data">
Title: <span class="track-title"></span>
Artist: <span class="track-artist"></span>
Album: <span class="track-album"></span>
Duration: <span class="track-duration"></span>
      </pre>
    </section>
    <section class="visual-stack">
      <div class="crt-tv">
        <div class="static-noise"></div>
        <p class="crt-status">NO SIGNAL</p>
      </div>
      <div class="mascot-container">
        <img src="../吉祥物/成品/IMG_20251103_163648.png" alt="Ryan Station Mascot">
      </div>
      <div class="glitch-controls">
        <button id="prev-btn" class="glitch-btn">⟵</button>
        <button id="play-btn" class="glitch-btn">▶</button>
        <button id="next-btn" class="glitch-btn">⟶</button>
        <input type="range" id="seek-bar" min="0" max="100" value="0">
      </div>
      <div class="ai-terminal">
        <label for="ai-input">AI TERMINAL</label>
        <input id="ai-input" type="text" placeholder="> enter mood to hack the system">
      </div>
    </section>
  </main>
</body>
```

---

## 2. `music-player.css`

- **Base setup**
  - Overwrite `:root` with:
    - `--acid-lime: #CCFF00`
    - `--alert-red: #FF2A00`
    - `--abyss-black: #050505`
  - Set `body` to `font-family: 'Courier New', Courier, monospace;` with headings using Impact/Arial Black (e.g., `h1, h2 { font-family: 'Impact', 'Arial Black', sans-serif; }`). Background color uses `--abyss-black`.
  - Force `cursor: crosshair` globally; control focus outlines with high-contrast 2px strokes.

- **Glitch background**
  - Add `.grid-warp` as a fixed pseudo 3D grid (use `position: fixed; inset: 0; perspective: 600px;` with `background: repeating-linear-gradient` to create the lines). Animate using `@keyframes grid-scroll` (translate/scale) to simulate infinite movement.
  - Add a `::before` or `.grid-warp::before` overlay for neon gradients if desired.
  - `.scanlines` overlays horizontal lines with `mix-blend-mode: screen` and `animation: scan 4s linear infinite;`.

- **Layout & container**
  - `.brutalist-container`: max-width ~1100px, display flex (wrap single row), heavy border `6px solid var(--acid-lime)`, background `rgba(5,5,5,0.85)`, box-shadow `15px 15px 0 var(--alert-red)`, `text-transform: uppercase`.
  - `.control-stack`/`.visual-stack`: flexed columns with gap ~2rem; stack vertically via media queries for small screens. Keep padding generous (2rem).

- **Vinyl & track data**
  - `.vinyl-wrapper`: square frame with border + drop shadow.
  ٩ `.vinyl`: circular gradient mimicking grooves, rotate via animation `spin`.
  - `.track-data`: style as neon terminal block (`background: #0a0a0a; border: 3px solid var(--alert-red); font-size ~0.95rem; line-height 1.4; text-transform: none; color uses `var(--acid-lime)` with `span` values in white).

- **CRT TV**
  - `.crt-tv`: ratio 4:3 (use `aspect-ratio`). Background #111 with thick border and clamp; inner glow using inset box-shadow. `.crt-status` uses Impact font, uppercase lime text, text-shadow to mimic scan bloom.
  - `.static-noise`: absolute overlay with `background-image: url(data-uri noise)` or `linear-gradient` trick; animate `opacity`/`background-position` to flicker. Provide separate classes or states for play/pause (JS toggles e.g., `.is-playing`) to adjust opacity.

- **Mascot peek**
  - `.mascot-container`: positioned relative to `.visual-stack` (e.g., align bottom-right). Initially off-screen via `transform: translate(40%, 40%) scale(0.8); opacity: 0;`.
  - `.mascot-container.visible`: transitions to `transform: translate(0,0); opacity: 1;` plus add `animation: glitch 0.2s steps(2) infinite alternate;`.
  - Create `@keyframes glitch` and `@keyframes peek` if needed; combine with `filter: hue-rotate`.

- **Controls**
  - `.glitch-controls`: grid layout. Buttons `.glitch-btn` have square corners, 3px borders, uppercase text, background `var(--acid-lime)` with `color: #050505`. On hover invert colors; on `:active`, move `2px` down-right and change box-shadow to simulate press.
  - Range inputs: remove rounding, style track in neon; use `accent-color: var(--alert-red)` for quick hits. Ensure progress handle matches theme.

- **AI terminal**
  - `.ai-terminal`: full-width block with `background: #080808; border: 3px dashed var(--acid-lime); font-family Courier; label Impact.
  - Input uses monospace, uppercase placeholder, blinking caret effect via `animation`.

- **Responsive tweaks**
  - Under 900px stack `.visual-stack` below `.control-stack`, reduce border thickness to 4px, ensure buttons wrap.

---

## 3. `music-player.js`

- **Keep existing core logic** (`loadPlaylist`, `playTrack`, `pauseTrack`, progress slider updates, playlist loading). Only adjust selectors to match the new markup (e.g., new class names for titles).

- **New references**
  - Cache DOM nodes: `.mascot-container`, `.crt-status`, `.static-noise`, and `.ai-terminal input`.
  - Update track info text using `.track-title`, `.track-artist`, etc., instead of previous elements.

- **Mascot peek-a-boo**
  - When audio starts playing (inside `playTrack` or the load callback), add `.visible` to the mascot container. When paused/stopped, remove the class.
  - Hook into the existing play/pause toggle to ensure both manual pause and when a track ends update the state (listen to `audio.onpause`/`onplay` events).

- **CRT TV status**
  - Create `updateTvState(isPlaying)` function:
    - When `true`: set `.crt-status.textContent = 'PLAYING...'`, add `.is-playing` to `.static-noise`.
    - When `false`: text becomes `NO SIGNAL`, remove `.is-playing`.
  - Call this from the same places you touch the mascot state to keep the UI in sync.

- **AI terminal hook**
  - Add `const aiInput = document.getElementById('ai-input');`
  - Listen for `keydown` (Enter key). On Enter:
    - `const mood = aiInput.value.trim();`
    - If not empty, call a stub `hackTheSystem(mood);` (define `function hackTheSystem(mood) { console.log('[AI TERMINAL]', mood); /* TODO: integrate Gemini */ }`)
    - Clear the input afterward.
  - Ensure pressing Enter does not submit/refresh (prevent default).

- **Misc**
  - Update any query selectors or event bindings that referenced removed elements (e.g., old panel classes).
  - Ensure the progress bar & durations still update correctly after the structural changes.
  - Consider moving repeated DOM updates (title, artist etc.) into a helper `renderTrackData(track)` for clarity.

---

## 4. Deliverable Checklist
1. HTML uses the new brutalist/glitch layout and includes the CRT TV, mascot block, and AI terminal input.
2. CSS defines the Acid Glitch visual language: neon palette, 3D grid background, scanlines, crosshair cursor, glitch animations, square buttons.
3. JS reflects the new DOM, animates mascot and CRT state based on playback, and includes the AI terminal listener calling `hackTheSystem`.
4. Existing playback functionality remains intact (playlist loading, track switching, progress + duration updates).

---

## 5. CRT MV Playback Upgrade

Augment the TV component so it can play looped MV footage per track.

### Data (`playlist.json`)
- Each track can include an optional `"mv"` property containing the Cloudflare R2 video URL (MP4/WebM). Keep existing fields untouched so older entries remain valid.

### HTML (`music-player.html`)
- Inside `.crt-tv`, add a `<video class="crt-mv" muted loop playsinline preload="metadata"></video>` element that sits behind the scanline/static layers.
- Ensure the video is wrapped or positioned so it never bleeds outside the CRT frame and inherits the same aspect ratio. Use CSS to keep it covered by scanlines/static overlays.

### CSS (`music-player.css`)
- Add styling for `.crt-mv` so it fills the CRT screen (`position:absolute; inset:0; object-fit:cover; z-index:0`), while `.static-noise` and `.crt-status` remain above it.
- Provide a utility class (e.g., `.crt-mv.hidden`) for toggling visibility if needed.

### JavaScript (`music-player.js`)
- Cache the video element reference (`const crtVideo = document.querySelector('.crt-mv');`).
- `loadTrack(index)`:
  - If `track.mv` exists, set `crtVideo.src = track.mv`, remove any `hidden` class, and hide `.static-noise` + `.crt-status`.
  - If no video, pause/reset the video element, add `hidden`, and show static + status text (set to `NO SIGNAL`).
- `playTrack()` / `pauseTrack()`:
  - When audio plays, call `crtVideo.play()` if it has a source; when audio pauses, call `crtVideo.pause()`.
  - Handle `Promise` rejections gracefully (e.g., browsers blocking autoplay); fallback to static noise if playback fails.
- On track end or when switching, ensure the video resets to time 0.

### Acceptance
- Playing a track with `mv` shows video in the CRT (with scanline overlay) synced with audio start/stop.
- Tracks without `mv` display the original static noise + `NO SIGNAL`.
- Video elements only preload metadata until playback starts to save bandwidth.

---

## 6. AI Terminal Phase 1 – Intelligent Song Selection

Embed Gemini-powered intent detection so the terminal can pick songs by mood.

### Data (`playlist.json`)
- Each track includes a `tags` array (e.g., `["sad","slow","piano"]`). Populate sample tags for at least the first 3–5 entries so the feature can be demoed; remaining tracks may have an empty array if curation isn’t ready.

### HTML/CSS (`music-player.html` & `music-player.css`)
- Extend the AI terminal UI with a settings gear button next to the input field.
  - When clicked it opens a lightweight modal or prompt allowing the user to paste their Gemini API key.
  - Persist the key inside `localStorage` under `GEMINI_API_KEY`.
- Add a simple log/output area below the input to show the latest AI reply.
- Provide basic styling for the gear button / modal so it matches the acid glitch aesthetic.

### JavaScript (`music-player.js`)
- Store/retrieve the API key via helpers (`getGeminiKey`, `setGeminiKey`). The settings button should prompt for the key, save it, and confirm to the user.
- Implement `callGeminiAI(userInput)`:
  - Build a context string from the playlist: `Song List: 1. [Title] (Tags: ...), 2. …`
  - Compose the system prompt:  
    `"You are the DJ of Ryan Station. Pick a song from the provided list that matches the user's mood. Output strictly JSON: { \"reply\": \"...\", \"command\": \"PLAY_SONG\", \"target\": \"Exact Song Title\" }."`
  - Call the Gemini API (fetch POST) with the user input + context. Handle missing API key gracefully (show warning in the log).
  - Parse the JSON reply; if parsing fails, show the raw message.
- After receiving a response:
  - Render the `reply` string in the terminal log area.
  - If `command === "PLAY_SONG"` and `target` matches a track title, load/play that song.

### Terminal Behavior
- Pressing Enter still sends the text; after the AI responds, automatically clear the input.
- The log area should show at least the latest reply (optionally append history).

### Exclusions
- No mascot reactions or theme glitching in this phase.
- Only mood-based song selection; other commands may be ignored for now.
