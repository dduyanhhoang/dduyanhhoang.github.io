import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Ordered page sequence for [ / ] navigation
const PAGE_SEQUENCE = ['/thanks', '/', '/about', '/research', '/projects', '/resume'];

// Sections per page for { / } navigation
const PAGE_SECTIONS = {
  '/':       ['hero', 'about', 'research', 'skills', 'explore'],
  '/thanks': ['acknowledgements'],
};

const PAGES = [
  { label: 'Home',         href: '/' },
  { label: 'About',        href: '/about' },
  { label: 'Research',     href: '/research' },
  { label: 'Projects',     href: '/projects' },
  { label: 'Resume',       href: '/resume' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Links',        href: '/links' },
  { label: 'Thanks',       href: '/thanks' },
  { label: 'Writings',     href: '/writings' },
];

const PAGE_KEYS = {
  '1': '/',
  '2': '/about',
  '3': '/research',
  '4': '/projects',
  '5': '/resume',
  '6': '/writings',
  '8': '/achievements',
  '9': '/links',
  '0': '/thanks',
};

function getCurrentSection(sections) {
  const navH = 80;
  let current = sections[0];
  for (const id of sections) {
    const el = document.getElementById(id);
    if (!el) continue;
    const { top, bottom } = el.getBoundingClientRect();
    // The section that straddles the navbar line is the active one.
    // Exactly one section satisfies this at any scroll position.
    if (top <= navH && bottom > navH) { current = id; break; }
  }
  return current;
}

export default function VimNav() {
  const [helpOpen,    setHelpOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIdx,   setSearchIdx]   = useState(0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const gPending      = useRef(false);
  const gTimer        = useRef(null);
  const searchInputRef = useRef(null);

  const filtered = PAGES.filter(p =>
    p.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
      setSearchIdx(0);
    }
  }, [searchOpen]);

  // Reset selection when query changes
  useEffect(() => { setSearchIdx(0); }, [searchQuery]);

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); };

  const confirmSearch = (idx) => {
    const target = filtered[idx ?? searchIdx];
    if (target) { navigate(target.href); closeSearch(); }
  };

  useEffect(() => {
    const handler = (e) => {
      // Let search input handle its own keys
      if (searchOpen) return;

      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (e.metaKey || e.altKey) return;

      const { key, ctrlKey } = e;

      // Scroll
      if (key === 'j' && !ctrlKey) {
        e.preventDefault();
        window.scrollBy({ top: 220, behavior: 'smooth' });
      } else if (key === 'k' && !ctrlKey) {
        e.preventDefault();
        window.scrollBy({ top: -220, behavior: 'smooth' });
      } else if (key === 'd' && ctrlKey) {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight / 2, behavior: 'smooth' });
      } else if (key === 'u' && ctrlKey) {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight / 2, behavior: 'smooth' });
      } else if (key === 'G') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } else if (key === 'g') {
        e.preventDefault();
        if (gPending.current) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          gPending.current = false;
          clearTimeout(gTimer.current);
        } else {
          gPending.current = true;
          gTimer.current = setTimeout(() => { gPending.current = false; }, 600);
        }

      // Prev / next page
      } else if (key === '[') {
        e.preventDefault();
        const idx = PAGE_SEQUENCE.indexOf(pathname);
        if (idx > 0) navigate(PAGE_SEQUENCE[idx - 1]);
      } else if (key === ']') {
        e.preventDefault();
        const idx = PAGE_SEQUENCE.indexOf(pathname);
        if (idx !== -1 && idx < PAGE_SEQUENCE.length - 1) navigate(PAGE_SEQUENCE[idx + 1]);

      // Prev / next section within page
      } else if (key === '{') {
        e.preventDefault();
        const sections = PAGE_SECTIONS[pathname];
        if (sections) {
          const idx = sections.indexOf(getCurrentSection(sections));
          if (idx > 0) document.getElementById(sections[idx - 1])?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (key === '}') {
        e.preventDefault();
        const sections = PAGE_SECTIONS[pathname];
        if (sections) {
          const idx = sections.indexOf(getCurrentSection(sections));
          document.getElementById(sections[Math.min(idx + 1, sections.length - 1)])?.scrollIntoView({ behavior: 'smooth' });
        }

      // Page shortcuts
      } else if (PAGE_KEYS[key]) {
        navigate(PAGE_KEYS[key]);

      // Search
      } else if (key === '/') {
        e.preventDefault();
        setHelpOpen(false);
        setSearchOpen(true);

      // Help modal
      } else if (key === '?') {
        setHelpOpen(v => !v);
      } else if (key === 'Escape') {
        setHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pathname, navigate, searchOpen]);

  const handleSearchKey = (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      confirmSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchIdx(i => Math.max(i - 1, 0));
    }
  };

  return (
    <>
      {/* Search palette */}
      {searchOpen && (
        <div className="vim-overlay" onClick={closeSearch}>
          <div className="search-palette" onClick={e => e.stopPropagation()}>
            <div className="search-input-wrap">
              <span className="search-slash" aria-hidden="true">/</span>
              <input
                ref={searchInputRef}
                className="search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="Search pages…"
                aria-label="Search pages"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <ul className="search-results" role="listbox">
              {filtered.length > 0 ? filtered.map((page, i) => (
                <li
                  key={page.href}
                  role="option"
                  aria-selected={i === searchIdx}
                  className={`search-result${i === searchIdx ? ' active' : ''}${page.href === pathname ? ' current' : ''}`}
                  onMouseEnter={() => setSearchIdx(i)}
                  onClick={() => confirmSearch(i)}
                >
                  <span className="search-result-label">{page.label}</span>
                  <span className="search-result-path">{page.href}</span>
                  {page.href === pathname && <span className="search-result-badge">current</span>}
                </li>
              )) : (
                <li className="search-empty">No pages match</li>
              )}
            </ul>
            <div className="search-footer">
              <span><kbd className="vim-key-inline">↑↓</kbd> navigate</span>
              <span><kbd className="vim-key-inline">↵</kbd> go</span>
              <span><kbd className="vim-key-inline">Esc</kbd> close</span>
            </div>
          </div>
        </div>
      )}

      {/* Help modal */}
      {helpOpen && (
        <div className="vim-overlay" onClick={() => setHelpOpen(false)}>
          <div className="vim-modal" onClick={e => e.stopPropagation()}>
            <div className="vim-modal-header">
              <span className="vim-modal-title">Keyboard Navigation</span>
              <button className="vim-modal-close" onClick={() => setHelpOpen(false)} aria-label="Close">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="vim-groups">
              <div className="vim-group">
                <div className="vim-group-label">Scroll</div>
                <div className="vim-rows">
                  <div className="vim-row">
                    <span className="vim-key">j</span>
                    <span className="vim-key">k</span>
                    <span className="vim-desc">scroll down / up</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">^d</span>
                    <span className="vim-key">^u</span>
                    <span className="vim-desc">half page down / up</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">gg</span>
                    <span className="vim-desc">top of page</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">G</span>
                    <span className="vim-desc">bottom of page</span>
                  </div>
                </div>
              </div>

              {PAGE_SECTIONS[pathname] && (
                <div className="vim-group">
                  <div className="vim-group-label">Sections</div>
                  <div className="vim-rows">
                    <div className="vim-row">
                      <span className="vim-key">{'}'}</span>
                      <span className="vim-desc">next section</span>
                    </div>
                    <div className="vim-row">
                      <span className="vim-key">{'{'}</span>
                      <span className="vim-desc">prev section</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="vim-group">
                <div className="vim-group-label">Navigate</div>
                <div className="vim-rows">
                  <div className="vim-row">
                    <span className="vim-key">[</span>
                    <span className="vim-key">]</span>
                    <span className="vim-desc">prev / next page</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">/</span>
                    <span className="vim-desc">search pages</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">1</span>
                    <span className="vim-desc">Home</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">2</span>
                    <span className="vim-desc">About</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">3</span>
                    <span className="vim-desc">Research</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">4</span>
                    <span className="vim-desc">Projects</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">5</span>
                    <span className="vim-desc">Resume</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">6</span>
                    <span className="vim-desc">Writings</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">8</span>
                    <span className="vim-desc">Achievements</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">9</span>
                    <span className="vim-desc">Links</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">0</span>
                    <span className="vim-desc">Thanks</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="vim-modal-footer">
              press <kbd className="vim-key-inline">?</kbd> or <kbd className="vim-key-inline">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}

      <button
        className="vim-badge"
        onClick={() => setHelpOpen(v => !v)}
        aria-label="Keyboard navigation help"
        title="Keyboard shortcuts (?)"
      >
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M7 8h1M12 8h1M17 8h1M7 12h1M12 12h1M17 12h1M7 16h10"/>
        </svg>
        vim
      </button>
    </>
  );
}
