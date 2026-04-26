import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HOME_SECTIONS = ['hero', 'about', 'research', 'skills', 'acknowledgements'];

function getCurrentSection() {
  let closest = HOME_SECTIONS[0];
  let closestDist = Infinity;
  for (const id of HOME_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const dist = Math.abs(el.getBoundingClientRect().top);
    if (dist < closestDist) { closestDist = dist; closest = id; }
  }
  return closest;
}

export default function VimNav() {
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const gPending = useRef(false);
  const gTimer = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;
      if (e.metaKey || e.altKey) return;

      const { key, ctrlKey } = e;

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
      } else if (key === ']' && isHome) {
        e.preventDefault();
        const idx = HOME_SECTIONS.indexOf(getCurrentSection());
        document.getElementById(HOME_SECTIONS[Math.min(idx + 1, HOME_SECTIONS.length - 1)])
          ?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === '[' && isHome) {
        e.preventDefault();
        const idx = HOME_SECTIONS.indexOf(getCurrentSection());
        document.getElementById(HOME_SECTIONS[Math.max(idx - 1, 0)])
          ?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === '1') {
        navigate('/');
      } else if (key === '2') {
        navigate('/resume');
      } else if (key === '3') {
        navigate('/links');
      } else if (key === '?') {
        setHelpOpen(v => !v);
      } else if (key === 'Escape') {
        setHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isHome, navigate]);

  return (
    <>
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

              {isHome && (
                <div className="vim-group">
                  <div className="vim-group-label">Sections</div>
                  <div className="vim-rows">
                    <div className="vim-row">
                      <span className="vim-key">]</span>
                      <span className="vim-desc">next section</span>
                    </div>
                    <div className="vim-row">
                      <span className="vim-key">[</span>
                      <span className="vim-desc">prev section</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="vim-group">
                <div className="vim-group-label">Pages</div>
                <div className="vim-rows">
                  <div className="vim-row">
                    <span className="vim-key">1</span>
                    <span className="vim-desc">Home</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">2</span>
                    <span className="vim-desc">Resume</span>
                  </div>
                  <div className="vim-row">
                    <span className="vim-key">3</span>
                    <span className="vim-desc">Links</span>
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
