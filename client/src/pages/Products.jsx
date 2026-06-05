import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaSearch, FaArrowRight, FaTag } from 'react-icons/fa';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import SectionReveal from '../components/SectionReveal';
import BrandCard from '../components/BrandCard';
import useSEO from '../hooks/useSEO';

const CATEGORIES = [
  { key: 'all',       label: 'All Products', emoji: '🌾' },
  { key: 'premium',   label: 'Premium',      emoji: '⭐' },
  { key: 'specialty', label: 'Specialty',    emoji: '✨' },
  { key: 'medium',    label: 'Medium',       emoji: '🍚' },
  { key: 'economy',   label: 'Economy',      emoji: '🛒' },
];

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
        <div className="h-3 bg-gray-100 rounded-full w-4/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-16" />
          <div className="h-6 bg-gray-100 rounded-full w-16" />
        </div>
        <div className="h-11 bg-gray-100 rounded-xl mt-2" />
      </div>
    </div>
  );
}

export default function Products() {
  useSEO({ title: 'Our Products', description: 'Browse Shree Suryodaya\'s premium rice varieties — Basmati, Katarni, Jeera Masino, Sona Mansuli, Brown Rice, and more. Available in bulk and retail packs across Nepal.' });
  const [products, setProducts]   = useState([]);
  const [settings, setSettings]   = useState({});
  const [brands, setBrands]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand]       = useState('all');
  const [searchQuery, setSearchQuery]       = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/products'),
      axios.get('/api/settings'),
      axios.get('/api/brands'),
    ])
      .then(([prodRes, settingsRes, brandRes]) => {
        setProducts(prodRes.data.data || []);
        setSettings(settingsRes.data.data || {});
        setBrands(brandRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);
    if (activeBrand !== 'all')    list = list.filter((p) => p.brand === activeBrand);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameNepali?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, searchQuery]);

  const whatsappNumber = settings.whatsappNumber || '977XXXXXXXXXX';

  const globalWhatsAppUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    settings.whatsappDefaultMessage ||
      'Hello! I am interested in your rice products. Please share pricing and availability.'
  )}`;

  return (
    <>
      <PageHero
        breadcrumb="Our Products"
        title="Premium Rice Varieties"
        subtitle="Carefully milled and sorted for purity, nutrition, and taste — for every kitchen and every occasion."
      />

      {/* ── WhatsApp Banner ── */}
      <div className="bg-[#25D366] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm">
            <FaWhatsapp className="text-2xl flex-shrink-0" />
            <p>
              <span className="font-semibold">Quick inquiry?</span>
              {' '}Chat with us on WhatsApp — we respond within minutes.
            </p>
          </div>
          <a
            href={globalWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-white text-[#25D366] hover:bg-green-50 font-bold text-sm px-5 py-2 rounded-full transition-colors shadow-sm"
          >
            Chat Now →
          </a>
        </div>
      </div>

      {/* ── Brands Highlight ── */}
      {brands.length > 0 && (
        <section className="py-14 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-10">
              <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">Our Brands</p>
              <h2 className="font-heading text-3xl font-bold text-forest-800">Trusted Brand Names</h2>
              <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">
                Every grain carries the promise of a brand built on quality and care.
              </p>
            </SectionReveal>
            <div className={`grid gap-6 ${brands.length === 1 ? 'max-w-sm mx-auto' : brands.length === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
              {brands.map((brand, i) => (
                <SectionReveal key={brand._id} delay={i * 100}>
                  <BrandCard brand={brand} />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Filter + Search Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[64px] md:top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
          {/* Row 1: Search + Category */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" placeholder="Search rice varieties..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 bg-gray-50" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none flex-1">
              {CATEGORIES.map(({ key, label, emoji }) => (
                <button key={key} onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === key ? 'bg-forest-700 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest-700'
                  }`}>
                  <span className="text-base leading-none">{emoji}</span>
                  {label}
                  {categoryCounts[key] !== undefined && (
                    <span className={`text-xs rounded-full px-1.5 py-0.5 leading-none font-bold ${activeCategory === key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {categoryCounts[key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Brand filter — only when brands exist */}
          {brands.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0 flex items-center gap-1">
                <FaTag className="text-xs" /> Brand:
              </span>
              <button onClick={() => setActiveBrand('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeBrand === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                All Brands
              </button>
              {brands.map((brand) => {
                const active = activeBrand === brand.name;
                const count  = products.filter((p) => p.brand === brand.name).length;
                return (
                  <button key={brand._id} onClick={() => setActiveBrand(brand.name)}
                    style={active ? { backgroundColor: brand.accentColor, color: '#fff' } : {}}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${active ? '' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {brand.logo
                      ? <img src={brand.logo} alt="" className="w-3.5 h-3.5 object-contain rounded-sm" />
                      : <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: active ? 'rgba(255,255,255,0.3)' : brand.accentColor }} />}
                    {brand.name}
                    {brand.nepaliName && <span className="opacity-70">{brand.nepaliName}</span>}
                    <span className={`text-xs rounded-full px-1.5 py-0.5 leading-none font-bold ${active ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Products Grid ── */}
      <section className="py-14 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-heading font-bold text-forest-800 text-xl mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? `No results for "${searchQuery}".` : 'No products in this category yet.'}
              </p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="btn-primary"
              >
                View All Products
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">
                Showing <span className="font-semibold text-forest-700">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'all' && <> in <span className="font-semibold">{CATEGORIES.find((c) => c.key === activeCategory)?.label}</span></>}
                {searchQuery && <> matching "<span className="font-semibold">{searchQuery}</span>"</>}
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {filtered.map((product, i) => (
                  <SectionReveal key={product._id} delay={Math.min(i * 50, 300)}>
                    <ProductCard
                      product={product}
                      whatsappNumber={whatsappNumber}
                      brands={brands}
                    />
                  </SectionReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Packaging Info ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-12">
            <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">Packaging</p>
            <h2 className="section-title">Flexible Packaging Options</h2>
            <p className="section-subtitle mx-auto">
              Our rice is available in multiple pack sizes — from household 1 kg bags to institutional 50 kg sacks.
            </p>
          </SectionReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { size: '1 kg',  icon: '🧺', for: 'Trial / Small household' },
              { size: '2 kg',  icon: '🛍️', for: 'Small family' },
              { size: '5 kg',  icon: '🛒', for: 'Regular household' },
              { size: '10 kg', icon: '🏠', for: 'Large household' },
              { size: '25 kg', icon: '🏪', for: 'Retailers & hotels' },
              { size: '50 kg', icon: '🏭', for: 'Bulk / institutional' },
            ].map(({ size, icon, for: forText }, i) => (
              <SectionReveal key={size} delay={i * 60}>
                <div className="bg-forest-50 hover:bg-forest-100 rounded-2xl p-5 text-center transition-colors cursor-default">
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="font-heading font-bold text-forest-800 text-lg">{size}</div>
                  <div className="text-gray-500 text-xs mt-1 leading-tight">{forText}</div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bulk / Wholesale CTA ── */}
      <section className="py-14 bg-gradient-to-r from-forest-800 to-forest-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="font-heading text-3xl font-bold text-white mb-4">
              Looking for Bulk or Wholesale?
            </h2>
            <p className="text-white/75 mb-8 text-lg">
              We supply rice in bulk to retailers, restaurants, hotels, and institutions. Contact us for special wholesale pricing, custom packaging, and regular delivery.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={globalWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <FaWhatsapp className="text-xl" />
                WhatsApp for Bulk Inquiry
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-forest-800 font-semibold px-8 py-3.5 rounded-full transition-all duration-200"
              >
                Send a Message
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
