/**
 * Subset the Computer Modern faces to the glyphs this page actually sets.
 * The upstream faces carry the full TeX glyph complement (~200KB each);
 * this page sets about ninety words of Latin text.
 *
 * Sources are fetched fresh so the subsets are always reproducible from
 * upstream rather than from a previously-subset file.
 *
 *   node scripts/subset-fonts.mjs
 */
import subsetFont from 'subset-font';
import { writeFile, mkdir, stat } from 'node:fs/promises';

const BASE = 'https://cdn.jsdelivr.net/npm/computer-modern@0.1.2/fonts';
const OUT = 'public/fonts';

const FACES = [
  'cmu-serif-500-roman',
  'cmu-serif-500-italic',
  'cmu-serif-700-roman',
  'cmu-typewriter-text-500-roman',
];

// printable ASCII plus the few typographic marks the page uses
const ascii = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join('');
const extra = '©·—–…‘’“”×÷°';
const TEXT = ascii + extra;

await mkdir(OUT, { recursive: true });

for (const face of FACES) {
  const res = await fetch(`${BASE}/${face}.woff2`);
  if (!res.ok) throw new Error(`${face}: HTTP ${res.status}`);
  const original = Buffer.from(await res.arrayBuffer());
  const subset = await subsetFont(original, TEXT, { targetFormat: 'woff2' });
  const path = `${OUT}/${face}.woff2`;
  await writeFile(path, subset);
  const kb = (n) => (n / 1024).toFixed(1) + 'KB';
  console.log(`${face}: ${kb(original.length)} -> ${kb(subset.length)}`);
}
