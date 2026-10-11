import { match, resolve } from './finder.js';

const $ = (sel) => document.querySelector(sel);
const form = $('#prompt');
const input = $('#cmd');
const list = $('#suggest');
const log = $('#log');
const keys = $('#keys');

/* The <nav> list in the HTML is the registry of pages. */
const pages = [...document.querySelectorAll('#pages li')].map((li) => {
  const a = li.querySelector('a');
  return { name: a.textContent.replace(/\/$/, ''), href: a.getAttribute('href'), desc: li.querySelector('.desc')?.textContent ?? '' };
});

const HELP = `Find a page by typing part of its name.

  <name>          open the best match
  cd <name>       same, shell style (cd alone opens home)
  ls              list pages
  clear           clear the screen
  help, ?         show this help

Keys: Tab completes, Up and Down choose, Enter opens,
Esc clears the line, Ctrl-C cancels it, Ctrl-L clears the screen.`;

let shown = [];   // pages currently in the suggestion list
let active = -1;  // index into shown, -1 when nothing is selected

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function scrollToPrompt() {
  input.scrollIntoView({ block: 'nearest' });
}

function echo(line, suffix = '') {
  const row = el('div', 'line');
  row.append(form.querySelector('.ps1').cloneNode(true), ' ' + line + suffix);
  row.querySelector('.sr-only')?.remove();
  log.append(row);
}

function print(text, cls = 'out') {
  log.append(el('p', cls, text));
}

function printLs() {
  log.append($('#pages').cloneNode(true));
  log.lastChild.removeAttribute('id');
}

/* Bold the letters of the name that the query matched, in order. */
function highlight(name, query) {
  const frag = document.createDocumentFragment();
  const q = query.trim().toLowerCase().replace(/^\/+/, '');
  let i = 0;
  for (const ch of name) {
    if (i < q.length && ch === q[i]) { frag.append(el('mark', null, ch)); i++; }
    else frag.append(ch);
  }
  return frag;
}

function select(i) {
  active = i;
  [...list.children].forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
  if (i >= 0) input.setAttribute('aria-activedescendant', list.children[i].id);
  else input.removeAttribute('aria-activedescendant');
}

function closeList() {
  shown = [];
  list.replaceChildren();
  list.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  select(-1);
}

/* Suggest only for a bare word or the argument of cd/open. */
function suggest() {
  const value = input.value;
  const m = /^\s*(?:(?:cd|open)\s+)?(\S*)$/i.exec(value);
  const query = m ? m[1] : null;
  const isCommand = /^\s*(help|ls|clear|\?)\s*$/i.test(value);
  if (!value.trim() || query == null || isCommand) return closeList();

  shown = match(query, pages);
  if (!shown.length) return closeList();

  list.replaceChildren(...shown.map((p, i) => {
    const li = el('li');
    li.id = `opt-${i}`;
    li.setAttribute('role', 'option');
    const name = el('span', 'name');
    name.append(highlight(p.name, query), '/');
    li.append(name, el('span', 'desc', p.desc));
    li.addEventListener('mousedown', (e) => { e.preventDefault(); go(p); });
    return li;
  }));
  list.hidden = false;
  input.setAttribute('aria-expanded', 'true');
  select(0);
}

function go(page) {
  echo(input.value || page.name);
  print(`Opening ${page.href}`);
  closeList();
  input.value = '';
  window.location.assign(page.href);
}

function run(line) {
  const action = resolve(line, pages);
  if (action.type === 'go') return go(active >= 0 ? shown[active] : action.page);

  echo(line);
  input.value = '';
  closeList();
  switch (action.type) {
    case 'help': print(HELP, 'help'); break;
    case 'ls': printLs(); break;
    case 'clear': log.replaceChildren(); break;
    case 'unknown': {
      const tip = action.hint ? `Did you mean "${action.hint}"? ` : '';
      print(`Error: no page or command named "${action.word}". ${tip}Type help to see what works.`, 'err');
      break;
    }
  }
  scrollToPrompt();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  /* An open, highlighted suggestion wins over the raw text. */
  if (active >= 0 && shown[active]) return go(shown[active]);
  run(input.value);
});

input.addEventListener('input', suggest);

input.addEventListener('keydown', (e) => {
  const n = shown.length;
  if (e.key === 'ArrowDown' && n) { e.preventDefault(); select((active + 1) % n); }
  else if (e.key === 'ArrowUp' && n) { e.preventDefault(); select((active - 1 + n) % n); }
  else if (e.key === 'Tab' && n && !e.shiftKey) {
    e.preventDefault();
    const prefix = /^\s*(cd|open)\s+/i.exec(input.value)?.[0] ?? '';
    input.value = prefix + shown[Math.max(active, 0)].name;
    suggest();
  }
  else if (e.key === 'Escape') { e.preventDefault(); if (n) closeList(); else input.value = ''; }
  else if (e.key === '?' && !input.value) { e.preventDefault(); run('help'); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); log.replaceChildren(); }
  else if (e.ctrlKey && e.key.toLowerCase() === 'c' && input.selectionStart === input.selectionEnd) {
    e.preventDefault();
    echo(input.value, '^C');
    input.value = '';
    closeList();
    scrollToPrompt();
  }
});

/* Clicking empty space in the terminal returns focus to the prompt,
   unless the click was on a link or ended a text selection. */
$('#term').addEventListener('click', (e) => {
  if (e.target.closest('a, button, input') || String(window.getSelection())) return;
  input.focus();
});

keys.addEventListener('click', (e) => {
  const b = e.target.closest('[data-run]');
  if (!b) return;
  run(b.dataset.run);
  input.focus();
});

form.hidden = false;
keys.hidden = false;
input.focus();
