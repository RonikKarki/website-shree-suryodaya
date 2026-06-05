import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(target.replace(/\D/g, ''), 10) || 0;
    if (num === 0) { setCount(0); return; }
    const step = Math.ceil(num / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, num);
      setCount(current);
      if (current >= num) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function SingleStat({ icon, value, suffix = '', label, started }) {
  const count = useCountUp(value, 1800, started);
  const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
  return (
    <div className="flex flex-col items-center text-center py-10 px-6 group">
      <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">
        {started ? count.toLocaleString() : '0'}
        {suffix}
      </div>
      <div className="text-white/65 text-sm font-medium">{label}</div>
    </div>
  );
}

export default function StatCounter({ items = [], backgroundStyle = 'dark', sectionTag, title, subtitle }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bgClass =
    backgroundStyle === 'brand'
      ? 'bg-brand-600'
      : backgroundStyle === 'white'
      ? 'bg-white'
      : 'bg-gradient-to-br from-forest-900 to-earth-800';

  const textClass = backgroundStyle === 'white' ? 'text-forest-800' : 'text-white';
  const subClass = backgroundStyle === 'white' ? 'text-gray-500' : 'text-white/70';

  return (
    <section ref={ref} className={`py-16 ${bgClass} relative overflow-hidden`}>
      {/* Decorative */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(sectionTag || title || subtitle) && (
          <div className="text-center mb-10">
            {sectionTag && (
              <p className={`${backgroundStyle === 'white' ? 'text-brand-600' : 'text-brand-300'} font-semibold uppercase tracking-widest text-sm mb-2`}>
                {sectionTag}
              </p>
            )}
            {title && <h2 className={`font-heading text-3xl md:text-4xl font-bold ${textClass} mb-3`}>{title}</h2>}
            {subtitle && <p className={`${subClass} max-w-xl mx-auto`}>{subtitle}</p>}
          </div>
        )}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y ${backgroundStyle === 'white' ? 'divide-gray-100' : 'divide-white/10'}`}>
          {items.map((item) => (
            <SingleStat key={item.id} {...item} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
