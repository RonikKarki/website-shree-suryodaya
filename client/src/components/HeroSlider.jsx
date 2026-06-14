import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';
import HeroParticles from './HeroParticles';

const TRUST_BADGES = [
  '✓ ISO Certified Quality',
  '🌾 100% Natural Processing',
  '🏆 15+ Years of Excellence',
  '📦 50 MT Daily Capacity',
];

const FALLBACK_GRADIENTS = [
  'from-sage-800 via-sage-900 to-ink-900',
  'from-ink-700 via-sage-800 to-ink-900',
  'from-sage-700 via-ink-800 to-sage-900',
];

export default function HeroSlider({ slides = [], buttons = [], autoplayInterval = 5000 }) {
  const [current, setCurrent]           = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused]             = useState(false);
  const timerRef                        = useRef(null);

  const goTo = useCallback((index) => {
    if (transitioning || slides.length <= 1 || index === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 350);
  }, [transitioning, slides.length, current]);

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
      className="relative min-h-screen bg-sand-100 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Particle canvas — sits at z-0 behind everything ──────── */}
      <HeroParticles />

      {/* ── Background decoratives ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gold-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-sage-200/12 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #C8A86B 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        {/* Decorative large text */}
        <div className="absolute right-0 bottom-8 overflow-hidden pointer-events-none select-none hidden xl:block">
          <span className="font-heading font-black text-[18vw] text-ink-900/[0.028] leading-none pr-4 whitespace-nowrap">
            RICE
          </span>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 lg:pt-28 pb-16" style={{ zIndex: 2 }}>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[calc(100vh-6rem)]">

          {/* LEFT — Content ────────────────────────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-5 order-2 lg:order-1">
            {/* Tag badge */}
            <div className={`inline-flex items-center gap-2 bg-gold-100 border border-gold-300 text-gold-700 text-xs font-semibold px-4 py-2 rounded-full mb-7 transition-all duration-500 ${
              transitioning ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
              {slide.tag || "Nepal's Premium Rice Mill · Since 2009"}
            </div>

            {/* Headline */}
            <h1 className={`font-heading font-bold text-ink-900 leading-[1.05] mb-6 text-5xl md:text-6xl lg:text-5xl xl:text-6xl transition-all duration-500 delay-75 ${
              transitioning ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}>
              {slide.title?.split('\n').map((line, i) => (
                <span key={i} className={`block ${i > 0 ? 'text-gold-600 italic' : ''}`}>{line}</span>
              )) || <span>Premium Quality<br /><span className="text-gold-600 italic">Rice, Milled with Pride</span></span>}
            </h1>

            {/* Subtitle */}
            {slide.subtitle && (
              <p className={`text-ink-500 text-base md:text-lg leading-relaxed mb-9 max-w-md transition-all duration-500 delay-150 ${
                transitioning ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
              }`}>
                {slide.subtitle}
              </p>
            )}

            {/* CTA Buttons */}
            {buttons.length > 0 && (
              <div className={`flex flex-wrap gap-4 mb-10 transition-all duration-500 delay-200 ${
                transitioning ? 'opacity-0' : 'opacity-100'
              }`}>
                {buttons.map((btn, i) => {
                  const isExternal = btn.link?.startsWith('tel:') || btn.link?.startsWith('mailto:') || btn.link?.startsWith('http');
                  const cls = i === 0
                    ? 'btn-primary text-sm px-8 py-4 shadow-lg shadow-sage-600/15'
                    : 'btn-outline text-sm px-8 py-4';
                  return isExternal
                    ? <a key={btn.id} href={btn.link} className={cls}>{btn.label}{i === 0 && <FaArrowRight className="text-xs" />}</a>
                    : <Link key={btn.id} to={btn.link || '/'} className={cls}>{btn.label}{i === 0 && <FaArrowRight className="text-xs" />}</Link>;
                })}
              </div>
            )}

            {/* Trust badges */}
            <div className={`transition-all duration-500 delay-300 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {TRUST_BADGES.map((badge) => (
                  <span key={badge} className="text-ink-500 text-[13px] font-medium">{badge}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Image card + floating stats ─────────────────── */}
          <div className="lg:col-span-7 xl:col-span-7 order-1 lg:order-2 relative">
            {/* Main image */}
            <div
              className={`relative rounded-3xl overflow-hidden shadow-2xl shadow-ink-900/15 transition-all duration-500 ${
                transitioning ? 'opacity-90 scale-[0.99]' : 'opacity-100 scale-100'
              }`}
              style={{ height: 'min(600px, calc(100vh - 220px))' }}
            >
              {slide.image ? (
                <img
                  src={resolveUrl(slide.image)}
                  alt={slide.title || 'Rice Mill'}
                  className="w-full h-full object-cover animate-ken-burns"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${FALLBACK_GRADIENTS[current % FALLBACK_GRADIENTS.length]} flex items-center justify-center`}>
                  <span className="text-[120px] select-none leading-none opacity-10">🌾</span>
                </div>
              )}

              {/* Subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/30 via-transparent to-transparent" />

              {/* ── Floating stat cards (2 only — rest live in the stats section) ── */}
              {/* Top-left: Heritage */}
              <div className="absolute top-5 left-5 animate-float" style={{ animationDelay: '0s' }}>
                <div className="bg-gold-500 rounded-2xl px-4 py-3 shadow-xl min-w-[110px]">
                  <div className="font-heading font-bold text-2xl text-white leading-none">15+</div>
                  <div className="text-white/80 text-xs font-medium mt-0.5">Years Expert</div>
                </div>
              </div>

              {/* Bottom-right: Scale */}
              <div className="absolute bottom-5 right-5 animate-float" style={{ animationDelay: '1s' }}>
                <div className="glass-card rounded-2xl px-4 py-3 shadow-xl min-w-[120px] border border-sand-300/50">
                  <div className="font-heading font-bold text-2xl text-ink-900 leading-none">50 MT</div>
                  <div className="text-ink-500 text-xs font-medium mt-0.5">Daily Capacity</div>
                </div>
              </div>
            </div>

            {/* Side accent */}
            <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-28 bg-gold-300/20 rounded-l-2xl hidden lg:block" />
            {/* Bottom shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-ink-900/8 blur-2xl rounded-full" />
          </div>
        </div>

        {/* ── Slide controls ── */}
        {slides.length > 1 && (
          <div className="flex items-center gap-3 mt-8 lg:mt-0 lg:absolute lg:bottom-8 lg:left-8">
            <button onClick={prev}
              className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-ink-500 hover:border-gold-400 hover:text-gold-600 transition-all">
              <FaChevronLeft className="text-xs" />
            </button>
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-sand-400 hover:bg-gold-400'
                  }`}
                />
              ))}
            </div>
            <button onClick={next}
              className="w-9 h-9 rounded-full border border-sand-300 flex items-center justify-center text-ink-500 hover:border-gold-400 hover:text-gold-600 transition-all">
              <FaChevronRight className="text-xs" />
            </button>
            <span className="text-ink-400 text-xs ml-2 font-medium">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
