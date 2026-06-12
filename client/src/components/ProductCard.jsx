import { FaWhatsapp, FaTag } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';

const categoryConfig = {
  premium:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  label: 'Premium',   dot: 'bg-amber-400' },
  specialty: { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200', label: 'Specialty', dot: 'bg-purple-400' },
  medium:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   label: 'Medium',    dot: 'bg-blue-400'  },
  economy:   { bg: 'bg-slate-50',   text: 'text-slate-600',   border: 'border-slate-200',  label: 'Economy',   dot: 'bg-slate-400' },
};

const imageFallbacks = {
  premium:   'from-amber-50 to-orange-100',
  specialty: 'from-purple-50 to-pink-100',
  medium:    'from-sky-50 to-blue-100',
  economy:   'from-slate-50 to-gray-100',
};

const riceEmoji = { premium: '🌾', specialty: '✨', medium: '🍚', economy: '🛒' };

export default function ProductCard({ product, whatsappNumber, compactMode = false, brands = [] }) {
  const cat     = categoryConfig[product.category] || categoryConfig.medium;
  const fallback = imageFallbacks[product.category] || imageFallbacks.medium;
  const emoji   = riceEmoji[product.category] || '🌾';
  const brand   = product.brand ? brands.find((b) => b.name === product.brand) : null;

  const waUrl = (() => {
    const num = (whatsappNumber || '977XXXXXXXXXX').replace(/\D/g, '');
    const msg = product.whatsappMessage ||
      `Hello! I am interested in *${product.name}*. Please provide more information about pricing and availability.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  })();

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-sand-300 hover:border-gold-400 hover:shadow-xl transition-all duration-400 flex flex-col">
      {/* ── Image ── */}
      <div className={`relative overflow-hidden flex-shrink-0 ${compactMode ? 'h-48' : 'h-56'} bg-gradient-to-br ${fallback}`}>
        {product.image ? (
          <img
            src={resolveUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-6xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none">
              {emoji}
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 ${cat.bg} ${cat.text} border ${cat.border} text-[11px] font-bold px-3 py-1 rounded-full`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </span>
          {brand && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ backgroundColor: `${brand.accentColor}22`, color: brand.accentColor, border: `1px solid ${brand.accentColor}44` }}>
              {brand.logo
                ? <img src={resolveUrl(brand.logo)} alt="" className="w-3 h-3 object-contain rounded-sm" />
                : <FaTag className="text-[9px] opacity-80" />}
              {brand.name}
            </span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name */}
        <div className="mb-3">
          <h3 className="font-heading font-bold text-ink-900 text-lg leading-tight group-hover:text-gold-700 transition-colors">
            {product.name}
          </h3>
          {product.nameNepali && (
            <p className="text-ink-400 text-sm mt-0.5">{product.nameNepali}</p>
          )}
        </div>

        {/* Description */}
        <p className={`text-ink-500 text-sm leading-relaxed mb-4 ${compactMode ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {product.description}
        </p>

        {/* Grain specs */}
        {!compactMode && (product.grainType || product.aroma) && (
          <div className="grid grid-cols-2 gap-2 mb-4 bg-sand-100 rounded-xl p-3 border border-sand-300">
            {product.grainType && (
              <div>
                <span className="text-[10px] text-ink-400 uppercase tracking-wide block mb-0.5">Grain</span>
                <span className="text-xs font-semibold text-ink-700">{product.grainType}</span>
              </div>
            )}
            {product.aroma && (
              <div>
                <span className="text-[10px] text-ink-400 uppercase tracking-wide block mb-0.5">Aroma</span>
                <span className="text-xs font-semibold text-ink-700">{product.aroma}</span>
              </div>
            )}
            {product.texture && (
              <div className="col-span-2">
                <span className="text-[10px] text-ink-400 uppercase tracking-wide block mb-0.5">Texture</span>
                <span className="text-xs font-semibold text-ink-700">{product.texture}</span>
              </div>
            )}
          </div>
        )}

        {/* Feature tags */}
        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.slice(0, compactMode ? 3 : 4).map((f) => (
              <span key={f} className="text-[11px] bg-sand-100 text-ink-600 border border-sand-300 px-2.5 py-1 rounded-full font-medium">
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Packaging sizes */}
        {product.packagingSizes?.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-ink-400 uppercase tracking-wide mb-1.5 font-medium">Available in</p>
            <div className="flex flex-wrap gap-1.5">
              {product.packagingSizes.map((size) => (
                <span key={size} className="text-[11px] bg-sand-200 text-ink-600 px-2.5 py-1 rounded-lg font-medium border border-sand-300">
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cooking tip */}
        {!compactMode && product.cookingTip && (
          <div className="mb-4 bg-gold-100 border border-gold-200 rounded-xl p-3">
            <p className="text-xs text-gold-700">
              <span className="font-bold">💡 Tip: </span>{product.cookingTip}
            </p>
          </div>
        )}

        {/* Inactive badge */}
        {product.isActive === false && (
          <div className="mb-3 bg-ink-100 text-ink-500 text-xs px-3 py-1.5 rounded-full text-center font-medium">
            Currently Unavailable
          </div>
        )}

        {/* WhatsApp CTA */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm"
        >
          <FaWhatsapp className="text-lg" /> Inquire on WhatsApp
        </a>
      </div>
    </article>
  );
}
