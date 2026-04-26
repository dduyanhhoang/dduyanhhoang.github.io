import { useEffect, useRef, useState } from 'react';

const RELEVANT = new Set(['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent', 'ForkEvent']);

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        ? { icon: <IconRepo />,   label: `created ${repo}`,       detail: '' }
        : { icon: <IconBranch />, label: `new branch in ${repo}`, detail: event.payload.ref ?? '' };
    case 'PullRequestEvent':
      return { icon: <IconPR />,  label: `${event.payload.action} PR in ${repo}`, detail: event.payload.pull_request?.title ?? '' };
    case 'ReleaseEvent':
      return { icon: <IconTag />, label: `released in ${repo}`,   detail: event.payload.release?.tag_name ?? '' };
    case 'ForkEvent':
      return { icon: <IconFork />,label: `forked ${repo}`,        detail: '' };
    default: return null;
  }
}

function buildTicker(events) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 3); // last 3 days only

  const items = [];
  for (const e of events) {
    if (new Date(e.created_at) < cutoff) continue;
    if (!RELEVANT.has(e.type)) continue;
    const parsed = parseEvent(e);
    if (parsed) items.push({ ...parsed, date: e.created_at, id: e.id });
  }
  return items;
}

// ── Ticker ────────────────────────────────────────────────────────────────────

function Ticker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="gh-ticker-wrap">
      <ul className="gh-ticker-track" style={{ '--count': items.length }}>
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
  const [items,  setItems]  = useState([]);
  const [status, setStatus] = useState('loading');
  const sectionRef = useRef(null);

  useEffect(() => {
    fetch('/github-activity.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const ticker = buildTicker(data);
        setItems(ticker);
        setStatus(ticker.length ? 'ok' : 'empty');
      })
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

  if (status === 'empty' || status === 'error') return null;

  return (
    <section id="activity" aria-labelledby="activity-heading">
      <div className="section-inner" ref={sectionRef}>
        <div className="label reveal">GitHub</div>
        <h2 className="section-title reveal reveal-d1" id="activity-heading">
          Last 3 Days
        </h2>

        {status === 'loading' && (
          <div className="gh-skeleton-wrap reveal reveal-d2">
            {[...Array(3)].map((_, i) => <div className="gh-skeleton" key={i} />)}
          </div>
        )}

        {status === 'ok' && (
          <div className="reveal reveal-d2">
            <Ticker items={items} />
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
