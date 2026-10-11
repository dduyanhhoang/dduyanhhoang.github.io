/* Pure logic for the command prompt on the root page. No DOM here, so
   finder.test.mjs can run it under plain Node. */

const ALIASES = { '~': 'home' };
const COMMANDS = ['help', 'ls', 'clear', 'cd', 'open'];

const clean = (s) => s.trim().toLowerCase().replace(/^\/+|\/+$/g, '');

/* Lower is better; -1 means no match. Exact, then prefix, then an
   in-order subsequence with the fewest skipped letters. */
function score(q, name) {
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  let i = 0, last = -1, gaps = 0;
  for (let j = 0; j < name.length && i < q.length; j++) {
    if (name[j] !== q[i]) continue;
    if (last >= 0) gaps += j - last - 1;
    last = j;
    i++;
  }
  return i === q.length ? 2 + gaps : -1;
}

/** Pages whose name matches the query, best first. Empty query lists all. */
export function match(query, pages) {
  const q = ALIASES[clean(query)] ?? clean(query);
  if (!q) return pages.slice();
  return pages
    .map((p) => ({ p, s: score(q, p.name) }))
    .filter((x) => x.s >= 0)
    .sort((a, b) => a.s - b.s)
    .map((x) => x.p);
}

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Nearest name for a "did you mean" hint, or null when nothing is close. */
export function closest(word, names) {
  let best = null, bestD = Infinity;
  for (const n of names) {
    const d = distance(word, n);
    if (d < bestD) { best = n; bestD = d; }
  }
  return bestD <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
}

/**
 * Turn one input line into an action:
 *   { type: 'none' | 'help' | 'ls' | 'clear' }
 *   { type: 'go', page }
 *   { type: 'unknown', word, hint }   hint is a page or command name, or null
 */
export function resolve(line, pages) {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return { type: 'none' };
  const [first, ...rest] = words;
  const cmd = first.toLowerCase();

  if (cmd === 'help' || cmd === '?') return { type: 'help' };
  if (cmd === 'ls') return { type: 'ls' };
  if (cmd === 'clear') return { type: 'clear' };

  const target = cmd === 'cd' || cmd === 'open' ? rest.join(' ') || '~' : words.join(' ');
  const [page] = match(target, pages);
  if (page) return { type: 'go', page };

  const word = clean(target);
  const pool = cmd === 'cd' || cmd === 'open' ? pages.map((p) => p.name) : [...pages.map((p) => p.name), ...COMMANDS];
  return { type: 'unknown', word, hint: closest(word, pool) };
}
