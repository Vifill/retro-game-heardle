# Retro Game Heardle

Guess the game from a short clip of its music. Clips grow 1s → 2s → 4s → 7s → 11s → 16s.

## Files
- `index.html` – the whole game (no build step, no server code)
- `songs.js` – the track list (125 games). Each line is one song:
  `{"game": "...", "platform": "...", "year": 2001, "track": "...", "videoId": "<YouTube id>", "start": 0}`
  `start` is the second in the video where the clip begins (use it to skip a silent intro).

## Run it locally
YouTube often refuses to play inside a page opened straight from disk, so serve the folder:

    cd heardle
    python3 -m http.server 8000

then open http://localhost:8000.

## Notes
- Songs whose video is removed or not embeddable are skipped automatically and remembered in your browser.
- Stats (played, won, streak) are stored in your browser only.
