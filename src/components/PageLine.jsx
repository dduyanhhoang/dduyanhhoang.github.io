import { useEffect, useRef, useState } from 'react';

const CORNER_R = 60; // larger = more rounded corners

// ── Path helpers ──────────────────────────────────────────────────────────────

function buildRoundedPath(pts, r) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p  = pts[i - 1];
    const c  = pts[i];
    const n  = pts[i + 1];
    const d1 = Math.hypot(c.x - p.x, c.y - p.y);
    const d2 = Math.hypot(n.x - c.x, n.y - c.y);
    if (!d1 || !d2) { d += ` L ${c.x} ${c.y}`; continue; }
    const cr  = Math.min(r, d1 / 2, d2 / 2);
    const b1x = c.x - (c.x - p.x) / d1 * cr;
    const b1y = c.y - (c.y - p.y) / d1 * cr;
    const b2x = c.x + (n.x - c.x) / d2 * cr;
    const b2y = c.y + (n.y - c.y) / d2 * cr;
    d += ` L ${b1x} ${b1y} Q ${c.x} ${c.y} ${b2x} ${b2y}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  return d;
}

function buildWaypoints(boxes, L, R, startX, startY) {
  const pts = [
    { x: startX, y: startY },
    { x: startX, y: boxes[0].t },
    { x: L,      y: boxes[0].t },
  ];
  boxes.forEach((box, i) => {
    if (i % 2 === 0) {
      pts.push({ x: L, y: box.b }, { x: R, y: box.b });
    } else {
      pts.push({ x: R, y: box.b }, { x: L, y: box.b });
    }
  });
  return pts;
}

// Binary search: find the path parameter t where path.y ≈ targetY.
// The path is mostly monotonically increasing in Y (down + sideways, never up),
// so this converges reliably.
function findTAtY(path, len, targetY) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (path.getPointAtLength(len * mid).y < targetY) lo = mid;
    else hi = mid;
  }
  return Math.max(0, Math.min(1, (lo + hi) / 2));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PageLine() {
  const revealRef = useRef(null);
  const haloRef   = useRef(null);
  const dotRef    = useRef(null);
  const lenRef    = useRef(0);
  const cur       = useRef(0);
  const tgt       = useRef(0);
  const vel       = useRef(0);
  const rafRef    = useRef(null);

  const [path, setPath] = useState(null);

  // ── Measure & build ───────────────────────────────────────────────────────

  const build = () => {
    const sections = Array.from(
      document.querySelectorAll('.content-sections .section-inner')
    );
    if (!sections.length) return;

    const vw  = window.innerWidth;
    const ph  = document.documentElement.scrollHeight;
    const boxes = sections.map(el => {
      const r = el.getBoundingClientRect();
      return { l: r.left, r: r.right, t: r.top + window.scrollY, b: r.bottom + window.scrollY };
    });

    const L      = boxes[0].l;
    const R      = boxes[0].r;
    const hero   = document.querySelector('#hero');
    const hr     = hero?.getBoundingClientRect();
    const startY = hr ? hr.bottom + window.scrollY - 10 : boxes[0].t;

    const waypoints = buildWaypoints(boxes, L, R, vw / 2, startY);
    setPath({ d: buildRoundedPath(waypoints, CORNER_R), w: vw, h: ph });
  };

  useEffect(() => {
    const t = setTimeout(build, 250);
    window.addEventListener('resize', build);
    window.addEventListener('load', build);

    // Rebuild if content height changes (images, fonts finish loading)
    const ro = new ResizeObserver(build);
    ro.observe(document.body);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', build);
      window.removeEventListener('load', build);
      ro.disconnect();
    };
  }, []);

  // ── Animation ────────────────────────────────────────────────────────────

  useEffect(() => {
    const reveal = revealRef.current;
    if (!reveal || !path) return;

    const len = reveal.getTotalLength();
    lenRef.current = len;
    reveal.style.strokeDasharray  = len;
    reveal.style.strokeDashoffset = len;

    // Track the point on the path whose Y is at the screen's vertical center
    const syncTarget = () => {
      const screenCenterY = window.scrollY + window.innerHeight * 0.5;
      tgt.current = findTAtY(reveal, len, screenCenterY);
    };
    syncTarget();

    const tick = () => {
      // Very slow spring
      vel.current += (tgt.current - cur.current) * 0.008;
      vel.current *= 0.92;
      cur.current  = Math.max(0, Math.min(1, cur.current + vel.current));

      reveal.style.strokeDashoffset = len * (1 - cur.current);

      const pt = reveal.getPointAtLength(len * cur.current);
      haloRef.current?.setAttribute('cx', pt.x);
      haloRef.current?.setAttribute('cy', pt.y);
      dotRef.current?.setAttribute('cx', pt.x);
      dotRef.current?.setAttribute('cy', pt.y);

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', syncTarget, { passive: true });
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', syncTarget);
      cancelAnimationFrame(rafRef.current);
    };
  }, [path]);

  if (!path) return null;

  return (
    <svg
      className="page-line-svg"
      viewBox={`0 0 ${path.w} ${path.h}`}
      style={{ height: path.h }}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="pl-glow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="pl-halo">
          <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0"    />
        </radialGradient>
      </defs>

      <path d={path.d} fill="none" stroke="rgba(129,140,248,0.07)"
            strokeWidth="1.5" strokeLinejoin="round" />

      <path ref={revealRef} d={path.d} fill="none" stroke="rgba(129,140,248,0.45)"
            strokeWidth="1.5" strokeLinejoin="round" />

      <circle ref={haloRef} cx="0" cy="0" r="12" fill="url(#pl-halo)" />
      <circle ref={dotRef}  cx="0" cy="0" r="2.5" fill="white"
              opacity="0.92" filter="url(#pl-glow)" />
    </svg>
  );
}
