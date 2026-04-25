import { useEffect } from 'react';

/**
 * Observes all .reveal elements and adds the .in class when they
 * enter the viewport, triggering their CSS fade-up transition.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
