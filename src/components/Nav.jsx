import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { href: '#about',            label: 'About' },
  { href: '#research',         label: 'Research' },
  { href: '#skills',           label: 'Skills' },
  { href: '#acknowledgements', label: 'Thanks' },
];

export default function Nav() {
  const [open,    setOpen]    = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active,  setActive]  = useState('');
  const location = useLocation();
  const isHome   = location.pathname === '/';

  const close = () => setOpen(false);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Solidify nav background after scrolling past hero
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section tracking — only on the landing page
  useEffect(() => {
    if (!isHome) { setActive(''); return; }

    const ids = LINKS.map(l => l.href.slice(1));
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, {
      // Section is "active" when its top edge is between the nav bar and
      // halfway down the viewport
      rootMargin: '-70px 0px -55% 0px',
      threshold:  0,
    });

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [isHome]);

  return (
    <>
      {/* Mobile fullscreen overlay — home only */}
      {isHome && (
        <div className={`nav-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
          <ul role="list">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={active === href.slice(1) ? 'active' : ''} onClick={close}>
                  {label}
                </a>
              </li>
            ))}
            <li><Link to="/resume" className="nav-resume" onClick={close}>Resume</Link></li>
            <li><Link to="/links" className="nav-resume nav-links" onClick={close}>Links</Link></li>
          </ul>
        </div>
      )}

      {/* Fixed nav bar */}
      <nav className={`site-nav${scrolled ? ' nav-scrolled' : ''}`}>
        <Link
          to="/"
          className="nav-logo"
          onClick={() => { close(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          Duy Anh
        </Link>

        {/* Hamburger — home only, no links to show on other pages */}
        {isHome && (
          <button
            className={`hamburger${open ? ' is-open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        )}

        <ul className="nav-menu" role="list">
          {isHome && LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={active === href.slice(1) ? 'active' : ''}>
                {label}
              </a>
            </li>
          ))}
          {isHome && <li><Link to="/resume" className="nav-resume">Resume</Link></li>}
          {isHome && <li><Link to="/links" className="nav-resume nav-links">Links</Link></li>}
        </ul>
      </nav>
    </>
  );
}
