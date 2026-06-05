import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle, FaPhone, FaMapMarkerAlt, FaStar, FaQuoteLeft, FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import useSEO from '../hooks/useSEO';
import BrandCard from '../components/BrandCard';

import HeroSlider from '../components/HeroSlider';
import StatCounter from '../components/StatCounter';
import ProductCard from '../components/ProductCard';
import SectionReveal from '../components/SectionReveal';

// ─── Gallery item ─────────────────────────────────────────────────────────────
const galleryColors = [
  'from-forest-100 to-forest-200',
  'from-amber-50 to-yellow-100',
  'from-blue-50 to-sky-100',
  'from-purple-50 to-pink-50',
  'from-teal-50 to-green-100',
  'from-orange-50 to-amber-100',
];

function GalleryItem({ src, caption, index }) {
  return (
    <div className="relative group overflow-hidden rounded-2xl aspect-square shadow-sm hover:shadow-lg transition-all duration-300">
      {src ? (
        <img
          src={src}
          alt={caption || ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className={`w-full h-full bg-gradient-to-br ${galleryColors[index % galleryColors.length]} flex items-center justify-center`}>
          <span className="text-5xl opacity-40">🏭</span>
        </div>
      )}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-sm font-medium">{caption}</p>
        </div>
      )}
    </div>
  );
}

// ─── CTA section background ───────────────────────────────────────────────────
const ctaBgMap = {
  green: 'bg-gradient-to-r from-forest-800 to-forest-900',
  gold:  'bg-gradient-to-r from-brand-600 to-brand-700',
  dark:  'bg-gradient-to-r from-earth-800 to-earth-900',
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  useSEO({ description: 'Shree Suryodaya Khadya Udhyog Limited — Premium rice milling in Gaindakot, Nawalpur. Finest quality Basmati, Katarni, Jeera Masino, Sona Mansuli and more. Trusted across Nepal since 2009.' });
  const [content, setContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hpRes, prodRes, settingsRes, testRes, brandRes] = await Promise.all([
          axios.get('/api/homepage'),
          axios.get('/api/products'),
          axios.get('/api/settings'),
          axios.get('/api/testimonials'),
          axios.get('/api/brands'),
        ]);
        setContent(hpRes.data.data);
        setProducts(prodRes.data.data || []);
        setSettings(settingsRes.data.data || {});
        setTestimonials(testRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-900">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-float">🌾</div>
          <p className="text-white/60 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) return null;

  const {
    hero, companyIntro, whyChooseUs, process,
    featuredProducts, stats, gallery, brandsSection, testimonialsSection, cta,
  } = content;

  const displayedProducts = products.slice(0, featuredProducts?.limit || 3);
  const whatsappNumber = settings.whatsappNumber || '977XXXXXXXXXX';

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <HeroSlider
        slides={hero?.slides || []}
        buttons={hero?.buttons || []}
        autoplayInterval={hero?.autoplayInterval || 5000}
      />

      {/* ── COMPANY INTRO ────────────────────────────────────────────────── */}
      {companyIntro && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-center">
              <SectionReveal>
                {companyIntro.sectionTag && (
                  <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-3">
                    {companyIntro.sectionTag}
                  </p>
                )}
                <h2 className="section-title">{companyIntro.title}</h2>
                {companyIntro.description?.split('\n\n').map((para, i) => (
                  <p key={i} className="text-gray-600 leading-relaxed mb-4">{para}</p>
                ))}
                {companyIntro.highlights?.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {companyIntro.highlights.map((h) => (
                      <li key={h.id} className="flex items-center gap-3 text-gray-700">
                        <span className="text-xl">{h.icon}</span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                )}
                {companyIntro.ctaLabel && (
                  <Link to={companyIntro.ctaLink || '/about'} className="btn-primary">
                    {companyIntro.ctaLabel} <FaArrowRight />
                  </Link>
                )}
              </SectionReveal>

              <SectionReveal delay={150}>
                <div className="grid grid-cols-2 gap-4">
                  {companyIntro.images?.[0] ? (
                    <img
                      src={companyIntro.images[0]}
                      alt="Company"
                      className="col-span-2 rounded-2xl object-cover h-56 w-full shadow-md"
                    />
                  ) : (
                    <div className="col-span-2 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 h-56 flex items-center justify-center shadow-md">
                      <div className="text-center text-white p-6">
                        <div className="text-6xl mb-3">🌾</div>
                        <p className="font-heading font-bold text-xl">"Quality in Every Grain"</p>
                      </div>
                    </div>
                  )}
                  {companyIntro.images?.[1] ? (
                    <img
                      src={companyIntro.images[1]}
                      alt="Company 2"
                      className="rounded-2xl object-cover h-40 w-full shadow-md"
                    />
                  ) : (
                    <div className="rounded-2xl bg-forest-50 border-2 border-forest-100 h-40 flex flex-col items-center justify-center">
                      <div className="text-4xl mb-2">🏭</div>
                      <p className="text-forest-700 text-sm font-semibold">Modern Mill</p>
                      <p className="text-forest-500 text-xs">50 MT/day</p>
                    </div>
                  )}
                  <div className="rounded-2xl bg-brand-500 h-40 flex flex-col items-center justify-center shadow-md">
                    <p className="text-forest-900 font-bold text-lg">Est.</p>
                    <p className="text-forest-900 font-bold text-5xl font-heading">2009</p>
                    <p className="text-forest-900 text-xs font-medium mt-1">Gaindakot, Nepal</p>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      {whyChooseUs?.items?.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {whyChooseUs.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  {whyChooseUs.sectionTag}
                </p>
              )}
              <h2 className="section-title">{whyChooseUs.title}</h2>
              {whyChooseUs.subtitle && (
                <p className="section-subtitle mx-auto">{whyChooseUs.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {whyChooseUs.items.map((item, i) => (
                <SectionReveal key={item.id} delay={i * 70}>
                  <div className="group bg-gray-50 hover:bg-forest-50 border border-transparent hover:border-forest-100 rounded-2xl p-7 transition-all duration-300 h-full">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="font-heading font-bold text-forest-800 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PROCESS ──────────────────────────────────────────────────────── */}
      {process?.steps?.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-forest-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {process.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  {process.sectionTag}
                </p>
              )}
              <h2 className="section-title">{process.title}</h2>
              {process.subtitle && (
                <p className="section-subtitle mx-auto">{process.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {process.steps.map((step, i) => (
                <SectionReveal key={step.id} delay={i * 80}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full relative overflow-hidden group">
                    <div className="absolute top-3 right-4 font-heading font-bold text-7xl text-gray-50 select-none group-hover:text-forest-50 transition-colors">
                      {step.step}
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 bg-forest-700 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-forest-600 transition-colors">
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      <h3 className="font-heading font-bold text-forest-800 mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                    {/* Step connector line */}
                    {i < process.steps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-3 w-6 h-0.5 bg-forest-200 z-10" />
                    )}
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      {displayedProducts.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {featuredProducts?.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  {featuredProducts.sectionTag}
                </p>
              )}
              <h2 className="section-title">{featuredProducts?.title}</h2>
              {featuredProducts?.subtitle && (
                <p className="section-subtitle mx-auto">{featuredProducts.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid md:grid-cols-3 gap-8">
              {displayedProducts.map((product, i) => (
                <SectionReveal key={product._id} delay={i * 100}>
                  <ProductCard product={product} whatsappNumber={whatsappNumber} brands={brands} compactMode />
                </SectionReveal>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to={featuredProducts?.ctaLink || '/products'}
                className="btn-primary"
              >
                {featuredProducts?.ctaLabel || 'View All Products'} <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── BRANDS ───────────────────────────────────────────────────────── */}
      {brandsSection?.isVisible !== false && brands.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {brandsSection?.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  {brandsSection.sectionTag}
                </p>
              )}
              <h2 className="section-title">{brandsSection?.title || 'Our Brands'}</h2>
              {brandsSection?.subtitle && (
                <p className="section-subtitle mx-auto">{brandsSection.subtitle}</p>
              )}
            </SectionReveal>

            <div className={`grid gap-8 ${brands.length === 1 ? 'max-w-sm mx-auto' : brands.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {brands.map((brand, i) => (
                <SectionReveal key={brand._id} delay={i * 120}>
                  <BrandCard brand={brand} />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATISTICS ───────────────────────────────────────────────────── */}
      {stats?.items?.length > 0 && (
        <StatCounter
          items={stats.items}
          backgroundStyle={stats.backgroundStyle}
          sectionTag={stats.sectionTag}
          title={stats.title}
          subtitle={stats.subtitle}
        />
      )}

      {/* ── FACTORY GALLERY ──────────────────────────────────────────────── */}
      {gallery?.images?.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {gallery.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  {gallery.sectionTag}
                </p>
              )}
              <h2 className="section-title">{gallery.title}</h2>
              {gallery.subtitle && (
                <p className="section-subtitle mx-auto">{gallery.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {gallery.images.map((img, i) => (
                <SectionReveal key={img.id} delay={i * 60}>
                  <GalleryItem src={img.src} caption={img.caption} index={i} />
                </SectionReveal>
              ))}
            </div>

            <div className="text-center">
              <Link to={gallery.ctaLink || '/factory'} className="btn-primary">
                {gallery.ctaLabel || 'Explore Our Factory'} <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      {testimonialsSection?.isVisible !== false && testimonials.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-forest-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {testimonialsSection?.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">
                  {testimonialsSection.sectionTag}
                </p>
              )}
              <h2 className="section-title">
                {testimonialsSection?.title || 'What Our Customers Say'}
              </h2>
              {testimonialsSection?.subtitle && (
                <p className="section-subtitle mx-auto">{testimonialsSection.subtitle}</p>
              )}
            </SectionReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t, i) => (
                <SectionReveal key={t._id} delay={i * 70}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative">
                    <FaQuoteLeft className="text-gray-100 text-3xl absolute top-5 right-5" />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map((n) => (
                        <FaStar key={n} className={n <= t.rating ? 'text-amber-400 text-sm' : 'text-gray-200 text-sm'} />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5 italic">
                      "{t.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-forest-100 flex items-center justify-center flex-shrink-0">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-forest-700 font-bold text-sm">{t.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                        {(t.role || t.company) && (
                          <p className="text-xs text-gray-400">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
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
        <section className={`py-20 ${ctaBgMap[cta.backgroundStyle] || ctaBgMap.green} text-white relative overflow-hidden`}>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionReveal>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-5">
                {cta.title}
              </h2>
              {cta.subtitle && (
                <p className="text-white/75 text-lg mb-10 max-w-2xl mx-auto">{cta.subtitle}</p>
              )}
              <div className="flex flex-wrap gap-4 justify-center">
                {cta.buttons?.map((btn) => {
                  const isExternal = btn.link?.startsWith('tel:') || btn.link?.startsWith('mailto:') || btn.link?.startsWith('http');
                  const cls =
                    btn.variant === 'secondary'
                      ? 'btn-secondary'
                      : btn.variant === 'outline'
                      ? 'btn-outline'
                      : 'btn-primary';
                  return isExternal ? (
                    <a key={btn.id} href={btn.link} className={cls}>
                      {btn.icon && <span className="mr-1">{btn.icon}</span>}
                      {btn.label}
                    </a>
                  ) : (
                    <Link key={btn.id} to={btn.link || '/contact'} className={cls}>
                      {btn.icon && <span className="mr-1">{btn.icon}</span>}
                      {btn.label}
                    </Link>
                  );
                })}
                {whatsappNumber && whatsappNumber !== '977XXXXXXXXXX' && (
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                      settings.whatsappDefaultMessage || 'Hello! I am interested in your rice products. Please provide more information.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
                  >
                    <FaWhatsapp className="text-lg" /> WhatsApp Inquiry
                  </a>
                )}
              </div>
              <div className="mt-10 flex items-center justify-center gap-2 text-white/50 text-sm">
                <FaMapMarkerAlt />
                Gaindakot, Nawalpur, Gandaki Province, Nepal
              </div>
            </SectionReveal>
          </div>
        </section>
      )}
    </>
  );
}
