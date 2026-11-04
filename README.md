# Retro Game Heardle

Guess the game from a short clip of its music. Clips grow 2s → 4s → 7s → 11s → 16s → 22s.

Every wrong guess shows how close it was: platform, year (with an arrow toward the answer),
genre, studio and series, coloured green (match), yellow (close) or grey (no). A summary box
collects what you've learned so far.

Other helpers: a **Hint** button (blurred box art, then clearer art, then the first letter),
a "Right series!" badge when you guess the right franchise, and **Filters** for consoles and years.
Box art is looked up on Wikipedia when the page runs.

## Files
- `index.html` – the whole game (no build step, no server code)
- `games.js` – clue data per game (genre, studio, series)
- `songs.js` – the track list (128 games, one signature song each). Each line is one song:
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

## Daily mode and admin

- The game opens on **Daily**: one song per day (player's local date), the same for everyone, with a share button and a countdown. **Practice** is the old endless mode with filters.
- `daily.js` decides each day's song. Days pinned in `schedule.json` (`"YYYY-MM-DD": "videoId"`) use that song; other days use a fixed shuffle that goes through every game before repeating.
- `admin.html` lists every song with playback and start-time editing, and shows the schedule with Preview / Change / Pin. Saving commits `schedule.json` / `songs.js` through the GitHub API using a fine-grained token with Contents read/write on this repo. Without such a token the page can't change anything.
- `?date=YYYY-MM-DD&preview=1` plays any day's puzzle without saving progress.
- Feedback: set `FEEDBACK_URL` in `index.html` to a Formspree form endpoint to show the feedback button.
