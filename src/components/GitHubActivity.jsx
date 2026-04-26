import { useEffect, useMemo, useRef, useState } from 'react';

const RELEVANT = new Set(['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent', 'ForkEvent']);
const WEEKS    = 14; // columns in heatmap

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildHeatmap(events) {
  const counts = {};
  events.forEach(e => {
    const day = e.created_at.slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  });

  // Build grid starting from the Sunday WEEKS weeks ago
  const today    = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - today.getDay() - (WEEKS - 1) * 7);

  const days = [];
  for (let i = 0; i < WEEKS * 7; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    const key   = d.toISOString().slice(0, 10);
    const count = counts[key] || 0;
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 7 ? 3 : 4;
    days.push({ key, count, level, month: d.getMonth(), date: d.getDate(), dow: d.getDay() });
  }
  return days;
}

function parseEvent(event) {
  const repo = event.repo.name.replace(`${event.actor.login}/`, '');
  switch (event.type) {
    case 'PushEvent': {
      const commits = event.payload.commits ?? [];
      const count   = commits.length || 1;
      const msg     = commits[0]?.message?.split('\n')[0] ?? 'pushed changes';
      return { icon: <IconCommit />, label: `pushed to ${repo}`, detail: msg };
    }
    case 'CreateEvent':
      return event.payload.ref_type === 'repository'
        ? { icon: <IconRepo />,    label: `created ${repo}`,               detail: event.payload.description ?? '' }
        : { icon: <IconBranch />,  label: `new branch in ${repo}`,         detail: event.payload.ref ?? '' };
    case 'PullRequestEvent':
      return { icon: <IconPR />,   label: `${event.payload.action} PR in ${repo}`, detail: event.payload.pull_request?.title ?? '' };
    case 'ReleaseEvent':
      return { icon: <IconTag />,  label: `released ${event.payload.release?.tag_name ?? ''} in ${repo}`, detail: '' };
    case 'ForkEvent':
      return { icon: <IconFork />, label: `forked ${repo}`,                detail: '' };
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

// ── Sub-components ────────────────────────────────────────────────────────────

function Heatmap({ days }) {
  // Month labels: detect when month changes across columns
  const months = [];
  for (let col = 0; col < WEEKS; col++) {
    const firstDay = days[col * 7];
    if (!firstDay) continue;
    const prev = col > 0 ? days[(col - 1) * 7] : null;
    if (!prev || prev.month !== firstDay.month) {
      months.push({ col, label: new Date(firstDay.key).toLocaleDateString('en-US', { month: 'short' }) });
    }
  }

  const DOW_LABELS = ['', 'M', '', 'W', '', 'F', ''];

  return (
    <div className="gh-heatmap-wrap">
      {/* Month labels */}
      <div className="gh-months" style={{ gridTemplateColumns: `14px repeat(${WEEKS}, 1fr)` }}>
        <span />
        {Array.from({ length: WEEKS }, (_, col) => {
          const m = months.find(m => m.col === col);
          return <span key={col} className="gh-month-label">{m ? m.label : ''}</span>;
        })}
      </div>

      <div className="gh-heatmap-inner">
        {/* Day-of-week labels */}
        <div className="gh-dow">
          {DOW_LABELS.map((l, i) => <span key={i}>{l}</span>)}
        </div>

        {/* Grid */}
        <div className="gh-grid">
          {days.map(({ key, count, level }) => (
            <div
              key={key}
              className="gh-day"
              data-level={level}
              title={`${key}${count ? ` — ${count} event${count !== 1 ? 's' : ''}` : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Ticker({ items }) {
  if (!items.length) return null;
  const doubled = [...items, ...items];

  return (
    <div className="gh-ticker-wrap">
      <ul
        className="gh-ticker-track"
        style={{ '--count': items.length }}
        aria-label="Recent GitHub events"
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

// ── Main component ────────────────────────────────────────────────────────────

export default function GitHubActivity() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch('/github-activity.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setEvents(data); setStatus(data.length ? 'ok' : 'empty'); })
      .catch(() => setStatus('error'));
  }, []);

  // Observe async-rendered reveals
  useEffect(() => {
    if (!sectionRef.current || status === 'loading') return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.05 }
    );
    sectionRef.current.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [status]);

  const heatmapDays = useMemo(() => buildHeatmap(events), [events]);
  const tickerItems = useMemo(() => buildTicker(events),  [events]);

  return (
    <section id="activity" aria-labelledby="activity-heading">
      <div className="section-inner" ref={sectionRef}>
        <div className="label reveal">GitHub</div>
        <h2 className="section-title reveal reveal-d1" id="activity-heading">Recent Activity</h2>

        {status === 'loading' && (
          <div className="gh-skeleton-wrap reveal reveal-d2">
            {[...Array(3)].map((_, i) => <div className="gh-skeleton" key={i} />)}
          </div>
        )}

        {(status === 'error' || status === 'empty') && (
          <p className="gh-empty reveal reveal-d2">No recent public activity yet.</p>
        )}

        {status === 'ok' && (
          <div className="gh-layout reveal reveal-d2">
            <Heatmap days={heatmapDays} />
            <Ticker items={tickerItems} />
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
  return <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v18H3z" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
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
