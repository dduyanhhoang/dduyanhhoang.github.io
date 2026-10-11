import { createShell } from './shell.js';

const $ = (sel) => document.querySelector(sel);
const form = $('#prompt');
const input = $('#cmd');
const log = $('#log');

/* The <nav> list in the HTML is the registry of pages. */
const pages = [...document.querySelectorAll('#pages a')].map((a) => ({
  name: a.textContent.replace(/\/$/, ''),
  href: a.getAttribute('href'),
}));
const shell = createShell({ pages });

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function echo(line, suffix = '') {
  const row = el('div', 'line');
  const ps1 = form.querySelector('.ps1').cloneNode(true);
  ps1.querySelector('.sr-only')?.remove();
  row.append(ps1, ' ' + line + suffix);
  log.append(row);
}

function render(item) {
  if (item.kind === 'ls') {
    const ul = el('ul', 'ls-out');
    for (const e of item.entries) {
      const li = el('li');
      if (e.type === 'page') {
        const a = el('a', 'dir', `${e.name}/`);
        a.href = e.href;
        li.append(a);
      } else li.append(el('span', e.type === 'dir' ? 'dir' : 'file', e.name));
      ul.append(li);
    }
    log.append(ul);
  } else {
    log.append(el('pre', item.kind === 'error' ? 'out err' : 'out', item.text));
  }
}

let cursor = 0;   // position in history while walking it with Up/Down
let draft = '';

function submit(line) {
  echo(line);
  const res = shell.run(line);
  if (res.clear) log.replaceChildren();
  res.out.forEach(render);
  input.value = '';
  cursor = shell.history.length;
  draft = '';
  if (res.go) window.location.assign(res.go);
  input.scrollIntoView({ block: 'nearest' });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  submit(input.value);
});

input.addEventListener('keydown', (e) => {
  const h = shell.history;
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    const { line, options } = shell.complete(input.value);
    input.value = line;
    if (options.length > 1) {
      echo(line);
      log.append(el('pre', 'out', options.join('  ')));
      input.scrollIntoView({ block: 'nearest' });
    }
  } else if (e.key === 'ArrowUp' && h.length) {
    e.preventDefault();
    if (cursor === h.length) draft = input.value;
    cursor = Math.max(0, cursor - 1);
    input.value = h[cursor];
  } else if (e.key === 'ArrowDown' && cursor < h.length) {
    e.preventDefault();
    cursor += 1;
    input.value = cursor === h.length ? draft : h[cursor];
  } else if (e.ctrlKey && e.key.toLowerCase() === 'l') {
    e.preventDefault();
    log.replaceChildren();
  } else if (e.ctrlKey && e.key.toLowerCase() === 'c' && input.selectionStart === input.selectionEnd) {
    e.preventDefault();
    echo(input.value, '^C');
    input.value = '';
    cursor = h.length;
  }
});

/* Clicking empty space returns focus to the prompt, unless the click was
   on a link or ended a text selection. */
$('#term').addEventListener('click', (e) => {
  if (e.target.closest('a, input') || String(window.getSelection())) return;
  input.focus();
});

$('#pages-nav').hidden = true;
form.hidden = false;
input.focus();
