import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaQuoteLeft, FaWhatsapp, FaLeaf, FaPhone } from 'react-icons/fa';
import axios from 'axios';
import useSEO from '../hooks/useSEO';
import BrandCard from '../components/BrandCard';
import resolveUrl from '../lib/resolveUrl';
import HeroSlider from '../components/HeroSlider';
import StatCounter from '../components/StatCounter';
import ProductCard from '../components/ProductCard';
import SectionReveal from '../components/SectionReveal';

// ── Marquee ticker ────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '🌾 Premium Quality Rice',
  '✦ 50 MT Daily Capacity',
  '✦ Since 2009',
  '✦ Gaindakot, Nawalpur',
  '✦ Optical Sorting Technology',
  '✦ Nepal\'s Finest Mill',
  '✦ Trusted Across Nepal',
  '🌾 Milled with Pride',
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-gold-500 py-3 marquee-outer overflow-hidden">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-white font-semibold text-sm tracking-wide mx-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Bento gallery item ─────────────────────────────────────────────────────────
function BentoItem({ src, caption, className = '' }) {
  return (
    <div className={`relative group overflow-hidden rounded-2xl bg-gray-200 ${className}`}>
      {src ? (
        <img src={resolveUrl(src)} alt={caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-forest-800 to-charcoal-900 flex items-center justify-center">
          <FaLeaf className="text-forest-400 text-4xl opacity-40" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-white text-sm font-medium">{caption}</p>
        </div>
      )}
    </div>
  );
}

// ── CTA bg map ────────────────────────────────────────────────────────────────
const ctaBgMap = {
  green: 'bg-[#0D1B0E]',
  gold:  'bg-gradient-to-r from-gold-600 to-gold-500',
  dark:  'bg-charcoal-900',
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function Home() {
  useSEO({ description: 'Shree Suryodaya Khadya Udhyog Limited — Premium rice milling in Gaindakot, Nawalpur. Finest quality rice milled with pride. Trusted across Nepal since 2009.' });

  const [content, setContent]         = useState(null);
  const [products, setProducts]       = useState([]);
  const [settings, setSettings]       = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands]           = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/homepage'),
      axios.get('/api/products'),
      axios.get('/api/settings'),
      axios.get('/api/testimonials'),
      axios.get('/api/brands'),
    ]).then(([hpRes, prodRes, settingsRes, testRes, brandRes]) => {
      setContent(hpRes.data.data);
      setProducts(prodRes.data.data || []);
      setSettings(settingsRes.data.data || {});
      setTestimonials(testRes.data.data || []);
      setBrands(brandRes.data.data || []);
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-900">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!content) return null;

  const { hero, companyIntro, whyChooseUs, process, featuredProducts, stats, gallery, brandsSection, testimonialsSection, cta } = content;
  const displayedProducts = products.slice(0, featuredProducts?.limit || 3);
  const whatsappNumber = settings.whatsappNumber || '';

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <HeroSlider slides={hero?.slides || []} buttons={hero?.buttons || []} autoplayInterval={hero?.autoplayInterval || 5000} />

      {/* ── TICKER ───────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── COMPANY INTRO ────────────────────────────────────────────────── */}
      {companyIntro && (
        <section className="section-pad bg-cream-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* Left — editorial text */}
              <SectionReveal>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{companyIntro.sectionTag || 'Who We Are'}</span>
                </div>

                <h2 className="font-heading font-bold text-charcoal-900 text-4xl md:text-5xl leading-[1.1] mb-6">
                  {companyIntro.title}
                </h2>

                {companyIntro.description?.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4 text-base">{para}</p>
                ))}

                {companyIntro.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-6 mb-8">
                    {companyIntro.highlights.map((h) => (
                      <span key={h.id} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
                        <span>{h.icon}</span> {h.text}
                      </span>
                    ))}
                  </div>
                )}

                {companyIntro.ctaLabel && (
                  <Link to={companyIntro.ctaLink || '/about'} className="btn-dark group">
                    {companyIntro.ctaLabel}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                  </Link>
                )}
              </SectionReveal>

              {/* Right — image mosaic */}
              <SectionReveal delay={150}>
                <div className="relative">
                  {/* Large "2009" decorative number */}
                  <div className="absolute -top-6 -right-4 font-heading font-bold text-[120px] text-charcoal-900/[0.04] leading-none select-none pointer-events-none z-0">
                    2009
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-4">
                    {companyIntro.images?.[0] ? (
                      <div className="col-span-2 rounded-2xl overflow-hidden h-60 shadow-lg">
                        <img src={resolveUrl(companyIntro.images[0])} alt="Company" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="col-span-2 rounded-2xl bg-charcoal-900 h-60 flex items-center justify-center shadow-lg overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-forest-800 to-charcoal-900" />
                        <div className="relative text-center text-white p-6">
                          <div className="text-5xl mb-3">🌾</div>
                          <p className="font-heading font-bold text-xl italic">"Quality in Every Grain"</p>
                        </div>
                      </div>
                    )}

                    {companyIntro.images?.[1] ? (
                      <div className="rounded-2xl overflow-hidden h-44 shadow-md">
                        <img src={resolveUrl(companyIntro.images[1])} alt="Mill" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-forest-800 h-44 flex flex-col items-center justify-center shadow-md">
                        <div className="text-3xl mb-2">🏭</div>
                        <p className="text-forest-100 text-sm font-semibold">Modern Mill</p>
                        <p className="text-forest-300 text-xs">50 MT/day</p>
                      </div>
                    )}

                    {/* Est. card */}
                    <div className="rounded-2xl bg-gold-500 h-44 flex flex-col items-center justify-center shadow-lg">
                      <p className="text-white/80 text-xs uppercase tracking-widest mb-1">Established</p>
                      <p className="font-heading font-bold text-white text-5xl leading-none">2009</p>
                      <div className="w-8 h-0.5 bg-white/40 my-2" />
                      <p className="text-white/70 text-xs tracking-wide">Gaindakot, Nepal</p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      {whyChooseUs?.items?.length > 0 && (
        <section className="section-pad bg-charcoal-900 grain-overlay relative overflow-hidden">
          {/* Faded background text */}
          <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none select-none">
            <span className="font-heading font-bold text-[15vw] text-white/[0.025] leading-none whitespace-nowrap pl-8">
              WHY CHOOSE US
            </span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">
                  {whyChooseUs.sectionTag || 'Our Advantages'}
                </span>
              </div>
              <h2 className="section-title-light max-w-2xl">{whyChooseUs.title}</h2>
              {whyChooseUs.subtitle && (
                <p className="section-subtitle-light">{whyChooseUs.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.items.map((item, i) => (
                <SectionReveal key={item.id} delay={i * 60}>
                  <div className="group border border-white/8 hover:border-gold-500/40 rounded-2xl p-7 transition-all duration-400 h-full bg-white/[0.02] hover:bg-white/[0.05]">
                    <div className="flex items-start gap-4 mb-4">
                      <span className="font-heading font-bold text-gold-500/30 text-4xl leading-none group-hover:text-gold-500/60 transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-3xl mt-1">{item.icon}</span>
                    </div>
                    <h3 className="font-heading font-bold text-white text-lg mb-2">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">{item.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      {process?.steps?.length > 0 && (
        <section className="section-pad bg-cream-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">{process.sectionTag || 'How We Work'}</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="section-title mx-auto">{process.title}</h2>
              {process.subtitle && <p className="section-subtitle mx-auto">{process.subtitle}</p>}
            </SectionReveal>

            <div className="relative">
              {/* Connecting line (desktop) */}
              <div className="hidden lg:block absolute top-12 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent" />

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {process.steps.map((step, i) => (
                  <SectionReveal key={step.id} delay={i * 80}>
                    <div className="group text-center relative">
                      {/* Step circle */}
                      <div className="relative mx-auto w-24 h-24 mb-6">
                        <div className="w-full h-full rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                          <span className="text-3xl">{step.icon}</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
                          <span className="font-heading font-bold text-white text-xs">{step.step}</span>
                        </div>
                      </div>
                      <h3 className="font-heading font-bold text-charcoal-900 text-lg mb-2">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      {displayedProducts.length > 0 && (
        <section className="section-pad bg-charcoal-900 grain-overlay relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">
                    {featuredProducts?.sectionTag || 'Our Products'}
                  </span>
                </div>
                <h2 className="section-title-light">{featuredProducts?.title || 'Featured Rice'}</h2>
                {featuredProducts?.subtitle && <p className="section-subtitle-light">{featuredProducts.subtitle}</p>}
              </div>
              <Link to={featuredProducts?.ctaLink || '/products'}
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium text-sm transition-colors group flex-shrink-0">
                {featuredProducts?.ctaLabel || 'View All'} <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
              </Link>
            </SectionReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {displayedProducts.map((product, i) => (
                <SectionReveal key={product._id} delay={i * 100}>
                  <ProductCard product={product} whatsappNumber={whatsappNumber} brands={brands} compactMode />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRANDS ───────────────────────────────────────────────────────── */}
      {brandsSection?.isVisible !== false && brands.length > 0 && (
        <section className="section-pad-sm bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">{brandsSection?.sectionTag || 'Our Brands'}</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-charcoal-900">{brandsSection?.title || 'Our Brands'}</h2>
              {brandsSection?.subtitle && <p className="section-subtitle mx-auto mt-3">{brandsSection.subtitle}</p>}
            </SectionReveal>

            <div className={`grid gap-8 ${brands.length === 1 ? 'max-w-sm mx-auto' : brands.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {brands.map((brand, i) => (
                <SectionReveal key={brand._id} delay={i * 100}>
                  <BrandCard brand={brand} />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATISTICS ───────────────────────────────────────────────────── */}
      {stats?.items?.length > 0 && (
        <StatCounter items={stats.items} backgroundStyle={stats.backgroundStyle} sectionTag={stats.sectionTag} title={stats.title} subtitle={stats.subtitle} />
      )}

      {/* ── GALLERY (BENTO) ──────────────────────────────────────────────── */}
      {gallery?.images?.length > 0 && (
        <section className="section-pad bg-cream-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{gallery.sectionTag || 'Gallery'}</span>
                </div>
                <h2 className="section-title">{gallery.title}</h2>
                {gallery.subtitle && <p className="section-subtitle">{gallery.subtitle}</p>}
              </div>
              <Link to={gallery.ctaLink || '/gallery'}
                className="inline-flex items-center gap-2 text-charcoal-900 hover:text-gold-600 font-medium text-sm transition-colors group flex-shrink-0">
                {gallery.ctaLabel || 'View All Photos'} <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
              </Link>
            </SectionReveal>

            {/* Bento grid layout */}
            <SectionReveal>
              {gallery.images.length === 1 && (
                <div className="h-80 w-full">
                  <BentoItem src={gallery.images[0]?.src} caption={gallery.images[0]?.caption} className="h-full" />
                </div>
              )}
              {gallery.images.length === 2 && (
                <div className="grid grid-cols-2 gap-4 h-80">
                  {gallery.images.slice(0, 2).map((img, i) => (
                    <BentoItem key={img.id || i} src={img.src} caption={img.caption} className="h-full" />
                  ))}
                </div>
              )}
              {gallery.images.length >= 3 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                  {gallery.images.slice(0, 6).map((img, i) => (
                    <BentoItem
                      key={img.id || i}
                      src={img.src}
                      caption={img.caption}
                      className={
                        i === 0 ? 'row-span-2 col-span-1 md:col-span-1' :
                        i === 3 ? 'col-span-2 md:col-span-1' : ''
                      }
                    />
                  ))}
                </div>
              )}
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      {testimonialsSection?.isVisible !== false && testimonials.length > 0 && (
        <section className="section-pad bg-[#0D1B0E] grain-overlay relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">
                  {testimonialsSection?.sectionTag || 'Testimonials'}
                </span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="section-title-light">
                {testimonialsSection?.title || 'What Our Customers Say'}
              </h2>
              {testimonialsSection?.subtitle && (
                <p className="section-subtitle-light mx-auto">{testimonialsSection.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => (
                <SectionReveal key={t._id} delay={i * 70}>
                  <div className="group relative border border-white/8 hover:border-gold-500/30 rounded-2xl p-7 transition-all duration-400 bg-white/[0.02] hover:bg-white/[0.05] h-full flex flex-col">
                    <FaQuoteLeft className="text-gold-500/20 text-4xl mb-5 group-hover:text-gold-500/40 transition-colors" />

                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map((n) => (
                        <FaStar key={n} className={`text-xs ${n <= t.rating ? 'text-gold-400' : 'text-white/10'}`} />
                      ))}
                    </div>

                    <p className="text-white/60 text-sm leading-relaxed flex-1 mb-6 italic">"{t.content}"</p>

                    <div className="flex items-center gap-3 pt-5 border-t border-white/8">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-forest-800 flex items-center justify-center flex-shrink-0">
                        {t.avatar ? (
                          <img src={resolveUrl(t.avatar)} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gold-300 font-bold text-sm">{t.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{t.name}</p>
                        {(t.role || t.company) && (
                          <p className="text-white/35 text-xs">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CALL TO ACTION ───────────────────────────────────────────────── */}
      {cta && (
        <section className={`${ctaBgMap[cta.backgroundStyle] || ctaBgMap.green} relative overflow-hidden grain-overlay`}>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              {/* Left — heading */}
              <SectionReveal>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">Get In Touch</span>
                </div>
                <h2 className="font-heading font-bold text-white text-4xl md:text-5xl leading-[1.1] mb-5">
                  {cta.title}
                </h2>
                {cta.subtitle && (
                  <p className="text-white/60 text-lg mb-10 leading-relaxed max-w-md">{cta.subtitle}</p>
                )}
                <div className="flex flex-wrap gap-4">
                  {cta.buttons?.map((btn) => {
                    const isExternal = btn.link?.startsWith('tel:') || btn.link?.startsWith('mailto:') || btn.link?.startsWith('http');
                    const cls = btn.variant === 'secondary'
                      ? 'inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-lg hover:-translate-y-0.5'
                      : btn.variant === 'outline'
                      ? 'btn-outline'
                      : 'inline-flex items-center gap-2 bg-white text-charcoal-900 hover:bg-cream-200 font-semibold px-7 py-3 rounded-full text-sm transition-all duration-300 shadow-lg hover:-translate-y-0.5';
                    return isExternal
                      ? <a key={btn.id} href={btn.link} className={cls}>{btn.label}</a>
                      : <Link key={btn.id} to={btn.link || '/contact'} className={cls}>{btn.label}</Link>;
                  })}
                </div>
              </SectionReveal>

              {/* Right — info card */}
              <SectionReveal delay={150}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                  <h3 className="font-heading font-bold text-white text-xl mb-6">Visit Our Mill</h3>

                  <div className="space-y-5 mb-8">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-lg">📍</span>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Address</p>
                        <p className="text-white text-sm">Gaindakot, Nawalpur<br/>Gandaki Province, Nepal</p>
                      </div>
                    </div>

                    {settings.phoneNumber && (
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaPhone className="text-gold-400 text-sm" />
                        </div>
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                          <a href={`tel:${settings.phoneNumber}`} className="text-white hover:text-gold-300 text-sm transition-colors">{settings.phoneNumber}</a>
                        </div>
                      </div>
                    )}
                  </div>

                  {whatsappNumber && whatsappNumber !== '977XXXXXXXXXX' && (
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsappDefaultMessage || 'Hello! I am interested in your rice products.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all duration-300 shadow-lg"
                    >
                      <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                    </a>
                  )}
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
