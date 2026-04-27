import { Link } from 'react-router-dom';
import '../styles/links.css';
import ParticleNet     from '../components/ParticleNet.jsx';
import FloatingSymbols from '../components/FloatingSymbols.jsx';
import Footer          from '../components/Footer.jsx';

const MAIN_LINKS = [
  {
    key: 'portfolio',
    href: '/',
    label: 'Portfolio',
    internal: true,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    key: 'resume',
    href: '/resume',
    label: 'Resume',
    internal: true,
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    key: 'email',
    href: 'mailto:dduyanhhoang@gmail.com',
    label: 'Email',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    key: 'github',
    href: 'https://github.com/dduyanhhoang',
    label: 'GitHub',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

const SOCIAL_LINKS = [
  {
    key: 'linkedin',
    href: 'https://www.linkedin.com/in/dduyanhhoang/',
    label: 'LinkedIn',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    href: 'https://www.youtube.com/@dduyanhhoang',
    label: 'YouTube',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    href: 'https://www.instagram.com/dduyanhhoang',
    label: 'Instagram',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    href: 'https://www.facebook.com/dduyanhhoang/',
    label: 'Facebook',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const ARROW = (
  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default function Links() {
  return (
    <>
      <ParticleNet />
      <FloatingSymbols />
      <div className="bg-layer" aria-hidden="true">
        <div className="blob blob-a" />
        <div className="blob blob-b" />
        <div className="blob blob-c" />
      </div>
      <div className="dot-grid" aria-hidden="true" />

    <main className="links-page">
      <div className="links-card">
        {/* Avatar */}
        <div className="links-avatar-wrap">
          <img
            src="https://github.com/dduyanhhoang.png"
            alt="Hoang Dinh Duy Anh"
            className="links-avatar"
            width={96}
            height={96}
          />
          <span className="links-status-dot" aria-label="Available" />
        </div>

        {/* Identity */}
        <h1 className="links-name">Hoang Dinh Duy Anh</h1>
        <p className="links-title">AI Student · Quantum ML Researcher</p>
        <p className="links-location">
          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22s-8-5.5-8-11a8 8 0 0116 0c0 5.5-8 11-8 11z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
          Hanoi, Vietnam
        </p>

        <div className="links-badge">
          <span className="badge-dot" aria-hidden="true" />
          Open to Research &amp; Internships
        </div>

        {/* Links */}
        <nav className="links-list" aria-label="Profile links">
          {[...MAIN_LINKS, null, ...SOCIAL_LINKS].map((item, i) => {
            if (!item) return <div key={`divider-${i}`} className="links-divider" />;
            const { key, href, label, internal, icon } = item;
            const inner = (
              <>
                <span className="links-btn-icon">{icon}</span>
                <span className="links-btn-label">{label}</span>
                <span className="links-btn-arrow">{ARROW}</span>
              </>
            );
            return internal
              ? <Link key={key} to={href} className={`links-btn ${key}`}>{inner}</Link>
              : <a key={key} href={href} className={`links-btn ${key}`} target="_blank" rel="noopener noreferrer">{inner}</a>;
          })}
        </nav>

      </div>
    </main>
    <Footer />
    </>
  );
}
