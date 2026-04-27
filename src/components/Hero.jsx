import { useEffect, useRef } from 'react';
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

        <HeroHeatmap />
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        Scroll
      </div>
    </section>
  );
}
