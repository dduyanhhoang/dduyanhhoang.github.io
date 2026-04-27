import '../styles/landing.css';
import useScrollReveal      from '../hooks/useScrollReveal.js';
import PageLine             from '../components/PageLine.jsx';
import ParticleNet          from '../components/ParticleNet.jsx';
import FloatingSymbols      from '../components/FloatingSymbols.jsx';
import Hero                 from '../components/Hero.jsx';
import About                from '../components/About.jsx';
import Research             from '../components/Research.jsx';
import Skills               from '../components/Skills.jsx';
import ExploreMore          from '../components/ExploreMore.jsx';
import Footer               from '../components/Footer.jsx';

export default function Home() {
  useScrollReveal();

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

      <PageLine />
      <Hero />

      <div className="content-sections">
        <About />
        <Research />
        <Skills />
        <ExploreMore />
      </div>

      <Footer />
    </>
  );
}
