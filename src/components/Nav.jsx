import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav>
      <Link to="/" className="nav-logo" onClick={close}>Duy Anh</Link>

      <button
        className="hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-menu${open ? ' open' : ''}`} role="list">
        <li><a href="#about"           onClick={close}>About</a></li>
        <li><a href="#research"        onClick={close}>Research</a></li>
        <li><a href="#skills"          onClick={close}>Skills</a></li>
        <li><a href="#acknowledgements" onClick={close}>Thanks</a></li>
        <li><Link to="/resume" className="nav-resume" onClick={close}>Resume</Link></li>
      </ul>
    </nav>
  );
}
