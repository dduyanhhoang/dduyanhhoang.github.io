// node src/site/finder.test.mjs
import assert from 'node:assert/strict';
import { match, resolve, closest } from './finder.js';

const pages = [
  { name: 'research', href: '/research/' },
  { name: 'home', href: '/home/' },
];
const names = (list) => list.map((p) => p.name);

// matching
assert.deepEqual(names(match('', pages)), ['research', 'home']);
assert.deepEqual(names(match('res', pages)), ['research']);
assert.deepEqual(names(match('rsch', pages)), ['research']); // subsequence
assert.deepEqual(names(match('/home/', pages)), ['home']);   // slashes ignored
assert.deepEqual(names(match('~', pages)), ['home']);        // alias
assert.deepEqual(names(match('xyz', pages)), []);

// commands
assert.equal(resolve('', pages).type, 'none');
assert.equal(resolve('  HELP ', pages).type, 'help');
assert.equal(resolve('?', pages).type, 'help');
assert.equal(resolve('ls', pages).type, 'ls');
assert.equal(resolve('clear', pages).type, 'clear');
assert.equal(resolve('cd research', pages).page.name, 'research');
assert.equal(resolve('open /research', pages).page.name, 'research');
assert.equal(resolve('cd', pages).page.name, 'home');        // bare cd goes home
assert.equal(resolve('re', pages).page.name, 'research');    // bare word, fuzzy

// typos: a dropped letter still opens the page; a swap gets a hint
assert.equal(resolve('reserch', pages).page.name, 'research');
assert.deepEqual(resolve('resaerch', pages), { type: 'unknown', word: 'resaerch', hint: 'research' });
assert.deepEqual(resolve('cd hmoe', pages), { type: 'unknown', word: 'hmoe', hint: 'home' });
assert.deepEqual(resolve('hepl', pages), { type: 'unknown', word: 'hepl', hint: 'help' });
assert.equal(resolve('zzzzzz', pages).hint, null);
assert.equal(closest('lss', ['ls', 'home']), 'ls');

console.log('finder: all checks passed');
