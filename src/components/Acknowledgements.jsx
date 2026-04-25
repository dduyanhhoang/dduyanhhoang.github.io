// Edit FEATURED and SUPPORTERS to update this section
const FEATURED = {
  name:   'Thuy',
  role:   'The one who keeps me grounded',
  quote:  'For staying patient through every late night, every doubt, and every quiet moment of frustration — and still being the first to celebrate every small win.',
};

const SUPPORTERS = [
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    name:  'QMOS Lab',
    note:  'For the mentorship, the hard questions, and the space to explore unconventional ideas.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    name:  'My Family',
    note:  'For the unconditional support and the belief that showed up long before I believed in myself.',
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8h1a4 4 0 010 8h-1" />
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    name:  'Friends & Peers',
    note:  'For the conversations, the laughs, and making the journey worth more than the destination.',
  },
];

function Heart() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

export default function Acknowledgements() {
  return (
    <section id="acknowledgements" aria-labelledby="ack-heading">
      <div className="section-inner">
        <div className="label reveal">Acknowledgements</div>
        <h2 className="section-title reveal reveal-d1" id="ack-heading">
          With Gratitude
        </h2>
        <p className="section-sub reveal reveal-d2">
          Research is never done alone. Behind every result are the people who make it possible — and meaningful.
        </p>

        {/* Featured — Thuy */}
        <div className="ack-featured reveal reveal-d3">
          <div className="ack-featured-icon" aria-hidden="true">
            <Heart />
          </div>
          <div className="ack-featured-body">
            <div className="ack-featured-meta">
              <span className="ack-featured-name">{FEATURED.name}</span>
              <span className="ack-featured-role">{FEATURED.role}</span>
            </div>
            <blockquote className="ack-featured-quote">
              &ldquo;{FEATURED.quote}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Support grid */}
        <div className="ack-grid">
          {SUPPORTERS.map(({ icon, name, note }) => (
            <div className="ack-card reveal reveal-d1" key={name}>
              <div className="ack-card-icon" aria-hidden="true">{icon}</div>
              <div>
                <div className="ack-card-name">{name}</div>
                <p className="ack-card-note">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
