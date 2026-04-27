import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const revealObs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    // Mirror Nav's active-section logic to glow only the navbar-active heading
    const ids = ['about', 'research', 'skills', 'explore'];
    const glowObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        const title = e.target.querySelector('.section-title');
        if (title) title.classList.toggle('glow', e.isIntersecting);
      }),
      { rootMargin: '-70px 0px -55% 0px', threshold: 0 }
    );
    ids.map(id => document.getElementById(id)).filter(Boolean)
       .forEach(el => glowObs.observe(el));

    return () => { revealObs.disconnect(); glowObs.disconnect(); };
  }, []);
}
