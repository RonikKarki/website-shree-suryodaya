import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaLeaf } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';

// Gradient fallbacks when no image is uploaded
const gradientFallbacks = [
  'from-forest-900 via-forest-800 to-earth-800',
  'from-forest-800 via-earth-700 to-forest-900',
  'from-earth-800 via-forest-900 to-forest-700',
];

export default function HeroSlider({ slides = [], buttons = [], autoplayInterval = 5000 }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (index, dir = 'next') => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setTransitioning(false);
      }, 400);
    },
    [transitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Autoplay
  useEffect(() => {
    if (paused || slides.length <= 1) return;
    timerRef.current = setInterval(next, autoplayInterval);
    return () => clearInterval(timerRef.current);
  }, [paused, next, autoplayInterval, slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const fallback = gradientFallbacks[current % gradientFallbacks.length];

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Slide background ── */}
      {slides.map((s, i) => (
        <div
          key={s.id || i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {s.image ? (
            <img
              src={resolveUrl(s.image)}
              alt={s.title || ''}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradientFallbacks[i % gradientFallbacks.length]}`} />
          )}
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: s.overlayOpacity ?? 0.55 }}
          />
        </div>
      ))}

      {/* ── Background pattern ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Decorative blurs ── */}
      <div className="absolute top-20 right-16 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-forest-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* ── Slide content ── */}
      <div
        className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-36 transition-all duration-500 ${
          transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {slide.tag && (
          <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 text-brand-300 rounded-full px-5 py-2 text-sm font-medium mb-8">
            <FaLeaf className="text-brand-400" />
            {slide.tag}
          </div>
        )}

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          {slide.title?.split('\n').map((line, i) => (
            <span key={i} className={i === 1 ? 'block text-brand-400' : i > 1 ? 'block' : ''}>
              {line}
            </span>
          ))}
        </h1>

        {slide.subtitle && (
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {slide.subtitle}
          </p>
        )}

        {/* Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((btn) => {
              const isExternal = btn.link?.startsWith('tel:') || btn.link?.startsWith('mailto:') || btn.link?.startsWith('http');
              const cls =
                btn.variant === 'secondary'
                  ? 'btn-secondary text-base px-8 py-3.5'
                  : btn.variant === 'outline'
                  ? 'btn-outline text-base px-8 py-3.5'
                  : 'btn-primary text-base px-8 py-3.5';

              return isExternal ? (
                <a key={btn.id} href={btn.link} className={cls}>
                  {btn.label}
                </a>
              ) : (
                <Link key={btn.id} to={btn.link || '/'} className={cls}>
                  {btn.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Navigation arrows ── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/15 hover:bg-white/30 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/15 hover:bg-white/30 border border-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105"
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* ── Dot indicators ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2.5 bg-brand-400'
                  : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-0.5 h-8 bg-white/30 animate-pulse rounded-full" />
      </div>
    </section>
  );
}
