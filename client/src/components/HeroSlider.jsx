import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';

const gradientFallbacks = [
  'from-[#0D1B0E] via-[#1E4D2B] to-[#0D1B0E]',
  'from-[#1a2e0e] via-[#2e5c1a] to-[#0e1a0a]',
  'from-[#0e1f1a] via-[#1a4030] to-[#0a1510]',
];

export default function HeroSlider({ slides = [], buttons = [], autoplayInterval = 5000 }) {
  const [current, setCurrent]       = useState(0);
  const [paused, setPaused]         = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((index) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 500);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, slides.length, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, slides.length, goTo]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(next, autoplayInterval);
    return () => clearInterval(timerRef.current);
  }, [paused, next, autoplayInterval, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden grain-overlay"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide backgrounds ── */}
      {slides.map((s, i) => (
        <div
          key={s.id || i}
          className={`absolute inset-0 transition-all duration-700 ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
        >
          {s.image ? (
            <img src={resolveUrl(s.image)} alt={s.title || ''} className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientFallbacks[i % gradientFallbacks.length]}`} />
          )}
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" style={{ opacity: s.overlayOpacity ?? 0.7 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* ── Large decorative background text ── */}
      <div className="absolute inset-0 flex items-center justify-end overflow-hidden pointer-events-none select-none">
        <span className="font-heading font-bold text-[20vw] text-white/[0.03] leading-none pr-8 whitespace-nowrap">
          RICE
        </span>
      </div>

      {/* ── Content — bottom-left aligned ── */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-28 md:pb-36 transition-all duration-600 ${
        transitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
      }`}>
        <div className="max-w-3xl">
          {slide.tag && (
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-gold-500" />
              <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.25em]">
                {slide.tag}
              </span>
            </div>
          )}

          <h1 className="font-heading font-bold text-white leading-[1.1] mb-6
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            {slide.title?.split('\n').map((line, i) => (
              <span key={i} className={i % 2 === 1 ? 'block text-gold-400 italic' : 'block'}>
                {line}
              </span>
            ))}
          </h1>

          {slide.subtitle && (
            <p className="text-white/70 text-base md:text-lg max-w-xl mb-10 leading-relaxed font-light">
              {slide.subtitle}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {buttons.map((btn, i) => {
                const isExternal = btn.link?.startsWith('tel:') || btn.link?.startsWith('mailto:') || btn.link?.startsWith('http');
                const cls = i === 0
                  ? 'inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-semibold px-8 py-3.5 rounded-full text-sm tracking-wide transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-gold-500/30'
                  : 'inline-flex items-center gap-2 border border-white/40 text-white hover:bg-white/10 font-medium px-8 py-3.5 rounded-full text-sm tracking-wide transition-all duration-300 backdrop-blur-sm';
                return isExternal ? (
                  <a key={btn.id} href={btn.link} className={cls}>{btn.label} {i === 0 && <FaArrowRight className="text-xs" />}</a>
                ) : (
                  <Link key={btn.id} to={btn.link || '/'} className={cls}>{btn.label} {i === 0 && <FaArrowRight className="text-xs" />}</Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Slide count indicator ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 right-6 md:right-12 z-20 flex items-center gap-4">
          <button onClick={prev} className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-sm">
            <FaChevronLeft className="text-xs" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current ? 'w-6 h-1.5 bg-gold-500' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all backdrop-blur-sm">
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      )}

      {/* ── Scroll cue ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/30">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/40" />
        <span className="text-[10px] tracking-[0.3em] uppercase rotate-0">Scroll</span>
      </div>
    </section>
  );
}
