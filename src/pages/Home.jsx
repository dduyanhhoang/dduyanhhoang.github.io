import '../styles/landing.css';
import useScrollReveal      from '../hooks/useScrollReveal.js';
import ParticleNet          from '../components/ParticleNet.jsx';
import FloatingSymbols      from '../components/FloatingSymbols.jsx';
import Hero                 from '../components/Hero.jsx';
import About                from '../components/About.jsx';
import Research             from '../components/Research.jsx';
import Skills               from '../components/Skills.jsx';
import Acknowledgements     from '../components/Acknowledgements.jsx';
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

      <Hero />

      <div className="content-sections">
        <About />
        <div className="section-divider" aria-hidden="true" />
        <Research />
        <div className="section-divider" aria-hidden="true" />
        <Skills />
        <div className="section-divider" aria-hidden="true" />
        <Acknowledgements />
      </div>

      <Footer />
    </>
  );
}
