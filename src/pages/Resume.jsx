import { Link } from 'react-router-dom';
import '../styles/resume.css';

function Entry({ title, date, role, org, bullets }) {
  return (
    <div className="entry">
      <div className="entry-header">
        <span className="entry-title">{title}</span>
        <span className="entry-date">{date}</span>
      </div>
      <div className="entry-sub">
        <span>{role}</span>
        <span>{org}</span>
      </div>
      <ul className="bullets">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}

const EXPERIENCE = [
  {
    title: 'QSVM-EEG', date: 'Dec 2025 — Present',
    role: 'Research Assistance', org: 'QMOS Lab — FPT University Hanoi',
    bullets: ['Implemented a kernel-based Quantum Support Vector Regressor using PennyLane with GPU acceleration (lightning.gpu) to predict patient BIS values from EEG signals.'],
  },
  {
    title: 'Time Tabling Optimization', date: 'Sep 2025 — Present',
    role: 'Research Assistance', org: 'QMOS Lab — FPT University Hanoi',
    bullets: [
      'Benchmarked and applied established approaches to minimize the number of required qubits.',
      'Refined soft and hard Hamiltonian constraints to improve the solution viability.',
    ],
  },
  {
    title: 'Vietnamese Lip Reading', date: 'Jun 2024 — Sep 2024',
    role: 'Research Assistance', org: 'VuonAI Lab — FPT University HCM',
    bullets: ['Assisted researching existing Vietnamese voice and lip reading dataset.'],
  },
  {
    title: 'Data Science Program', date: 'Mar 2024 — May 2024',
    role: 'Teaching Assistance', org: 'FPT University HCM',
    bullets: [
      'Mentored government employees in Data Analysis using Excel and Google Looker Studio.',
      'Translated technical data concepts into practical business insights for non-technical stakeholders.',
    ],
  },
];

const LEADERSHIP = [
  {
    title: 'TEDxFPTUniversityHCMC 2024', date: 'Jan 2024 — Jun 2024',
    role: 'Account', org: 'FPT University',
    bullets: [
      'Managed task allocation and progress across a team of 50 people.',
      'Handled accounting responsibilities and facilitated communication between the team, the university, and external providers and performers.',
    ],
  },
];

export default function Resume() {
  return (
    <div className="resume-page">
      <Link to="/" className="back-link">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Home
      </Link>

      <div className="page">
        <header>
          <h1>Hoang Dinh Duy Anh</h1>
          <p className="location">Hanoi, Vietnam</p>
          <nav className="contact-links">
            <a href="tel:+84343375473">
              <svg className="icon" viewBox="0 0 24 24"><path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.57.57 1 1 0 011 1V21a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.57 1 1 0 01-.25 1z"/></svg>
              +84-343-375-473
            </a>
            <a href="mailto:dduyanhhoang@gmail.com">
              <svg className="icon" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 7L4 6v12h16V6z" opacity=".3"/><path d="M20 6H4l8 5z"/></svg>
              dduyanhhoang@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/dduyanhhoang/" target="_blank" rel="noopener noreferrer">
              <svg className="icon" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zm2-4a2 2 0 110 4 2 2 0 010-4z"/></svg>
              dduyanhhoang
            </a>
            <a href="https://github.com/dduyanhhoang" target="_blank" rel="noopener noreferrer">
              <svg className="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7C6.73 19.91 6.14 18 6.14 18c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 7.43c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
              dduyanhhoang
            </a>
          </nav>
        </header>

        <section>
          <h2>Summary</h2>
          <p className="summary">Artificial Intelligence student with a strong foundation in Applied Math and Machine Learning. Experienced in implementing advanced algorithms (Quantum ML, Optimization) and modern AI applications.</p>
        </section>

        <section>
          <h2>Experience</h2>
          {EXPERIENCE.map(e => <Entry key={e.title} {...e} />)}
        </section>

        <section>
          <h2>Related Skills</h2>
          <div className="skills-grid">
            <div className="skill-row"><strong>Mathematics:</strong> Linear algebra, analytic geometry, vector calculus, probability &amp; statistics, optimization</div>
            <div className="skill-row"><strong>Languages &amp; Libraries:</strong> Python (TensorFlow, scikit-learn, NumPy, pandas, PennyLane), SQL</div>
          </div>
        </section>

        <section>
          <h2>Leadership / Extracurricular</h2>
          {LEADERSHIP.map(e => <Entry key={e.title} {...e} />)}
        </section>

        <section>
          <h2>Education</h2>
          <div className="entry">
            <div className="entry-header">
              <span className="entry-title">FPT University (Hoa Lac Campus)</span>
              <span className="entry-date">Sep 2023 — Present</span>
            </div>
            <div className="entry-sub">
              <span>Bachelor of Information Technology — Artificial Intelligence</span>
              <span>Hanoi, Vietnam</span>
            </div>
            <ul className="bullets"><li>CGPA: 3.44 / 4.0</li></ul>
          </div>
        </section>

        <section>
          <h2>Certification</h2>
          <div className="entry">
            <div className="entry-header">
              <span className="entry-title">British Council — IELTS</span>
              <span className="entry-date">Sep 2023 — Aug 2025</span>
            </div>
            <div className="entry-sub">
              <span>International English Language Testing System</span>
              <span>Ho Chi Minh, Vietnam</span>
            </div>
            <ul className="bullets"><li>Overall band score: 7.0</li></ul>
          </div>
        </section>
      </div>
    </div>
  );
}
