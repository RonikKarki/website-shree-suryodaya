import { useRef, useEffect } from 'react';

// direction: 'up' | 'left' | 'right' | 'fade'
export default function SectionReveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.10 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
