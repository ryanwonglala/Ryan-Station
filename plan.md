# CRT MV Integration Plan

## Phase 1 – Playlist Data Prep
1. Add a `mv` field (Cloudflare R2 URL placeholder) to a few `playlist.json` entries so the feature can be tested. Leave other tracks untouched so the fallback path is covered.
2. Ensure the JSON remains valid (comma placement, quoting).

## Phase 2 – HTML Update
1. Edit `music-player.html`’s `.crt-tv` section.
2. Insert `<video id="mv-player" class="crt-video" muted loop playsinline preload="metadata"></video>` right before the `.static-noise` div so the overlay sits above the video. Mark `preload="metadata"` as required by the spec.
3. No other structural changes required.

## Phase 3 – CSS Layering
1. Add `.crt-video` styles:
   - `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; opacity:0; transition: opacity 0.3s ease;`
2. Introduce `.crt-tv.has-mv` state:
   - `.crt-video { opacity:1; }`
   - `.crt-status { opacity:0; }`
   - `.static-noise { opacity:0.2; }` (lighter overlay)
3. Verify existing z-indices keep scanlines and handset overlays above the video.

## Phase 4 – JavaScript Logic
1. Cache `const crtVideo = document.getElementById('mv-player');` and `.crt-tv`.
2. Update `loadTrack(index)`:
   - If `track.mv` is truthy:
     * Set `crtVideo.src = track.mv;`
     * Call `crtVideo.load();`
     * Add `.has-mv` to `.crt-tv`.
   - Else:
     * `crtVideo.pause(); crtVideo.removeAttribute('src'); crtVideo.load();`
     * Remove `.has-mv`.
3. Update `playTrack()` / `pauseTrack()`:
   - After toggling audio state, if `.has-mv` and `crtVideo` has a source:
     * `crtVideo.play().catch(() => fallbackToStatic());`
     * `crtVideo.pause();` respectively.
4. Add helper `fallbackToStatic()` that removes `.has-mv`, clears `src`, and ensures static/status show.
5. Attach `error` listener on the video element to trigger the fallback when loading fails.

## Phase 5 – Verification
1. Reload playlist; confirm tracks with MV show video behind scanlines, others show static.
2. Play/pause audio and ensure MV syncs.
3. Seek/next/prev tracks to verify video resets appropriately.

---

# AI Terminal Phase 1 Plan

## Phase 1 – Settings UI
1. **HTML**: Inside `.ai-terminal`, add a gear button (`<button id="ai-settings-btn" class="ai-settings-btn"><i class="fas fa-cog"></i></button>`) adjacent to the input.
2. **CSS**: Style the button to align to the right, low-profile opacity, neon hover state.
3. **JS**:
   - Add helpers `setGeminiKey(key)` and `getGeminiKey()` that read/write `localStorage`.
   - Bind click handler to prompt for the key (MVP) and store it; confirm success via console/log UI.

## Phase 2 – Terminal Output Area
1. Extend `.ai-terminal` markup with `<div id="terminal-log" class="terminal-log"></div>` below the input to display replies.
2. Style the log with monospace text, neon borders and auto-scroll behavior.

## Phase 3 – Gemini Call Logic
1. Implement `async function callGeminiAI(userText)`:
   - Retrieve key; if absent, return `{ error: 'API key missing' }`.
   - Build context string from `playlist` entries (title + tags).
   - Construct POST request to Gemini endpoint with the specified system prompt and user input; handle fetch errors with try/catch.
   - Return the parsed text response (raw string or error object).
2. Add `parseGeminiResponse(text)` helper to safely convert the JSON string into `{ reply, command, target }` and surface parsing errors.

## Phase 4 – Integrate with `hackTheSystem`
1. Update `hackTheSystem(mood)` to:
   - Append a “> USER: …” line to the terminal log.
   - Await `callGeminiAI(mood)`.
   - If error, append “> SYSTEM: …”.
   - If success and command is `PLAY_SONG`, locate the track (`playlist.findIndex(t => t.title === target)`), call `loadTrack` + `playTrack`.
   - Append the AI reply to the log.
2. Ensure the input clears after submission.

## Phase 5 – Smoke Testing
1. Use the settings button to save a fake key; submit “play something sad” and inspect fetch payload in network tab (or log).
2. Without key, verify the log warns the user.
3. With a mocked response (or real key), confirm track switching occurs and the log updates accordingly.
