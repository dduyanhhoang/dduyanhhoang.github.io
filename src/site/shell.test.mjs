// node src/site/shell.test.mjs
import assert from 'node:assert/strict';
import { createShell, closest } from './shell.js';

const pages = [
  { name: 'home', href: '/home/' },
  { name: 'links', href: '/links/' },
  { name: 'research', href: '/research/' },
];
const fixed = new Date('2026-10-11T12:00:00Z');
const sh = () => createShell({ pages, now: () => fixed });
const say = (s, line) => s.run(line).out.map((o) => o.text ?? o.entries.map((e) => e.name).join(' ')).join('\n');

// navigation
let s = sh();
assert.equal(s.run('cd research').go, '/research/');
assert.equal(s.run('cd ./links/').go, '/links/');
assert.equal(s.run('open home').go, '/home/');
assert.equal(s.run('cd').go, '/home/');               // bare cd goes home
assert.equal(s.run('cd ~').go, '/home/');
assert.equal(s.run('cd ..').go, undefined);           // stays put, prints nothing
assert.deepEqual(s.run('cd ..').out, []);
assert.match(say(s, 'cd hello.txt'), /Not a directory/);
assert.match(say(s, 'cd reserch'), /No such file or directory \(did you mean research\?\)/);

// listing and files
assert.equal(say(s, 'ls'), 'home links research hello.txt');
assert.equal(say(s, 'ls -a'), '. .. home links research hello.txt .secret');
assert.equal(say(s, 'ls /'), 'home links research hello.txt');
assert.match(say(s, 'ls nope'), /cannot access 'nope'/);
assert.match(say(s, 'cat hello.txt'), /you found a file/);
assert.match(say(s, 'cat home'), /Is a directory/);
assert.match(say(s, 'cat'), /missing file operand/);

// the little things
assert.equal(say(s, 'pwd'), '/');
assert.equal(say(s, 'whoami'), 'guest');
assert.equal(say(s, 'echo hello   world'), 'hello world');
assert.equal(say(s, 'date'), fixed.toString());
assert.match(say(s, 'uname -a'), /^Linux ddah/);
assert.match(say(s, 'sudo rm -rf /'), /not in the sudoers file/);
assert.match(say(s, 'man ls'), /^ls: /);
assert.match(say(s, 'man nope'), /No manual entry/);
assert.match(say(s, 'neofetch'), /Pages: 3/);
assert.equal(s.run('clear').clear, true);
assert.match(say(s, 'hepl'), /command not found \(did you mean help\?\)/);
assert.match(say(s, 'qwertyuiop'), /command not found$/);
assert.deepEqual(s.run('   ').out, []);

// history
s = sh();
s.run('ls'); s.run('whoami'); s.run('');
assert.deepEqual(s.history, ['ls', 'whoami']);
assert.equal(say(s, 'history'), '   1  ls\n   2  whoami\n   3  history');

// tab completion
s = sh();
assert.deepEqual(s.complete('neo'), { line: 'neofetch ', options: [] });
assert.deepEqual(s.complete('cd re'), { line: 'cd research/', options: [] });
assert.deepEqual(s.complete('cat he'), { line: 'cat hello.txt ', options: [] });
assert.deepEqual(s.complete('h'), { line: 'h', options: ['help', 'history'] });
assert.deepEqual(s.complete('cd '), { line: 'cd ', options: ['home', 'links', 'research'] });
assert.deepEqual(s.complete('e'), { line: 'e', options: ['echo', 'emacs', 'exit'] });

assert.equal(closest('lss', ['ls', 'home']), 'ls');
console.log('shell: all checks passed');
