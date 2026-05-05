---
name: convert-skills-to-projects-page
description: Convert Skills page to Projects page showcasing portfolio projects
type: project
---

# Design Spec: Projects Page

**Date:** 2026-05-05  
**Author:** dduyanhhoang  
**Status:** Draft → Approved

---

## 1. Overview

Transform the existing "Skills" page (currently an "Under Construction" placeholder) into a "Projects" page that showcases portfolio projects. The first project featured is **psipose**, a scikit-learn-compatible quantum ML library. The page will be designed to easily accommodate future projects.

---

## 2. Requirements

### Functional
- Display projects in a responsive card grid layout
- Each project card shows: title, description, tech stack tags, GitHub link
- Route `/skills` renamed to `/projects`
- Navigation link updated to point to Projects
- Works with 1 project and scales to many

### Non-Functional
- Match existing site aesthetic (clean, modern, particle effects)
- Accessible (semantic HTML, ARIA labels)
- Responsive (mobile → tablet → desktop)
- Reusable data structure for future projects

---

## 3. Architecture

### File Changes

| File | Action |
|------|--------|
| `src/pages/Skills.jsx` | Rename to `Projects.jsx`, replace content |
| `src/styles/skills.css` | Rename to `projects.css`, update styles |
| `src/App.jsx` | Update import: `Skills` → `Projects` |
| `src/components/Nav.jsx` | Update navigation link text and href |

### Data Structure

```javascript
const PROJECTS = [
  {
    id: 'psipose',
    title: 'Psipose',
    description: 'Scikit-learn compatible quantum machine learning library powered by PennyLane. Provides drop-in quantum estimators (classifiers, regressors, kernels) that follow sklearn API and work with Pipeline, GridSearchCV, and cross_val_score.',
    techStack: ['Python', 'PennyLane', 'scikit-learn', 'NumPy'],
    githubUrl: 'https://github.com/dduyanhhoang/psipose',
  },
  // Future projects can be added here
];
```

---

## 4. Component Design

### `Projects.jsx`

```jsx
import '../styles/projects.css';
import ParticleNet from '../components/ParticleNet.jsx';
import FloatingSymbols from '../components/FloatingSymbols.jsx';
import Footer from '../components/Footer.jsx';

const PROJECTS = [ /* data as above */ ];

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-content">
        <h2 className="project-title">{project.title}</h2>
        <p className="project-description">{project.description}</p>
        <div className="project-tech-stack">
          {project.techStack.map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
        </div>
        <a
          href={project.githubUrl}
          className="project-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${project.title} on GitHub`}
        >
          <svg /* GitHub icon */ />
          <span>GitHub</span>
        </a>
      </div>
    </article>
  );
}

export default function Projects() {
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

      <div className="page-layout">
        <main className="projects-page">
          <h1 className="projects-title">Projects</h1>
          <div className="projects-grid">
            {PROJECTS.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
```

### Styling (`projects.css`)

- Reuse patterns from `landing.css` and `links.css` (blobs, dot-grid, page-layout)
- Grid layout using CSS Grid:
  - `grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))`
- Card styling: subtle border, rounded corners, hover lift effect
- Tech tags: small pills with accent color

---

## 5. Route & Navigation Updates

**App.jsx:**
```diff
- import Skills from './pages/Skills.jsx';
+ import Projects from './pages/Projects.jsx';

  <Route path="/skills" element={<Skills />} />
+ <Route path="/projects" element={<Projects />} />
```

**Nav.jsx:**
- Find the Skills nav link, change:
  - Text: "Skills" → "Projects"
  - `to="/skills"` → `to="/projects"`
- Update aria-current if present

---

## 6. Visual Design

The Projects page will follow the visual language of the site:
- Dark theme with gradient blobs in background
- Particle network animation
- Floating symbols overlay
- Clean typography, rounded cards
- Subtle hover interactions

---

## 7. Implementation Steps

1. Create `PROJECTS` data array in `Projects.jsx`
2. Build `ProjectCard` component
3. Implement grid layout in CSS
4. Style cards (borders, spacing, typography)
5. Update `App.jsx` imports and routes
6. Update `Nav.jsx` link
7. Test responsive behavior
8. Verify all 3 pages (Home, Projects, Links) work in sequence

---

## 8. Edge Cases & Considerations

- **No projects:** Empty state handled gracefully (grid shows "No projects yet")
- **Long descriptions:** CSS text-overflow or allow natural wrapping
- **Many tech stack items:** Flex wrap for tags
- **Accessibility:** Cards use `<article>`, links have descriptive aria-labels

---

## 9. Future Extensions

- Add project images/screenshots
- Filter by tech stack
- Add live demo links
- Sort/ordering control

---
