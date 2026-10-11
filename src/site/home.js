/* /home: content-website behaviour. The page works without this file;
   JS only adds the filter, the current-section marker, the back-to-top
   button and the placeholder play control. */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------------- project filter; the URL keeps the state ------------- */
const buttons = $$('.filter button');
const cards = $$('#cards .card');
function applyFilter(name, { updateUrl }) {
  if (!buttons.some((b) => b.dataset.filter === name)) name = 'all';
  for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.filter === name));
  let shown = 0;
  for (const c of cards) {
    const match = name === 'all' || c.dataset.tags.split(' ').includes(name);
    c.hidden = !match;
    if (match) shown++;
  }
  $('#filter-status').textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
  if (updateUrl) {
    const url = new URL(location.href);
    if (name === 'all') url.searchParams.delete('filter');
    else url.searchParams.set('filter', name);
    history.replaceState(null, '', url);
  }
}
for (const b of buttons) b.addEventListener('click', () => applyFilter(b.dataset.filter, { updateUrl: true }));
applyFilter(new URLSearchParams(location.search).get('filter') ?? 'all', { updateUrl: false });

/* ---------------- current section in the nav ---------------- */
const navLinks = $$('.topnav nav a');
const sections = navLinks.map((a) => document.getElementById(a.hash.slice(1)));
const visible = new Map();
/* A section counts as current while it crosses a band around 40% down
   the viewport. The case study belongs to Work. */
const owner = (id) => (id === 'project-one' ? 'work' : id);
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) visible.set(e.target.id, e.isIntersecting);
  const hit = [...visible].find(([, on]) => on)?.[0];
  const current = hit && owner(hit);
  for (const a of navLinks) {
    if (a.hash.slice(1) === current) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
}, { rootMargin: '-40% 0px -55% 0px' });
for (const s of [...sections, $('#project-one')]) spy.observe(s);

/* ---------------- back to top, once the hero is out of view ---------- */
const toTop = $('.to-top');
new IntersectionObserver(([e]) => { toTop.hidden = e.isIntersecting; }).observe($('.hero'));

/* ---------------- placeholder media control ---------------- */
for (const btn of $$('.media-control')) {
  btn.addEventListener('click', () => {
    const playing = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause Demo' : 'Play Demo');
  });
}
