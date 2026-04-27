import { Link } from 'react-router-dom';

const CARDS = [
  {
    href: '/writings',
    title: 'Writings',
    desc: 'Essays, notes, and thoughts.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    href: '/achievements',
    title: 'Achievements',
    desc: 'Certifications, prizes, and credentials.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    href: '/links',
    title: 'Links',
    desc: 'GitHub, socials, and work profiles.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
    ),
  },
  {
    href: '/thanks',
    title: 'Thanks',
    desc: 'People who made this possible.',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
];

const ARROW = (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

export default function ExploreMore() {
  return (
    <section id="explore" aria-labelledby="explore-heading">
      <div className="section-inner">
        <div className="label reveal">Explore more</div>
        <h2 className="section-title reveal reveal-d1" id="explore-heading">There's More Here</h2>

        <div className="explore-grid">
          {CARDS.map(({ href, title, desc, icon }, i) => (
            <Link key={href} to={href} className={`explore-card reveal reveal-d${i + 1}`}>
              <div className="card-icon">{icon}</div>
              <div className="explore-card-body">
                <h3 className="explore-card-title">{title}</h3>
                <p className="explore-card-desc">{desc}</p>
              </div>
              <span className="explore-card-arrow">{ARROW}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
