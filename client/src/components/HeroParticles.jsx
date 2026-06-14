import { useEffect, useRef } from 'react';

// Brand palette: cream, warm sand, gold
const PALETTE = [
  [200, 168, 107], // #C8A86B gold
  [228, 218, 196], // warm sand
  [248, 246, 241], // cream
];

function mkParticle(W, H) {
  return {
    x:  Math.random() * W,
    y:  Math.random() * H,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r:  Math.random() * 1.8 + 0.4,
    a:  Math.random() * 0.28 + 0.06,
    c:  PALETTE[Math.floor(Math.random() * PALETTE.length)],
  };
}

export default function HeroParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Bail on reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Disable entirely on mobile — saves battery, no cursor interactivity there anyway
    if (window.innerWidth < 768) return;

    // Low-end detection: fewer particles for devices with ≤ 4 hardware threads
    const isLowEnd = (navigator.hardwareConcurrency ?? 8) <= 4;
    const COUNT = isLowEnd ? 22 : 52;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Size canvas to its CSS box
    const resize = () => {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();

    let pts = Array.from({ length: COUNT }, () => mkParticle(canvas.width, canvas.height));

    // Cursor position (relative to canvas, default to centre)
    let mx = canvas.width  / 2;
    let my = canvas.height / 2;

    let tabHidden  = document.hidden;
    let heroInView = true;
    let raf;

    // Pause when tab is backgrounded
    const onVisibility = () => { tabHidden = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    // Cursor tracking (window-level so pointer-events-none canvas doesn't block it)
    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMouse, { passive: true });

    // Pause RAF when hero scrolls off-screen
    const io = new IntersectionObserver(
      ([entry]) => { heroInView = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (tabHidden || !heroInView) return;

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        // Very gentle cursor nudge (within 180px radius)
        const dx = mx - p.x;
        const dy = my - p.y;
        const d  = Math.hypot(dx, dy);
        if (d > 0 && d < 180) {
          p.vx += (dx / d) * 0.0012;
          p.vy += (dy / d) * 0.0012;
        }

        // Light drag + speed cap
        p.vx *= 0.985;
        p.vy *= 0.985;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.45) {
          p.vx = (p.vx / sp) * 0.45;
          p.vy = (p.vy / sp) * 0.45;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges with a small buffer
        if (p.x < -8) p.x = W + 8;
        if (p.x > W + 8) p.x = -8;
        if (p.y < -8) p.y = H + 8;
        if (p.y > H + 8) p.y = -8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
        ctx.fill();
      }
    };

    tick();

    const onResize = () => {
      resize();
      // Re-seed so particles are distributed across the new size
      pts = Array.from({ length: COUNT }, () => mkParticle(canvas.width, canvas.height));
      mx = canvas.width  / 2;
      my = canvas.height / 2;
    };
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    />
  );
}
