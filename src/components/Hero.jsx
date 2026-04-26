import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroHeatmap from './HeroHeatmap.jsx';

// Edit these to change the cycling typewriter text
const PHRASES = [
  'Quantum ML models.',
  'AI research tools.',
  'data-driven insights.',
  'things that matter.',
];

export default function Hero() {
  const typedRef = useRef(null);

  useEffect(() => {
    let pi = 0, ci = 0, deleting = false;
    let timer;

    function tick() {
      const el = typedRef.current;
      if (!el) return;
      const phrase = PHRASES[pi];
      if (!deleting) {
        el.textContent = phrase.slice(0, ++ci);
        if (ci === phrase.length) { deleting = true; timer = setTimeout(tick, 2000); return; }
      } else {
        el.textContent = phrase.slice(0, --ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % PHRASES.length; }
      }
      timer = setTimeout(tick, deleting ? 38 : 68);
    }

    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero">
      <div className="hero-inner">
        <div className="hero-badge">
          <span className="badge-dot" aria-hidden="true" />
          Open to Research &amp; Internship Opportunities
        </div>

        <h1 className="hero-name">Hoang Dinh<br />Duy Anh</h1>

        <p className="hero-role">
          I build <span className="typed-word" ref={typedRef} /><span className="caret" aria-hidden="true" />
        </p>

        <p className="hero-desc">
          Curious about hard problems at the edge of mathematics and computation — and driven to turn that curiosity into research that matters.
        </p>

        <div className="hero-cta">
          <Link to="/resume" className="btn btn-primary">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            View Resume
          </Link>
          <a href="mailto:dduyanhhoang@gmail.com" className="btn btn-ghost">
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
            Get in Touch
          </a>
        </div>

        <HeroHeatmap />
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        Scroll
      </div>
    </section>
  );
}
