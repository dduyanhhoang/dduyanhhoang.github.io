import { Routes, Route } from 'react-router-dom';
import Cursor         from './components/Cursor.jsx';
import ScrollToTop    from './components/ScrollToTop.jsx';
import Nav            from './components/Nav.jsx';
import VimNav         from './components/VimNav.jsx';
import PageTransition from './components/PageTransition.jsx';
import Home           from './pages/Home.jsx';
import Resume         from './pages/Resume.jsx';
import Links          from './pages/Links.jsx';

export default function App() {
  return (
    <>
      <Cursor />
      <ScrollToTop />
      <VimNav />
      <Nav />
      <PageTransition>
        <Routes>
          <Route path="/"       element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/links"  element={<Links />} />
        </Routes>
      </PageTransition>
    </>
  );
}
