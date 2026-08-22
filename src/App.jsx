import { useEffect, useState } from 'react';
import './styles/base.css';
import './styles/paper.css';

/* Add to this list and the cycle picks it up. */
const ROLES = ['Undergrad researcher', 'Engineer', "What's next?"];

const LINKS = [
  { name: 'Email',     url: 'dduyanhhoang@gmail.com',              href: 'mailto:dduyanhhoang@gmail.com' },
  { name: 'ORCID',     url: 'orcid.org/0009-0006-9245-8896',       href: 'https://orcid.org/0009-0006-9245-8896' },
  { name: 'GitHub',    url: 'github.com/dduyanhhoang',             href: 'https://github.com/dduyanhhoang' },
  { name: 'LinkedIn',  url: 'linkedin.com/in/dduyanhhoang',        href: 'https://www.linkedin.com/in/dduyanhhoang/' },
];

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Sets one phrase at a time, then unsets it. Screen readers get all
   three at once from the sibling below; this half is decorative. */
function TypedRole() {
  const [still] = useState(reducedMotion);
  const [word, setWord] = useState(0);
  const [len, setLen] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (still) return undefined;
    const full = ROLES[word % ROLES.length];
    const done = len === full.length;
    const delay = erasing ? (len > 0 ? 34 : 240) : done ? 1700 : 62;

    const timer = setTimeout(() => {
      if (!erasing && !done) setLen(len + 1);
      else if (!erasing && done) setErasing(true);
      else if (len > 0) setLen(len - 1);
      else { setErasing(false); setWord(word + 1); }
    }, delay);
    return () => clearTimeout(timer);
  }, [still, word, len, erasing]);

  if (still) return <span>{ROLES.join(', ')}</span>;

  const full = ROLES[word % ROLES.length];

  /* The whole phrase is always laid out, so it is always centred and
     its width never changes mid-phrase; only the clip and the caret
     move. Slicing the string instead would force a choice between
     centred and stable, and this needs both. */
  return (
    <>
      <span className="typed" aria-hidden="true" style={{ '--rev': len / full.length }}>
        <span className="typed-text">{full}</span>
        <span className="caret" />
      </span>
      <span className="sr-only">{ROLES.join(', ')}</span>
    </>
  );
}

export default function App() {
  return (
    <main className="paper">
      <header className="titleblock">
        <h1 className="title">D Duy Anh Hoang</h1>
        <p className="authors"><TypedRole /></p>
        <p className="fields">Quantum, AI, speech, more</p>
        <p className="dateline">Vietnam</p>
      </header>

      <section className="abstract">
        <h2>Abstract</h2>
        <p>
          Undergraduate in Artificial Intelligence, grounded in applied mathematics.
          I work on quantum machine learning: quantum kernel methods applied to
          biosignal processing, optimisation and error correction. Open to research
          collaborations.
        </p>
      </section>

      <section className="section">
        <h2><span className="secnum">1</span>Links</h2>
        <ol className="refs" role="list">
          {LINKS.map(({ name, url, href }, i) => (
            <li key={name}>
              <a className="ref" href={href}>
                <span className="refnum">[{i + 1}]</span>
                <span>
                  <span className="refname">{name}. </span>
                  <span className="url">{url}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <footer className="colophon">
        <p>© 2026 D Duy Anh Hoang.</p>
      </footer>
    </main>
  );
}
