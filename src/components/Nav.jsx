import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LINKS = [
  { href: '#about',            label: 'About' },
  { href: '#research',         label: 'Research' },
  { href: '#skills',           label: 'Skills' },
  { href: '#acknowledgements', label: 'Thanks' },
  { href: '#activity',         label: 'Activity' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* ── Mobile fullscreen overlay ──────────────────────────────────────
          Rendered as a sibling of site-nav (not a child) so it gets its
          own global stacking context and sits above all page content.   */}
      <div className={`nav-overlay${open ? ' open' : ''}`} aria-hidden={!open}>
        <ul role="list">
          {LINKS.map(({ href, label }) => (
            <li key={href}><a href={href} onClick={close}>{label}</a></li>
          ))}
          <li>
            <Link to="/resume" className="nav-resume" onClick={close}>Resume</Link>
          </li>
        </ul>
      </div>

      {/* ── Fixed nav bar ─────────────────────────────────────────────── */}
      <nav className="site-nav">
        <Link to="/" className="nav-logo" onClick={close}>Duy Anh</Link>

        <button
          className={`hamburger${open ? ' is-open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

        {/* Desktop-only inline menu */}
        <ul className="nav-menu" role="list">
          {LINKS.map(({ href, label }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
          <li><Link to="/resume" className="nav-resume">Resume</Link></li>
        </ul>
      </nav>
    </>
  );
}
