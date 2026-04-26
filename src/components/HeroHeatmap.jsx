import { useEffect, useState } from 'react';

const RELEVANT = new Set(['PushEvent', 'CreateEvent', 'PullRequestEvent', 'ReleaseEvent', 'ForkEvent']);

function getWeeks() {
  return window.matchMedia('(max-width: 640px)').matches ? 16 : 26;
}

// ── Heatmap builder ───────────────────────────────────────────────────────────

function buildHeatmap(data, weeks) {
  const lookup   = {};
  let   total    = 0;
  data.forEach(({ date, count }) => { lookup[date] = count; total += count; });
  const maxCount = Math.max(1, ...data.map(c => c.count));

  const today = new Date();
  const end   = new Date(today);
  end.setDate(today.getDate() + (6 - today.getDay())); // this Saturday
  const start = new Date(end);
  start.setDate(end.getDate() - weeks * 7 + 1);

  const days = [];
  const cur  = new Date(start);
  while (cur <= end) {
    const dateStr  = cur.toISOString().slice(0, 10);
    const count    = lookup[dateStr] ?? 0;
    const isFuture = cur > today;
    const level    = isFuture ? 'x'
      : count === 0                            ? 0
      : count <= Math.ceil(maxCount * 0.25)    ? 1
      : count <= Math.ceil(maxCount * 0.5)     ? 2
      : count <= Math.ceil(maxCount * 0.75)    ? 3 : 4;
    days.push({ date: dateStr, count, level });
    cur.setDate(cur.getDate() + 1);
  }
  return { days, total };
}

// ── Ticker builder ────────────────────────────────────────────────────────────

function parseEvent(event) {
  const repo = event.repo.name.replace(`${event.actor.login}/`, '');
  switch (event.type) {
    case 'PushEvent': {
      const msg = (event.payload.commits ?? [])[0]?.message?.split('\n')[0] ?? 'pushed changes';
      return { icon: '⬡', label: `pushed to ${repo}`, detail: msg };
    }
    case 'CreateEvent':
      return event.payload.ref_type === 'repository'
        ? { icon: '◈', label: `created ${repo}`,       detail: '' }
        : { icon: '⌥', label: `new branch in ${repo}`, detail: event.payload.ref ?? '' };
    case 'PullRequestEvent':
      return { icon: '◎', label: `PR in ${repo}`, detail: event.payload.pull_request?.title ?? '' };
    case 'ReleaseEvent':
      return { icon: '◇', label: `released in ${repo}`, detail: event.payload.release?.tag_name ?? '' };
    case 'ForkEvent':
      return { icon: '⑂', label: `forked ${repo}`, detail: '' };
    default: return null;
  }
}

function buildTicker(events) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 3);
  const items = [];
  for (const e of events) {
    if (new Date(e.created_at) < cutoff) break; // events are newest-first
    if (!RELEVANT.has(e.type)) continue;
    const parsed = parseEvent(e);
    if (parsed) items.push({ ...parsed, id: e.id });
  }
  return items;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroHeatmap() {
  const [heatmap, setHeatmap] = useState({ days: [], total: 0 });
  const [ticker,  setTicker]  = useState([]);
  const [weeks,   setWeeks]   = useState(26);

  useEffect(() => {
    const w = getWeeks();
    setWeeks(w);

    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = () => setWeeks(getWeeks());
    mq.addEventListener('change', onChange);

    fetch('/github-contributions.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (data.length) setHeatmap(buildHeatmap(data, w)); })
      .catch(() => {});

    fetch('/github-activity.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => setTicker(buildTicker(data)))
      .catch(() => {});

    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Rebuild heatmap when weeks changes (e.g. resize)
  useEffect(() => {
    if (!heatmap.days.length) return;
    fetch('/github-contributions.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (data.length) setHeatmap(buildHeatmap(data, weeks)); })
      .catch(() => {});
  }, [weeks]);

  if (!heatmap.total) return null;

  const doubled = [...ticker, ...ticker];

  return (
    <div className="hero-activity">
      {/* Heatmap */}
      <div className="hero-heatmap-col">
        <div className="hero-heatmap-grid" aria-hidden="true">
          {heatmap.days.map(({ date, count, level }) => (
            <div
              key={date}
              className="hero-heatmap-cell"
              data-level={level}
              title={level !== 'x' && count ? `${date} — ${count}` : undefined}
            />
          ))}
        </div>
        <span className="hero-heatmap-label">
          {heatmap.total.toLocaleString()} contributions this year
        </span>
      </div>

      {/* Ticker */}
      {ticker.length > 0 && (
        <div className="hero-ticker-col" aria-label="Recent activity">
          <ul className="hero-ticker-track" style={{ '--count': ticker.length }}>
            {doubled.map(({ icon, label, detail }, i) => (
              <li className="hero-ticker-item" key={i} aria-hidden={i >= ticker.length}>
                <span className="hero-ticker-icon" aria-hidden="true">{icon}</span>
                <span className="hero-ticker-label">{label}</span>
                {detail && <span className="hero-ticker-detail">{detail}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
