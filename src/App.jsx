import { Routes, Route } from 'react-router-dom';
import Cursor         from './components/Cursor.jsx';
import ScrollToTop    from './components/ScrollToTop.jsx';
import Nav            from './components/Nav.jsx';
import VimNav         from './components/VimNav.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home           from './pages/Home.jsx';
import Achievements   from './pages/Achievements.jsx';
import About          from './pages/About.jsx';
import Research       from './pages/Research.jsx';
import Projects        from './pages/Projects.jsx';
import Resume         from './pages/Resume.jsx';
import Links          from './pages/Links.jsx';
import Thanks         from './pages/Thanks.jsx';
import Writings       from './pages/Writings.jsx';

export default function App() {
  return (
    <>
      <Cursor />
      <ScrollToTop />
      <VimNav />
      <Nav />
      <PageTransition>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about"    element={<About />} />
          <Route path="/research" element={<Research />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume"   element={<Resume />} />
          <Route path="/links"    element={<Links />} />
          <Route path="/thanks"    element={<Thanks />} />
          <Route path="/writings" element={<Writings />} />
        </Routes>
      </PageTransition>
    </>
  );
}
