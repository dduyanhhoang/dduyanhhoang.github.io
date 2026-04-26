import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const threshold = isHome ? 400 : 80;
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const visible = scrolled;

  return (
    <button
      className={`scroll-top-btn${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  );
}
