// Add or remove entries here to update the research section
const PROJECTS = [
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    meta: 'Dec 2025 — Present · QMOS Lab',
    title: 'QSVM-EEG',
    desc: 'Kernel-based Quantum Support Vector Regressor using PennyLane with GPU acceleration (lightning.gpu) to predict patient BIS values from EEG biosignals.',
    tags: ['Quantum ML', 'PennyLane', 'EEG'],
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8"  y1="2" x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
    meta: 'Sep 2025 — Present · QMOS Lab',
    title: 'Timetabling Optimization',
    desc: 'Benchmarked quantum approaches to minimize qubit requirements. Refined soft and hard Hamiltonian constraints to improve solution viability in combinatorial scheduling.',
    tags: ['QUBO', 'Optimization', 'Hamiltonian'],
  },
  {
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    meta: 'Jun 2024 — Sep 2024 · VuonAI Lab',
    title: 'Vietnamese Lip Reading',
    desc: 'Assisted in researching and curating Vietnamese voice and lip-reading datasets for multimodal speech recognition research.',
    tags: ['Computer Vision', 'NLP', 'Dataset'],
  },
];

export default function Research() {
  return (
    <section id="research" aria-labelledby="research-heading">
      <div className="section-inner">
        <div className="label reveal">Research &amp; Work</div>
        <h2 className="section-title reveal reveal-d1" id="research-heading">What I've Been Building</h2>
        <p className="section-sub reveal reveal-d2">
          Projects at the intersection of quantum computing, machine learning, and real-world applications.
        </p>

        <div className="cards-grid">
          {PROJECTS.map(({ icon, meta, title, desc, tags }, i) => (
            <article className={`card reveal reveal-d${i + 1}`} key={title}>
              <span className="card-num" aria-hidden="true">#{String(i + 1).padStart(2, '0')}</span>
              <div className="card-icon" aria-hidden="true">{icon}</div>
              <div className="card-meta">{meta}</div>
              <h3 className="card-title">{title}</h3>
              <p className="card-desc">{desc}</p>
              <div className="tags">
                {tags.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
