const NOW_CARDS = [
  {
    label: 'Research Assistant',
    sub: 'QMOS Lab',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  },
  {
    label: 'AI Student',
    sub: 'FPT University, Hoa Lac',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3.33 2 8.67 2 12 0v-5"/></svg>,
  },
  {
    label: 'Hanoi, Vietnam',
    sub: 'GMT+7',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s-8-5.5-8-11a8 8 0 0116 0c0 5.5-8 11-8 11z"/><circle cx="12" cy="11" r="3"/></svg>,
  },
  {
    label: 'Open to Opportunities',
    sub: 'Research & Internships',
    icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="section-inner">
        <div className="label reveal">About</div>
        <h2 className="section-title reveal reveal-d1" id="about-heading">
          Bridging Math &amp;<br />Machine Learning
        </h2>

        <div className="about-grid">
          <div className="about-body reveal reveal-d2">
            <p>I'm an Artificial Intelligence student at FPT University (Hoa Lac Campus), grounded in Applied Mathematics and passionate about pushing the boundaries of ML research.</p>
            <p>At QMOS Lab, I work on Quantum Machine Learning — applying quantum kernel methods to real-world biosignal processing and formulating Hamiltonian constraints for scheduling optimization.</p>
            <p>I also care about communicating ideas clearly: as a Teaching Assistant, I helped government employees turn raw data into actionable insights using modern analytics tools.</p>
          </div>

          <div className="now-grid reveal reveal-d3">
            {NOW_CARDS.map(({ label, sub, icon }) => (
              <div className="now-card" key={label}>
                <div className="now-icon" aria-hidden="true">{icon}</div>
                <div className="now-text">
                  <span className="now-label">{label}</span>
                  <span className="now-sep">·</span>
                  <span className="now-sub">{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
