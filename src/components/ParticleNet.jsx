import { useEffect, useRef } from 'react';

const COUNT  = 58;
const DIST   = 140;
const SPEED  = 0.28;

export default function ParticleNet() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let rafId, w, h, particles;

    const isLight = () => window.matchMedia('(prefers-color-scheme: light)').matches;

    function resize() {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function init() {
      particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * w,
        y:  Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  Math.random() * 1.2 + 0.4,
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);

      const rgb = isLight() ? '79,70,229' : '129,140,248';

      for (const p of particles) {
        p.x = (p.x + p.vx + w) % w;
        p.y = (p.y + p.vy + h) % h;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},0.45)`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length - 1; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${rgb},${(1 - dist / DIST) * 0.12})`;
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    resize();
    init();
    frame();

    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="particle-net" aria-hidden="true" />;
}
