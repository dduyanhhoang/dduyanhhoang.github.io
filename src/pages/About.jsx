import '../styles/landing.css';
import ParticleNet     from '../components/ParticleNet.jsx';
import FloatingSymbols from '../components/FloatingSymbols.jsx';
import Footer          from '../components/Footer.jsx';

export default function About() {
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

      <main className="under-construction">
        <div className="label">About</div>
        <h1 className="uc-title">Under Construction</h1>
        <p className="uc-sub">This page is on its way.</p>
      </main>

      <Footer />
    </>
  );
}
