import { useEffect, useRef } from 'react';

// Matches any element that should trigger the hover-expand effect
const INTERACTIVE = 'a, button, .card, .now-card, .chip, .ack-card, .ack-featured';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0, scale = 1, targetScale = 1;
    let rafId;

    const setHover = on => {
      targetScale = on ? 1.6 : 1;
      dot.classList.toggle('cur-hovering', on);
      ring.classList.toggle('cur-hovering', on);
    };

    const onMove = e => {
      mx = e.clientX;
      my = e.clientY;
      dot.classList.add('cur-visible');
      ring.classList.add('cur-visible');
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    };

    const onLeave = () => {
      dot.classList.remove('cur-visible');
      ring.classList.remove('cur-visible');
    };

    // Event delegation — works on every route without re-attaching listeners
    const onOver = e => {
      if (e.target.closest(INTERACTIVE)) setHover(true);
    };

    const onOut = e => {
      const leaving  = e.target.closest(INTERACTIVE);
      const entering = e.relatedTarget?.closest(INTERACTIVE);
      if (leaving && !entering) setHover(false);
    };

    // Any click (link navigation, button) resets the hover state
    const onClick = () => setHover(false);

    document.addEventListener('mousemove',  onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover',  onOver);
    document.addEventListener('mouseout',   onOut);
    document.addEventListener('click',      onClick);

    const loop = () => {
      rx    += (mx - rx)             * 0.12;
      ry    += (my - ry)             * 0.12;
      scale += (targetScale - scale) * 0.15;
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(${scale})`;
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener('mousemove',  onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      document.removeEventListener('click',      onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
