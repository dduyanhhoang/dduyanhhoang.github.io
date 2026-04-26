import { useEffect, useMemo, useRef, useState } from 'react';

const RELEVANT = new Set(['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent', 'ForkEvent']);
const DOW      = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// contributions = [{date: "2026-04-01", count: 3}, ...]  from GraphQL
function buildCalendar(contributions) {
  const now      = new Date();
  const year     = now.getFullYear();
  const month    = now.getMonth();
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;

  const counts = {};
  contributions.forEach(({ date, count }) => {
    if (date.startsWith(monthStr)) {
      const day = parseInt(date.slice(8, 10), 10);
      counts[day] = count;
    }
  });

  return {
    label:       now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    firstDow:    new Date(year, month, 1).getDay(),
    daysInMonth: new Date(year, month + 1, 0).getDate(),
    today:       now.getDate(),
    counts,
  };
}

function parseEvent(event) {
  const repo = event.repo.name.replace(`${event.actor.login}/`, '');
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload.commits ?? [];
      const msg     = commits[0]?.message?.split('\n')[0] ?? 'pushed changes';
      return { icon: <IconCommit />, label: `pushed to ${repo}`, detail: msg };
    }
    case 'CreateEvent':
      return event.payload.ref_type === 'repository'
        ? { icon: <IconRepo />,   label: `created ${repo}`,          detail: '' }
        : { icon: <IconBranch />, label: `new branch in ${repo}`,    detail: event.payload.ref ?? '' };
    case 'PullRequestEvent':
      return { icon: <IconPR />,   label: `${event.payload.action} PR in ${repo}`, detail: event.payload.pull_request?.title ?? '' };
    case 'ReleaseEvent':
      return { icon: <IconTag />,  label: `released in ${repo}`,     detail: event.payload.release?.tag_name ?? '' };
    case 'ForkEvent':
      return { icon: <IconFork />, label: `forked ${repo}`,          detail: '' };
    default:
      return null;
  }
}

function buildTicker(events) {
  const items = [];
  for (const e of events) {
    if (!RELEVANT.has(e.type)) continue;
    const parsed = parseEvent(e);
    if (parsed) items.push({ ...parsed, date: e.created_at, id: e.id });
    if (items.length >= 12) break;
  }
  return items;
}

// ── Calendar heatmap ─────────────────────────────────────────────────────────

function Calendar({ data }) {
  const { label, firstDow, daysInMonth, today, counts } = data;
  const maxCount = Math.max(1, ...Object.values(counts));

  return (
    <div className="cal-wrap">
      <div className="cal-header">{label}</div>

      <div className="cal-grid">
        {DOW.map(d => <div key={d} className="cal-dow">{d}</div>)}

        {/* Empty cells before month start */}
        {Array.from({ length: firstDow }, (_, i) => (
          <div key={`empty-${i}`} className="cal-empty" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day   = i + 1;
          const count = counts[day] || 0;
          const level = count === 0 ? 0
            : count <= Math.ceil(maxCount * 0.25) ? 1
            : count <= Math.ceil(maxCount * 0.5)  ? 2
            : count <= Math.ceil(maxCount * 0.75) ? 3 : 4;
          const isToday = day === today;

          return (
            <div
              key={day}
              className={`cal-day${isToday ? ' cal-today' : ''}`}
              data-level={level}
              title={`${label.split(' ')[0]} ${day}${count ? ` — ${count} event${count !== 1 ? 's' : ''}` : ''}`}
            >
              <span className="cal-num">{day}</span>
              {count > 0 && <span className="cal-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Vertical ticker ───────────────────────────────────────────────────────────

function Ticker({ items }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className="gh-ticker-wrap">
      <ul
        className="gh-ticker-track"
        style={{ '--count': items.length }}
      >
        {doubled.map(({ icon, label, detail, date }, i) => (
          <li className="gh-ticker-item" key={i} aria-hidden={i >= items.length}>
            <span className="gh-ticker-icon" aria-hidden="true">{icon}</span>
            <div className="gh-ticker-body">
              <span className="gh-ticker-label">{label}</span>
              {detail && <span className="gh-ticker-detail">{detail}</span>}
            </div>
            <time className="gh-ticker-time">{formatDate(date)}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function GitHubActivity() {
  const [events,        setEvents]        = useState([]);
  const [contributions, setContributions] = useState([]);
  const [status,        setStatus]        = useState('loading');
  const sectionRef = useRef(null);

  useEffect(() => {
    Promise.all([
      fetch('/github-activity.json').then(r => r.ok ? r.json() : []),
      fetch('/github-contributions.json').then(r => r.ok ? r.json() : []),
    ])
      .then(([evts, contribs]) => {
        setEvents(evts);
        setContributions(contribs);
        setStatus(evts.length || contribs.length ? 'ok' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    if (!sectionRef.current || status === 'loading') return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.05 }
    );
    sectionRef.current.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [status]);

  const calData     = useMemo(() => buildCalendar(contributions), [contributions]);
  const tickerItems = useMemo(() => buildTicker(events),          [events]);

  return (
    <section id="activity" aria-labelledby="activity-heading">
      <div className="section-inner" ref={sectionRef}>
        <div className="label reveal">GitHub</div>
        <h2 className="section-title reveal reveal-d1" id="activity-heading">
          This Month
        </h2>

        {status === 'loading' && (
          <div className="gh-skeleton-wrap reveal reveal-d2">
            {[...Array(3)].map((_, i) => <div className="gh-skeleton" key={i} />)}
          </div>
        )}

        {(status === 'error' || status === 'empty') && (
          <p className="gh-empty reveal reveal-d2">No activity data yet.</p>
        )}

        {status === 'ok' && (
          <div className="gh-layout reveal reveal-d2">
            <Calendar data={calData} />
            <Ticker   items={tickerItems} />
          </div>
        )}
      </div>
    </section>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconCommit() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>;
}
function IconRepo() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
}
function IconBranch() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>;
}
function IconPR() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>;
}
function IconTag() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}
function IconFork() {
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 01-2 2H8a2 2 0 01-2-2V9"/><line x1="12" y1="12" x2="12" y2="15"/></svg>;
}
