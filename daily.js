// Daily puzzle logic, shared by the game (index.html) and the admin page (admin.html).
//
// Each calendar day (in the player's own time zone) has one song. The admin can pin a
// song to a date in schedule.json; any day without a pinned song gets an automatic pick
// from a fixed shuffle of the song list, so every player sees the same song.

window.DAILY = (() => {
  const LAUNCH = '2026-11-04';           // puzzle #1
  const SEED = 'retro-heardle-v1';

  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => keyOf(new Date());
  const parse = key => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (key, n) => { const d = parse(key); d.setDate(d.getDate() + n); return keyOf(d); };
  const number = key => Math.round((parse(key) - parse(LAUNCH)) / 86400000) + 1;
  const isKey = s => /^\d{4}-\d{2}-\d{2}$/.test(s || '');

  // Small seeded PRNG (mulberry32) so the shuffle is the same everywhere.
  function rng(seedStr) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) { h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; }
    let a = h >>> 0;
    return () => {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // One song per game, shuffled with a fixed seed, so automatic picks cycle through
  // every game before any repeats.
  function autoOrder(songs) {
    const byGame = new Map();
    for (const s of [...songs].sort((a, b) => a.videoId.localeCompare(b.videoId))) {
      if (!byGame.has(s.game)) byGame.set(s.game, s);
    }
    const list = [...byGame.values()].sort((a, b) => a.game.localeCompare(b.game));
    const r = rng(SEED);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function autoPick(key, songs) {
    const order = autoOrder(songs);
    const n = number(key) - 1;
    return order[((n % order.length) + order.length) % order.length];
  }

  // Returns { song, pinned } for a date.
  function pick(key, songs, schedule) {
    const id = schedule && schedule[key];
    const pinned = id && songs.find(s => s.videoId === id);
    return pinned ? { song: pinned, pinned: true } : { song: autoPick(key, songs), pinned: false };
  }

  async function loadSchedule(base = '') {
    try {
      const r = await fetch(base + 'schedule.json?t=' + Date.now(), { cache: 'no-store' });
      return r.ok ? await r.json() : {};
    } catch { return {}; }
  }

  return { LAUNCH, today, addDays, number, isKey, pick, autoPick, loadSchedule };
})();
