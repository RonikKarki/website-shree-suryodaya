import { useRef, useEffect } from 'react';

// direction: 'up' | 'left' | 'right' | 'fade'
export default function SectionReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('visible');
      return;
    }

    let tid;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(el);
          tid = setTimeout(() => el.classList.add('visible'), delay);
        }
      },
      { threshold: 0.10 }
    );
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(tid); };
  }, [delay]);

  const cls =
    direction === 'left' ? 'reveal-left' :
    direction === 'right' ? 'reveal-right' :
    direction === 'fade'  ? 'reveal-fade' :
    'reveal';

  return (
    <div ref={ref} className={`${cls} ${className}`}>
      {children}
    </div>
  );
}
