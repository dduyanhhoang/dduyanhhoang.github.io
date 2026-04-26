import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Wraps children with a fade+slide entrance animation on every route change.
 * Internal link clicks get a brief fade-out before navigation fires.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Intercept clicks on internal <a> elements so we can play exit animation
    const handler = e => {
      const anchor = e.target.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // Only internal routes that differ from the current path
      if (!href || !href.startsWith('/') || href === location.pathname) return;

      e.preventDefault();
      const el = document.getElementById('page-wrap');
      if (!el) { navigate(href); return; }

      el.classList.add('page-exit');
      setTimeout(() => navigate(href), 300);
    };

    document.addEventListener('click', handler, true); // capture phase
    return () => document.removeEventListener('click', handler, true);
  }, [location.pathname, navigate]);

  return (
    <div id="page-wrap" key={location.pathname} className="page-enter">
      {children}
    </div>
  );
}
