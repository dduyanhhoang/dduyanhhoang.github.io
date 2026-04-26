import { useEffect, useRef, useState } from 'react';

// Event types worth showing on a portfolio
const RELEVANT = new Set(['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent']);

function formatDate(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function parseEvent(event) {
  const repo = event.repo.name.replace(`${event.actor.login}/`, '');

  switch (event.type) {
    case 'PushEvent': {
      const count   = event.payload.commits?.length ?? 0;
      const message = event.payload.commits?.[0]?.message?.split('\n')[0] ?? '';
      return {
        icon: <IconCommit />,
        action: `pushed ${count} commit${count !== 1 ? 's' : ''} to`,
        detail: message,
        repo,
      };
    }
    case 'CreateEvent':
      return event.payload.ref_type === 'repository'
        ? { icon: <IconRepo />, action: 'created repository', detail: '', repo }
        : { icon: <IconBranch />, action: `created branch`, detail: event.payload.ref, repo };
    case 'PullRequestEvent':
      return {
        icon: <IconPR />,
        action: `${event.payload.action} a pull request in`,
        detail: event.payload.pull_request?.title ?? '',
        repo,
      };
    case 'ReleaseEvent':
      return {
        icon: <IconTag />,
        action: 'released',
        detail: event.payload.release?.tag_name ?? '',
        repo,
      };
    default:
      return null;
  }
}

export default function GitHubActivity() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ok | empty | error
  const feedRef = useRef(null);

  useEffect(() => {
    fetch('/github-activity.json')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        const parsed = data
          .filter(e => RELEVANT.has(e.type))
          .slice(0, 6)
          .map(e => ({ ...parseEvent(e), date: e.created_at, id: e.id }))
          .filter(Boolean);
        setEvents(parsed);
        setStatus(parsed.length ? 'ok' : 'empty');
      })
      .catch(() => setStatus('error'));
  }, []);

  // Observe the feed after it renders — the global useScrollReveal runs
  // before the async fetch resolves, so feed items are never observed.
  useEffect(() => {
    if (!feedRef.current) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.05 }
    );
    feedRef.current.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [status]);

  return (
    <section id="activity" aria-labelledby="activity-heading">
      <div className="section-inner">
        <div className="label reveal">GitHub</div>
        <h2 className="section-title reveal reveal-d1" id="activity-heading">
          Recent Activity
        </h2>

        <div ref={feedRef}>
        {status === 'loading' && (
          <div className="gh-placeholder reveal reveal-d2">
            {[...Array(4)].map((_, i) => (
              <div className="gh-skeleton" key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <p className="gh-empty reveal reveal-d2">
            Activity feed unavailable — check back soon.
          </p>
        )}

        {status === 'empty' && (
          <p className="gh-empty reveal reveal-d2">No recent public activity yet.</p>
        )}

        {status === 'ok' && (
          <ul className="gh-feed reveal reveal-d2">
            {events.map(({ icon, action, detail, repo, date, id }) => (
              <li className="gh-item" key={id}>
                <span className="gh-icon" aria-hidden="true">{icon}</span>
                <div className="gh-body">
                  <p className="gh-text">
                    <span className="gh-action">{action} </span>
                    <a
                      className="gh-repo"
                      href={`https://github.com/dduyanhhoang/${repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo}
                    </a>
                    {detail && <span className="gh-detail"> — {detail}</span>}
                  </p>
                  <time className="gh-time" dateTime={date}>{formatDate(date)}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
        </div>
      </div>
    </section>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconCommit() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <line x1="3" y1="12" x2="9" y2="12"/>
      <line x1="15" y1="12" x2="21" y2="12"/>
    </svg>
  );
}
function IconRepo() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 3h18v18H3z" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  );
}
function IconBranch() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="6" y1="3" x2="6" y2="15"/>
      <circle cx="18" cy="6" r="3"/>
      <circle cx="6"  cy="18" r="3"/>
      <path d="M18 9a9 9 0 01-9 9"/>
    </svg>
  );
}
function IconPR() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="18" cy="18" r="3"/>
      <circle cx="6"  cy="6"  r="3"/>
      <path d="M13 6h3a2 2 0 012 2v7"/>
      <line x1="6" y1="9" x2="6" y2="21"/>
    </svg>
  );
}
function IconTag() {
  return (
    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}
