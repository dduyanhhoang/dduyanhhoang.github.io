import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { href: '/about',    label: 'About' },
  { href: '/research', label: 'Research' },
  { href: '/projects',   label: 'Projects' },
  { href: '/resume',   label: 'Resume' },
];

export default function Nav() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Mobile fullscreen overlay */}
      <div className={`nav-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
        <ul role="list">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                to={href}
                className={location.pathname === href ? 'active' : ''}
                onClick={close}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Fixed nav bar */}
      <nav className={`site-nav${scrolled ? ' nav-scrolled' : ''}`}>
        <Link
          to="/"
          className="nav-logo"
          onClick={() => { close(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          Duy Anh
        </Link>

        <button
          className={`hamburger${open ? ' is-open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

        <ul className="nav-menu" role="list">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                to={href}
                className={location.pathname === href ? 'active' : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
