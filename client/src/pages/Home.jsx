import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar, FaQuoteLeft, FaWhatsapp, FaPhone, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import useSEO from '../hooks/useSEO';
import BrandCard from '../components/BrandCard';
import resolveUrl from '../lib/resolveUrl';
import HeroSlider from '../components/HeroSlider';
import StatCounter from '../components/StatCounter';
import ProductCard from '../components/ProductCard';
import SectionReveal from '../components/SectionReveal';
import EmojiIcon from '../lib/iconMap';

// ── Ticker ────────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '🌾 Premium Quality Rice',
  '✦ Since 2009 · Gaindakot, Nepal',
  '✦ 50 MT Daily Milling Capacity',
  '✦ 10,000+ Satisfied Customers',
  '✦ Modern Optical Sorting Technology',
  '✦ 100% Natural Processing',
  '✦ Wholesale & Retail Supply',
  '🌾 Nepal\'s Finest Rice Mill',
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="bg-ink-900 py-3.5 marquee-outer overflow-hidden border-b border-white/5">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center text-white/80 text-[13px] font-medium tracking-wide mx-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Gallery Bento item ────────────────────────────────────────────────────────
function BentoItem({ src, caption, className = '' }) {
  return (
    <div className={`relative group overflow-hidden rounded-2xl bg-sand-300 ${className}`}>
      {src ? (
        <img src={resolveUrl(src)} alt={caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-sage-100 to-sand-200 flex items-center justify-center">
          <span className="text-4xl opacity-30 select-none">🌾</span>
        </div>
      )}
      <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/25 transition-all duration-400" />
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <p className="text-white text-sm font-medium">{caption}</p>
        </div>
      )}
    </div>
  );
}

const ctaBgMap = {
  green: 'bg-sage-900',
  gold:  'bg-gradient-to-br from-gold-600 to-gold-700',
  dark:  'bg-ink-900',
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useSEO({ description: 'Shree Suryodaya Khadya Udhyog Limited — Premium rice milling in Gaindakot, Nawalpur. Finest quality rice milled with pride since 2009.' });

  const [content, setContent]           = useState(null);
  const [products, setProducts]         = useState([]);
  const [settings, setSettings]         = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands]             = useState([]);
  const [loading, setLoading]           = useState(true);

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
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand-100">
        <div className="text-center">
          <div className="w-14 h-14 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ink-400 text-sm tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!content) return null;

  const { hero, companyIntro, whyChooseUs, process, featuredProducts, stats, gallery, brandsSection, testimonialsSection, cta } = content;
  const displayedProducts  = products.slice(0, featuredProducts?.limit || 3);
  const whatsappNumber     = settings.whatsappNumber || '';

  return (
    <>
      {/* ── HERO ── */}
      <HeroSlider slides={hero?.slides || []} buttons={hero?.buttons || []} autoplayInterval={hero?.autoplayInterval || 5000} />

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── COMPANY INTRO ── */}
      {companyIntro && (
        <section className="section-pad bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

              <SectionReveal direction="left">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{companyIntro.sectionTag || 'Who We Are'}</span>
                </div>
                <h2 className="section-title mb-6">{companyIntro.title}</h2>
                <div className="space-y-4 text-ink-500 leading-relaxed text-[17px]">
                  {companyIntro.description?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {companyIntro.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 mt-7">
                    {companyIntro.highlights.map((h) => (
                      <div key={h.id} className="flex items-center gap-2 bg-sand-100 border border-sand-300 rounded-full px-4 py-2 text-sm font-medium text-ink-700">
                        <span>{h.icon}</span> {h.text}
                      </div>
                    ))}
                  </div>
                )}
                {companyIntro.ctaLabel && (
                  <div className="mt-8">
                    <Link to={companyIntro.ctaLink || '/about'} className="btn-primary group">
                      {companyIntro.ctaLabel}
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </SectionReveal>

              <SectionReveal direction="right" delay={100}>
                <div className="relative">
                  {/* Large year decoration */}
                  <div className="absolute -top-8 -right-4 font-heading font-black text-[10rem] text-ink-900/[0.04] leading-none select-none pointer-events-none z-0">
                    2009
                  </div>
                  <div className="relative z-10 grid grid-cols-2 gap-4">
                    {companyIntro.images?.[0] ? (
                      <div className="col-span-2 rounded-2xl overflow-hidden h-64 shadow-lg">
                        <img src={resolveUrl(companyIntro.images[0])} alt="Company" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="col-span-2 rounded-2xl h-64 overflow-hidden shadow-lg bg-gradient-to-br from-sage-700 to-sage-900 flex items-center justify-center">
                        <div className="text-center text-white/25 select-none">
                          <div className="text-8xl mb-2">🌾</div>
                          <p className="font-heading text-xl italic">"Quality in Every Grain"</p>
                        </div>
                      </div>
                    )}
                    {companyIntro.images?.[1] ? (
                      <div className="rounded-2xl overflow-hidden h-44 shadow-md">
                        <img src={resolveUrl(companyIntro.images[1])} alt="Mill" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-sage-100 border border-sage-200 h-44 flex flex-col items-center justify-center">
                        <span className="text-3xl mb-2">🏭</span>
                        <p className="text-sage-700 text-sm font-semibold">Modern Mill</p>
                        <p className="text-sage-500 text-xs">50 MT/day</p>
                      </div>
                    )}
                    <div className="rounded-2xl bg-gold-500 h-44 flex flex-col items-center justify-center shadow-md">
                      <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Established</p>
                      <p className="font-heading font-bold text-white text-5xl leading-none">2009</p>
                      <div className="w-8 h-px bg-white/30 my-2" />
                      <p className="text-white/60 text-xs">Gaindakot, Nepal</p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── STATS ── */}
      {stats?.items?.length > 0 && (
        <StatCounter items={stats.items} backgroundStyle={stats.backgroundStyle} sectionTag={stats.sectionTag} title={stats.title} subtitle={stats.subtitle} />
      )}

      {/* ── WHY CHOOSE US ── */}
      {whyChooseUs?.items?.length > 0 && (
        <section className="section-pad bg-sand-200 overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold-300/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="mb-14 max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">{whyChooseUs.sectionTag || 'Our Advantages'}</span>
              </div>
              <h2 className="section-title mb-4">{whyChooseUs.title}</h2>
              {whyChooseUs.subtitle && <p className="section-subtitle">{whyChooseUs.subtitle}</p>}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whyChooseUs.items.map((item, i) => (
                <SectionReveal key={item.id} delay={i * 60}>
                  <div className="group bg-white rounded-2xl p-7 border border-sand-300 hover:border-gold-400 hover:shadow-lg transition-all duration-400 h-full">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="font-heading font-bold text-gold-400/50 text-4xl leading-none group-hover:text-gold-500/70 transition-colors select-none">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <EmojiIcon emoji={item.icon} className="w-7 h-7 text-gold-500 mt-1" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading font-bold text-ink-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-ink-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ── */}
      {process?.steps?.length > 0 && (
        <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">{process.sectionTag || 'How We Work'}</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="section-title mx-auto">{process.title}</h2>
              {process.subtitle && <p className="section-subtitle mt-4 mx-auto text-center">{process.subtitle}</p>}
            </SectionReveal>

            <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Connector line on desktop */}
              <div className="hidden lg:block absolute top-12 left-[calc(100%/6)] right-[calc(100%/6)] h-px bg-gradient-to-r from-transparent via-sand-300 to-transparent" />

              {process.steps.map((step, i) => (
                <SectionReveal key={step.id} delay={i * 80}>
                  <div className="group text-center relative">
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className="w-full h-full rounded-full bg-sand-100 border-2 border-sand-300 group-hover:border-gold-400 flex items-center justify-center transition-all duration-300 shadow-sm">
                        <EmojiIcon emoji={step.icon} className="w-9 h-9 text-gold-600" strokeWidth={1.5} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="font-heading font-bold text-white text-xs">{step.step}</span>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-ink-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-ink-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ── */}
      {displayedProducts.length > 0 && (
        <section className="section-pad bg-sand-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{featuredProducts?.sectionTag || 'Our Products'}</span>
                </div>
                <h2 className="section-title">{featuredProducts?.title || 'Featured Rice Varieties'}</h2>
                {featuredProducts?.subtitle && <p className="section-subtitle mt-3">{featuredProducts.subtitle}</p>}
              </div>
              <Link to={featuredProducts?.ctaLink || '/products'}
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold text-sm transition-colors group flex-shrink-0">
                {featuredProducts?.ctaLabel || 'View All Products'}
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {displayedProducts.map((product, i) => (
                <SectionReveal key={product._id} delay={i * 80}>
                  <ProductCard product={product} whatsappNumber={whatsappNumber} brands={brands} compactMode />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRANDS ── */}
      {brandsSection?.isVisible !== false && brands.length > 0 && (
        <section className="section-pad-sm bg-white border-t border-sand-300">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">{brandsSection?.sectionTag || 'Our Brands'}</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-ink-900">{brandsSection?.title || 'Our Trusted Brands'}</h2>
              {brandsSection?.subtitle && <p className="section-subtitle mt-3 mx-auto text-center">{brandsSection.subtitle}</p>}
            </SectionReveal>
            <div className={`grid gap-7 ${brands.length === 1 ? 'max-w-sm mx-auto' : brands.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {brands.map((brand, i) => (
                <SectionReveal key={brand._id} delay={i * 80}>
                  <BrandCard brand={brand} />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {gallery?.images?.length > 0 && (
        <section className="section-pad bg-sand-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{gallery.sectionTag || 'Gallery'}</span>
                </div>
                <h2 className="section-title">{gallery.title}</h2>
                {gallery.subtitle && <p className="section-subtitle mt-3">{gallery.subtitle}</p>}
              </div>
              <Link to={gallery.ctaLink || '/gallery'}
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-semibold text-sm transition-colors group flex-shrink-0">
                {gallery.ctaLabel || 'View All Photos'}
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </Link>
            </SectionReveal>

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
                      className={i === 0 ? 'row-span-2' : i === 3 ? 'col-span-2 md:col-span-1' : ''}
                    />
                  ))}
                </div>
              )}
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonialsSection?.isVisible !== false && testimonials.length > 0 && (
        <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">{testimonialsSection?.sectionTag || 'Testimonials'}</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="section-title mx-auto">{testimonialsSection?.title || 'What Our Customers Say'}</h2>
              {testimonialsSection?.subtitle && <p className="section-subtitle mt-4 mx-auto text-center">{testimonialsSection.subtitle}</p>}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => (
                <SectionReveal key={t._id} delay={i * 60}>
                  <div className="group bg-sand-100 border border-sand-300 hover:border-gold-400 rounded-2xl p-7 h-full flex flex-col transition-all duration-400 hover:shadow-lg">
                    <FaQuoteLeft className="text-gold-400/40 text-3xl mb-5" />
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map((n) => (
                        <FaStar key={n} className={`text-xs ${n <= t.rating ? 'text-gold-400' : 'text-sand-300'}`} />
                      ))}
                    </div>
                    <p className="text-ink-600 text-sm leading-relaxed flex-1 mb-6 italic">"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-5 border-t border-sand-300">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gold-100 border border-gold-200 flex items-center justify-center flex-shrink-0">
                        {t.avatar ? (
                          <img src={resolveUrl(t.avatar)} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gold-600 font-bold text-sm">{t.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-ink-900 text-sm">{t.name}</p>
                        {(t.role || t.company) && (
                          <p className="text-ink-400 text-xs">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
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

      {/* ── CTA ── */}
      {cta && (
        <section className={`relative ${ctaBgMap[cta.backgroundStyle] || ctaBgMap.dark} grain-overlay overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/3 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <SectionReveal direction="left">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.25em]">Get In Touch</span>
                </div>
                <h2 className="section-title-light mb-5">{cta.title}</h2>
                {cta.subtitle && <p className="section-subtitle-light mb-10">{cta.subtitle}</p>}
                <div className="flex flex-wrap gap-4">
                  {cta.buttons?.map((btn) => {
                    const isExternal = btn.link?.startsWith('tel:') || btn.link?.startsWith('mailto:') || btn.link?.startsWith('http');
                    const cls = btn.variant === 'secondary'
                      ? 'btn-gold shadow-lg'
                      : btn.variant === 'outline'
                      ? 'btn-outline-light'
                      : 'inline-flex items-center gap-2 bg-white text-ink-900 hover:bg-sand-100 font-semibold px-7 py-3.5 rounded-full transition-all duration-300 shadow-lg text-sm';
                    return isExternal
                      ? <a key={btn.id} href={btn.link} className={cls}>{btn.label}</a>
                      : <Link key={btn.id} to={btn.link || '/contact'} className={cls}>{btn.label}</Link>;
                  })}
                </div>
              </SectionReveal>

              <SectionReveal direction="right" delay={120}>
                <div className="bg-white/8 border border-white/12 rounded-2xl p-8 backdrop-blur-sm">
                  <h3 className="font-heading font-bold text-white text-xl mb-6">Visit Our Mill</h3>
                  <div className="space-y-5 mb-8">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 bg-gold-500/15 border border-gold-500/25 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-base">📍</span>
                      </div>
                      <div className="pt-1">
                        <p className="text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Address</p>
                        <p className="text-white text-sm">Gaindakot, Nawalpur<br/>Gandaki Province, Nepal</p>
                      </div>
                    </div>
                    {settings.phoneNumber && (
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-gold-500/15 border border-gold-500/25 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FaPhone className="text-gold-400 text-xs" />
                        </div>
                        <div>
                          <p className="text-white/35 text-[11px] uppercase tracking-wider mb-0.5">Phone</p>
                          <a href={`tel:${settings.phoneNumber}`} className="text-white hover:text-gold-300 text-sm transition-colors">{settings.phoneNumber}</a>
                        </div>
                      </div>
                    )}
                  </div>
                  {whatsappNumber && whatsappNumber !== '977XXXXXXXXXX' && (
                    <a
                      href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsappDefaultMessage || 'Hello! I am interested in your rice products.')}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md"
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
