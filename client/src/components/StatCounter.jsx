import { useEffect, useRef, useState } from 'react';
import EmojiIcon from '../lib/iconMap';

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(target.replace(/\D/g, ''), 10) || 0;
    if (num === 0) { setCount(0); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(num);
      return;
    }
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

function SingleStat({ icon, value, suffix = '', label, started, index }) {
  const count = useCountUp(value, 2000, started);
  return (
    <div className="relative flex flex-col items-center text-center py-12 px-6 group">
      {/* Divider (not on last) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/8 hidden lg:block last:hidden" />

      <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
        <EmojiIcon emoji={icon} className="w-8 h-8 text-gold-400" strokeWidth={1.5} />
      </div>

      <div className="font-heading font-bold text-gold-400 leading-none mb-1" style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}>
        {started ? count.toLocaleString() : '0'}{suffix}
      </div>

      <div className="w-8 h-px bg-gold-500/30 my-3" />

      <div className="text-white/55 text-sm font-medium tracking-wide uppercase">{label}</div>
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

  // In the new design, always use dark/ink background for drama
  const bgClass =
    backgroundStyle === 'white'
      ? 'bg-sand-200'
      : backgroundStyle === 'brand'
      ? 'bg-gold-600'
      : 'bg-ink-900';

  const isDark  = backgroundStyle !== 'white';

  return (
    <section ref={ref} className={`relative ${bgClass} grain-overlay overflow-hidden`}>
      {/* Seam hairlines — soften hard transitions between dark band and light neighbours */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/25 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500/25 to-transparent pointer-events-none z-10" />

      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {(sectionTag || title || subtitle) && (
          <div className="text-center mb-12">
            {sectionTag && (
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-6 h-px bg-gold-500/50" />
                <span className={`text-[11px] font-semibold uppercase tracking-[0.25em] ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>
                  {sectionTag}
                </span>
                <div className="w-6 h-px bg-gold-500/50" />
              </div>
            )}
            {title && (
              <h2 className={`font-heading text-3xl md:text-4xl font-bold mb-3 ${isDark ? 'text-white' : 'text-ink-900'}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`max-w-xl mx-auto text-base ${isDark ? 'text-white/55' : 'text-ink-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y lg:divide-y-0 divide-white/8">
          {items.map((item, i) => (
            <SingleStat key={item.id} {...item} started={started} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
