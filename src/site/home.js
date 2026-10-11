import { match } from './finder.js';

/* /home: a placeholder app shell that exercises the patterns in
   UI/UX SPEC-001. Every string and number here is placeholder data. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Per-viewer conveniences only; the page works without storage. */
const store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private mode */ } },
};

function icon(id) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${id}`);
  svg.append(use);
  return svg;
}
function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

/* ---------------- toast with undo ---------------- */
const toast = $('#toast');
let undoFn = null;
function notify(message, undo = null) {
  $('#toast-msg').textContent = message;
  undoFn = undo;
  $('#toast-undo').hidden = !undo;
  toast.hidden = false;
}
function dismiss() { toast.hidden = true; undoFn = null; }
$('#toast-undo').addEventListener('click', () => { const fn = undoFn; dismiss(); fn?.(); });
$('#toast-close').addEventListener('click', dismiss);

/* ---------------- items ---------------- */
let items = store.get('home.items', [
  { name: 'Alpha Placeholder', detail: 'Placeholder detail' },
  { name: 'Beta Placeholder', detail: 'Placeholder detail' },
  { name: 'Gamma Placeholder', detail: 'Placeholder detail' },
  { name: 'Delta Placeholder', detail: 'Placeholder detail' },
]);
function setItems(next) { items = next; store.set('home.items', items); renderItems(); renderResults(); }

function itemRow(item, { deletable }) {
  const li = el('li', 'row');
  const text = el('span', 'row-text');
  text.append(el('span', 'row-title', item.name), el('span', 'row-sub', item.detail));
  li.append(text);
  if (deletable) {
    const del = el('button', 'icon-btn destructive');
    del.type = 'button';
    del.setAttribute('aria-label', `Delete ${item.name}`);
    del.title = 'Delete';
    del.append(icon('i-trash'));
    del.addEventListener('click', () => deleteItem(item));
    li.append(del);
  }
  return li;
}

function renderItems() {
  $('#item-list').replaceChildren(...items.map((it) => itemRow(it, { deletable: true })));
  $('#item-list').hidden = !items.length;
  $('#items-empty').hidden = items.length > 0;
}

function deleteItem(item) {
  const before = items;
  const i = items.indexOf(item);
  setItems(items.filter((x) => x !== item));
  notify(`Deleted ${item.name}`, () => setItems(before));
  /* keep focus somewhere sensible after the row disappears */
  const rows = $$('#item-list .icon-btn');
  (rows[Math.min(i, rows.length - 1)] ?? $('#items-empty .btn'))?.focus();
}

/* ---------------- sheet ---------------- */
const sheet = $('#sheet');
const grabber = $('.grabber', sheet);
let opener = null;

function openSheet() {
  opener = document.activeElement;
  $('#sheet-form').reset();
  setError($('#new-name'), '');
  setDetent(false);
  sheet.showModal();
  $('#new-name').focus();
}
function setDetent(large) {
  sheet.dataset.detent = large ? 'large' : 'medium';
  grabber.setAttribute('aria-pressed', String(large));
  grabber.setAttribute('aria-label', large ? 'Shrink Sheet' : 'Expand Sheet');
}
grabber.addEventListener('click', () => setDetent(sheet.dataset.detent !== 'large'));

$('#sheet-form').addEventListener('submit', (e) => {
  const action = e.submitter?.value;
  if (action !== 'add') return;
  const name = $('#new-name').value.trim();
  if (!name) {
    e.preventDefault();
    setError($('#new-name'), 'Enter a name for the item.');
    $('#new-name').focus();
    return;
  }
  const before = items;
  const item = { name, detail: $('#new-detail').value.trim() || 'Placeholder detail' };
  setItems([item, ...items]);
  notify(`Added ${name}`, () => setItems(before));
});
sheet.addEventListener('close', () => opener?.focus?.());
/* Clicking the backdrop dismisses, like a sheet's swipe-down. */
sheet.addEventListener('click', (e) => { if (e.target === sheet) sheet.close('cancel'); });

/* ---------------- inline validation ---------------- */
function setError(input, message) {
  const out = document.getElementById(input.getAttribute('aria-describedby'));
  out.textContent = message;
  out.hidden = !message;
  input.setAttribute('aria-invalid', String(Boolean(message)));
}
$('#new-name').addEventListener('input', (e) => { if (e.target.value.trim()) setError(e.target, ''); });

/* ---------------- settings: autosave, help, reset ---------------- */
const form = $('#settings-form');
const f = form.elements; /* form.name would be the form's own name, not the field */
const DEFAULTS = { name: '', email: '', optionOne: true, optionTwo: false, choice: 'Automatic' };
function readSettings() {
  return {
    name: f.name.value, email: f.email.value,
    optionOne: f.optionOne.checked, optionTwo: f.optionTwo.checked, choice: f.choice.value,
  };
}
function writeSettings(s) {
  f.name.value = s.name; f.email.value = s.email;
  f.optionOne.checked = s.optionOne; f.optionTwo.checked = s.optionTwo; f.choice.value = s.choice;
}
writeSettings({ ...DEFAULTS, ...store.get('home.settings', {}) });

function validEmail(v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function save() {
  const s = readSettings();
  if (!validEmail(s.email)) return;
  store.set('home.settings', s);
  $('#save-status').textContent = 'Saved.';
}
form.addEventListener('change', save);
f.email.addEventListener('blur', () => {
  setError(f.email, validEmail(f.email.value.trim()) ? '' : 'Enter an email address like name@example.com.');
});
f.email.addEventListener('input', () => { if (validEmail(f.email.value.trim())) setError(f.email, ''); });

const helpBtn = $('[aria-controls="help-two"]');
helpBtn.addEventListener('click', () => {
  const open = helpBtn.getAttribute('aria-expanded') !== 'true';
  helpBtn.setAttribute('aria-expanded', String(open));
  $('#help-two').hidden = !open;
});

function resetSettings() {
  const before = readSettings();
  writeSettings(DEFAULTS);
  setError(f.email, '');
  store.set('home.settings', DEFAULTS);
  notify('Settings reset', () => { writeSettings(before); store.set('home.settings', before); });
}

/* ---------------- search ---------------- */
let recents = store.get('home.recents', []);
const q = $('#q');

function renderRecents() {
  $('#recent-list').replaceChildren(...recents.map((term) => {
    const li = el('li');
    const b = el('button', 'row row-btn');
    b.type = 'button';
    b.append(icon('i-clock'), el('span', 'row-title', term));
    b.addEventListener('click', () => { q.value = term; renderResults(); q.focus(); });
    li.append(b);
    return li;
  }));
  $('#recent-list').hidden = !recents.length;
  $('#recent-empty').hidden = recents.length > 0;
  $('[data-action="clear-recents"]').hidden = !recents.length;
}
function remember(term) {
  term = term.trim();
  if (!term) return;
  recents = [term, ...recents.filter((t) => t !== term)].slice(0, 5);
  store.set('home.recents', recents);
  renderRecents();
}
/* Suggestions while typing: results update on every keystroke. */
function renderResults() {
  const term = q.value.trim();
  $('#results').hidden = !term;
  $('#recents').hidden = Boolean(term);
  if (!term) return;
  const found = match(term.toLowerCase(), items.map((it) => ({ ...it, name: it.name.toLowerCase(), item: it }))).map((x) => x.item);
  $('#result-list').replaceChildren(...found.map((it) => itemRow(it, { deletable: false })));
  $('#result-list').hidden = !found.length;
  $('#no-results').hidden = found.length > 0;
  $('#no-results-title').textContent = `No Results for "${term}"`;
}
q.addEventListener('input', renderResults);
$('#search-form').addEventListener('submit', (e) => { e.preventDefault(); remember(q.value); });
q.addEventListener('keydown', (e) => { if (e.key === 'Escape' && q.value) { e.preventDefault(); q.value = ''; renderResults(); } });

/* ---------------- menu ---------------- */
const moreBtn = $('[aria-controls="menu-more"]');
const menu = $('#menu-more');
const menuItems = () => $$('[role="menuitem"]', menu);
function openMenu() {
  menu.hidden = false;
  moreBtn.setAttribute('aria-expanded', 'true');
  menuItems()[0].focus();
}
function closeMenu(returnFocus = true) {
  if (menu.hidden) return;
  menu.hidden = true;
  moreBtn.setAttribute('aria-expanded', 'false');
  if (returnFocus) moreBtn.focus();
}
moreBtn.addEventListener('click', () => (menu.hidden ? openMenu() : closeMenu()));
menu.addEventListener('keydown', (e) => {
  const list = menuItems();
  const i = list.indexOf(document.activeElement);
  if (e.key === 'ArrowDown') { e.preventDefault(); list[(i + 1) % list.length].focus(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); list[(i - 1 + list.length) % list.length].focus(); }
  else if (e.key === 'Home') { e.preventDefault(); list[0].focus(); }
  else if (e.key === 'End') { e.preventDefault(); list.at(-1).focus(); }
  else if (e.key === 'Escape' || e.key === 'Tab') { closeMenu(e.key === 'Escape'); }
});
document.addEventListener('pointerdown', (e) => { if (!menu.hidden && !e.target.closest('#menu-more, [aria-controls="menu-more"]')) closeMenu(false); });

/* ---------------- actions ---------------- */
async function share() {
  const url = location.href;
  try {
    if (navigator.share) { await navigator.share({ title: document.title, url }); return; }
    await navigator.clipboard.writeText(url);
    notify('Link copied');
  } catch (err) {
    if (err?.name !== 'AbortError') notify('Unable to share. Copy the address from the address bar.');
  }
}
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-action], [data-go]');
  if (!b) return;
  if (b.closest('#menu-more')) closeMenu(false);
  if (b.dataset.go) { location.hash = b.dataset.go; return; }
  switch (b.dataset.action) {
    case 'add': openSheet(); break;
    case 'share': share(); break;
    case 'reset': resetSettings(); break;
    case 'clear-recents': {
      const before = recents;
      recents = []; store.set('home.recents', recents); renderRecents();
      notify('Recent searches cleared', () => { recents = before; store.set('home.recents', recents); renderRecents(); });
      break;
    }
  }
});

/* ---------------- chart (single series, one message) ---------------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const VALUES = [18, 24, 21, 30, 27, 35, 42];
const NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}
function renderChart() {
  const W = 560, H = 180, top = 20, bottom = 24, max = 50;
  const plotH = H - top - bottom;
  const step = W / VALUES.length, barW = Math.min(36, step * 0.5);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'chart-svg', role: 'group', 'aria-label': 'Placeholder metric by day' });
  for (const g of [0, 25, 50]) {
    const y = top + plotH - (g / max) * plotH;
    svg.append(svgEl('line', { x1: 0, x2: W, y1: y, y2: y, class: g ? 'grid' : 'baseline' }));
  }
  const tip = $('#chart-tip') ?? el('div', 'chart-tip');
  tip.id = 'chart-tip';
  tip.hidden = true;
  VALUES.forEach((v, i) => {
    const h = (v / max) * plotH, x = step * i + (step - barW) / 2, y = top + plotH - h, r = 4;
    const g = svgEl('g', { class: 'bar', tabindex: '0', role: 'img', 'aria-label': `${DAYS[i]}: ${v}` });
    /* hit target wider and taller than the mark */
    g.append(svgEl('rect', { x: step * i, y: top, width: step, height: plotH, class: 'hit' }));
    g.append(svgEl('path', { d: `M${x},${top + plotH} V${y + r} q0,-${r} ${r},-${r} h${barW - 2 * r} q${r},0 ${r},${r} V${top + plotH} Z`, class: 'mark' }));
    svg.append(g);
    const day = svgEl('text', { x: step * i + step / 2, y: H - 6, class: 'axis' });
    day.textContent = DAYS[i];
    svg.append(day);
    if (v === Math.max(...VALUES)) {
      const label = svgEl('text', { x: step * i + step / 2, y: y - 6, class: 'value' });
      label.textContent = v;
      svg.append(label);
    }
    const show = () => {
      tip.textContent = `${DAYS[i]}: ${v}`;
      tip.hidden = false;
      const box = $('#chart').getBoundingClientRect(), b = g.getBoundingClientRect();
      tip.style.left = `${b.left - box.left + b.width / 2}px`;
      tip.style.top = `${y / H * box.height}px`;
    };
    g.addEventListener('pointerenter', show);
    g.addEventListener('focus', show);
    g.addEventListener('pointerleave', () => { tip.hidden = true; });
    g.addEventListener('blur', () => { tip.hidden = true; });
  });
  $('#chart').replaceChildren(svg, tip);
  $('#chart').removeAttribute('aria-busy');
  $('#chart-table tbody').replaceChildren(...VALUES.map((v, i) => {
    const tr = el('tr');
    tr.append(el('td', null, DAYS[i]), el('td', null, String(v)));
    return tr;
  }));
}
const tableBtn = $('[aria-controls="chart-table"]');
tableBtn.addEventListener('click', () => {
  const open = tableBtn.getAttribute('aria-expanded') !== 'true';
  tableBtn.setAttribute('aria-expanded', String(open));
  tableBtn.textContent = open ? 'Hide Data' : 'Show Data';
  $('#chart-table').hidden = !open;
});

function renderActivity() {
  const list = $('#activity');
  list.replaceChildren(...['Placeholder event one', 'Placeholder event two', 'Placeholder event three'].map((t, i) => {
    const li = el('li', 'row');
    const text = el('span', 'row-text');
    text.append(el('span', 'row-title', t), el('span', 'row-sub', `${i + 1} hour${i ? 's' : ''} ago`));
    li.append(text);
    return li;
  }));
  list.removeAttribute('aria-busy');
}

/* Placeholder for a real fetch: the screen shows at once and each part
   fills in when its data arrives, instead of a blank page. */
setTimeout(renderChart, 500);
setTimeout(renderActivity, 900);

/* ---------------- navigation: the hash is the screen ---------------- */
/* Screen ids are "screen-<name>", not "<name>", so the browser does not
   treat the hash as an anchor and scroll or move focus on its own. */
const SCREENS = ['overview', 'items', 'settings', 'search'];
const screen = (name) => $(`#screen-${name}`);
function show(name, { focus }) {
  if (!SCREENS.includes(name)) name = 'overview';
  for (const s of SCREENS) screen(s).hidden = s !== name;
  for (const a of $$('[data-tab]')) {
    if (a.dataset.tab === name) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  const title = $('h1', screen(name)).textContent;
  document.title = `${title} · Home`;
  store.set('home.tab', name);
  closeMenu(false);
  window.scrollTo(0, 0);
  if (focus) (name === 'search' ? q : $('h1', screen(name))).focus({ preventScroll: true });
}
window.addEventListener('hashchange', () => show(location.hash.slice(1), { focus: true }));

/* Launch straight into content, restoring the last screen. */
const initial = location.hash.slice(1) || store.get('home.tab', 'overview');
if (!location.hash) history.replaceState(null, '', `#${SCREENS.includes(initial) ? initial : 'overview'}`);
renderItems();
renderRecents();
/* Only the search screen takes focus on launch: its job is typing. */
show(initial, { focus: initial === 'search' });
