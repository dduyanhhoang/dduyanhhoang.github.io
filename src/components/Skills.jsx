// Edit groups and chips here to update the skills section
const SKILL_GROUPS = [
  {
    name: 'Mathematics',
    chips: ['Linear Algebra', 'Analytic Geometry', 'Vector Calculus', 'Probability & Statistics', 'Optimization'],
  },
  {
    name: 'Languages & Libraries',
    chips: ['Python', 'SQL', 'TensorFlow', 'scikit-learn', 'NumPy', 'pandas', 'PennyLane'],
  },
  {
    name: 'Research Areas',
    chips: ['Quantum Machine Learning', 'Support Vector Machines', 'QUBO Formulation', 'EEG Signal Processing', 'Data Analysis'],
  },
];

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading">
      <div className="section-inner">
        <div className="label reveal">Skills</div>
        <h2 className="section-title reveal reveal-d1" id="skills-heading">Technical Toolkit</h2>

        <div className="skills-stack">
          {SKILL_GROUPS.map(({ name, chips }, i) => (
            <div className={`reveal reveal-d${i + 1}`} key={name}>
              <div className="skill-group-name">{name}</div>
              <div className="skill-chips">
                {chips.map(c => <span className="chip" key={c}>{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
