import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearch, FaExpand } from 'react-icons/fa';
import PageHero from '../components/PageHero';
import SectionReveal from '../components/SectionReveal';
import useSEO from '../hooks/useSEO';
import resolveUrl from '../lib/resolveUrl';

const CATEGORIES = [
  { key: 'all',        label: 'All Photos',  emoji: '🖼️' },
  { key: 'factory',    label: 'Factory',     emoji: '🏭' },
  { key: 'machinery',  label: 'Machinery',   emoji: '⚙️' },
  { key: 'warehouse',  label: 'Warehouse',   emoji: '🏗️' },
  { key: 'processing', label: 'Processing',  emoji: '🌾' },
  { key: 'packaging',  label: 'Packaging',   emoji: '📦' },
  { key: 'team',       label: 'Team',        emoji: '👷' },
  { key: 'other',      label: 'Other',       emoji: '📷' },
];

const catGradients = {
  factory:    'from-slate-100 to-gray-200',
  machinery:  'from-blue-50 to-indigo-100',
  warehouse:  'from-amber-50 to-orange-100',
  processing: 'from-forest-50 to-green-100',
  packaging:  'from-purple-50 to-pink-100',
  team:       'from-sky-50 to-blue-100',
  other:      'from-gray-50 to-slate-100',
};

const catEmojis = {
  factory:'🏭', machinery:'⚙️', warehouse:'🏗️',
  processing:'🌾', packaging:'📦', team:'👷', other:'📷',
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose }) {
  const [current, setCurrent] = useState(index);
  const img = images[current];

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 w-11 h-11 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
        onClick={onClose}
      >
        <FaTimes size={18} />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          onClick={(e) => { e.stopPropagation(); prev(); }}
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
        {img.src ? (
          <img
            src={resolveUrl(img.src)}
            alt={img.caption || img.title || ''}
            className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
          />
        ) : (
          <div className={`w-96 h-72 bg-gradient-to-br ${catGradients[img.category] || 'from-gray-100 to-gray-200'} rounded-xl flex items-center justify-center`}>
            <span className="text-7xl opacity-30">{catEmojis[img.category] || '📷'}</span>
          </div>
        )}
        {(img.caption || img.title) && (
          <div className="mt-4 text-center">
            {img.title && <p className="text-white font-semibold">{img.title}</p>}
            {img.caption && <p className="text-white/60 text-sm mt-0.5">{img.caption}</p>}
          </div>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition"
          onClick={(e) => { e.stopPropagation(); next(); }}
        >
          <FaChevronRight />
        </button>
      )}

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-lg overflow-x-auto py-2 px-4">
          {images.map((img, i) => (
            <button
              key={img._id}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition ${i === current ? 'border-brand-400' : 'border-transparent opacity-50 hover:opacity-80'}`}
            >
              {img.src ? (
                <img src={resolveUrl(img.src)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${catGradients[img.category] || 'from-gray-100 to-gray-200'} flex items-center justify-center`}>
                  <span className="text-lg">{catEmojis[img.category] || '📷'}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Gallery page ─────────────────────────────────────────────────────────────
export default function Gallery() {
  useSEO({ title: 'Gallery', description: 'Photo gallery of Shree Suryodaya rice mill — factory floor, machinery, processing, packaging, and warehouse operations in Gaindakot, Nawalpur.' });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    axios.get('/api/gallery')
      .then((r) => setImages(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? images
    : images.filter((img) => img.category === activeCategory);

  const categoryCounts = images.reduce((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHero
        breadcrumb="Gallery"
        title="Factory & Operations Gallery"
        subtitle="A visual tour of our milling facility, machinery, warehouse, and processing operations in Gaindakot, Nawalpur."
      />

      {/* ── Filter tabs ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[64px] md:top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORIES.map(({ key, label, emoji }) => {
              const count = key === 'all' ? images.length : (categoryCounts[key] || 0);
              if (key !== 'all' && count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeCategory === key
                      ? 'bg-forest-700 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest-700'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold leading-none ${activeCategory === key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <section className="py-14 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="font-heading font-bold text-gray-700 text-xl mb-2">No images yet</h3>
              <p className="text-gray-400">Images in this category will appear here once uploaded.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-6">
                Showing <span className="font-semibold text-forest-700">{filtered.length}</span> photo{filtered.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((img, i) => (
                  <SectionReveal key={img._id} delay={Math.min(i * 40, 400)}>
                    <div
                      className="relative group aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      onClick={() => setLightboxIndex(filtered.indexOf(img))}
                    >
                      {img.src ? (
                        <img
                          src={img.src}
                          alt={img.caption || img.title || ''}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${catGradients[img.category] || 'from-gray-100 to-gray-200'} flex flex-col items-center justify-center gap-2`}>
                          <span className="text-5xl opacity-25">{catEmojis[img.category] || '📷'}</span>
                          {img.title && <span className="text-gray-400 text-xs font-medium text-center px-2">{img.title}</span>}
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <FaExpand className="text-white/70 text-sm mb-auto self-end" />
                        {(img.caption || img.title) && (
                          <p className="text-white text-xs font-medium leading-tight">
                            {img.caption || img.title}
                          </p>
                        )}
                      </div>

                      {/* Category chip */}
                      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {CATEGORIES.find((c) => c.key === img.category)?.label || img.category}
                      </div>
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-white text-center">
        <SectionReveal>
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-forest-800 mb-3">Want to Visit Our Mill?</h2>
            <p className="text-gray-600 mb-6">We welcome dealer visits and factory tours by appointment. Contact us to arrange a visit to our facility in Gaindakot, Nawalpur.</p>
            <a href="/contact" className="btn-primary">Schedule a Visit <FaChevronRight className="text-sm" /></a>
          </div>
        </SectionReveal>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
