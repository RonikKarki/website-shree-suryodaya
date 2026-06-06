import { FaWhatsapp, FaSeedling, FaLeaf, FaTag } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';

const categoryConfig = {
  premium:   { bg: 'bg-amber-100',   text: 'text-amber-800',   label: 'Premium',   dot: 'bg-amber-400' },
  specialty: { bg: 'bg-purple-100',  text: 'text-purple-800',  label: 'Specialty', dot: 'bg-purple-400' },
  medium:    { bg: 'bg-blue-100',    text: 'text-blue-800',    label: 'Medium',    dot: 'bg-blue-400' },
  economy:   { bg: 'bg-slate-100',   text: 'text-slate-700',   label: 'Economy',   dot: 'bg-slate-400' },
};

const gradientFallbacks = {
  premium:   'from-amber-50 via-yellow-50 to-orange-50',
  specialty: 'from-purple-50 via-pink-50 to-rose-50',
  medium:    'from-sky-50 via-blue-50 to-indigo-50',
  economy:   'from-slate-50 via-gray-50 to-zinc-50',
};

const riceEmoji = { premium: '🌾', specialty: '✨', medium: '🍚', economy: '🛒' };

export default function ProductCard({ product, whatsappNumber, compactMode = false, brands = [] }) {
  const cat = categoryConfig[product.category] || categoryConfig.medium;
  const gradient = gradientFallbacks[product.category] || gradientFallbacks.medium;
  const emoji = riceEmoji[product.category] || '🌾';
  const brand = product.brand ? brands.find((b) => b.name === product.brand) : null;

  const buildWhatsAppUrl = () => {
    const number = (whatsappNumber || '977XXXXXXXXXX').replace(/\D/g, '');
    const msg = product.whatsappMessage ||
      `Hello! I am interested in *${product.name}*. Please provide more information about pricing and availability.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group border border-gray-100 hover:border-forest-200">
      {/* ── Product Image ── */}
      <div className={`relative overflow-hidden ${compactMode ? 'h-44' : 'h-52'} bg-gradient-to-br ${gradient} flex-shrink-0`}>
        {product.image ? (
          <img
            src={resolveUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-6xl opacity-25 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500 select-none">
              {emoji}
            </span>
            <div className="absolute bottom-4 right-4 opacity-10">
              <FaLeaf className="text-forest-600 text-5xl" />
            </div>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`inline-flex items-center gap-1.5 ${cat.bg} ${cat.text} text-xs font-bold px-3 py-1 rounded-full shadow-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
            {cat.label}
          </span>
          {brand && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: `${brand.accentColor}ee`, color: '#fff' }}>
              {brand.logo
                ? <img src={resolveUrl(brand.logo)} alt="" className="w-3 h-3 object-contain" />
                : <FaTag className="text-xs opacity-80" />}
              {brand.name}
            </span>
          )}
        </div>

        {/* Active status for admin context — not shown by default */}
        {product.isActive === false && (
          <div className="absolute top-3 right-3 bg-gray-800/70 text-white text-xs px-2 py-0.5 rounded-full">
            Inactive
          </div>
        )}
      </div>

      {/* ── Product Details ── */}
      <div className="flex flex-col flex-1 p-5">
        {/* Name */}
        <div className="mb-3">
          <h3 className="font-heading text-lg font-bold text-forest-800 group-hover:text-forest-600 transition-colors leading-tight">
            {product.name}
          </h3>
          {product.nameNepali && (
            <p className="text-gray-400 text-sm mt-0.5">{product.nameNepali}</p>
          )}
        </div>

        {/* Description */}
        <p className={`text-gray-600 text-sm leading-relaxed mb-4 ${compactMode ? 'line-clamp-2' : 'line-clamp-3'}`}>
          {product.description}
        </p>

        {/* Grain specs */}
        {!compactMode && (product.grainType || product.aroma) && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-4 bg-gray-50 rounded-xl p-3">
            {product.grainType && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide block">Grain</span>
                <span className="text-xs font-semibold text-gray-700">{product.grainType}</span>
              </div>
            )}
            {product.aroma && (
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide block">Aroma</span>
                <span className="text-xs font-semibold text-gray-700">{product.aroma}</span>
              </div>
            )}
            {product.texture && (
              <div className="col-span-2">
                <span className="text-xs text-gray-400 uppercase tracking-wide block">Texture</span>
                <span className="text-xs font-semibold text-gray-700">{product.texture}</span>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        {product.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.features.slice(0, compactMode ? 3 : 4).map((f) => (
              <span
                key={f}
                className="inline-flex items-center gap-1 text-xs bg-forest-50 text-forest-700 border border-forest-100 px-2.5 py-1 rounded-full font-medium"
              >
                <FaSeedling className="text-forest-500 text-xs flex-shrink-0" />
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Spacer to push packaging + button to bottom */}
        <div className="flex-1" />

        {/* Packaging sizes */}
        {product.packagingSizes?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 font-medium">Available in</p>
            <div className="flex flex-wrap gap-1.5">
              {product.packagingSizes.map((size) => (
                <span
                  key={size}
                  className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium border border-gray-200"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Cooking tip */}
        {!compactMode && product.cookingTip && (
          <div className="mb-4 bg-brand-50 border border-brand-100 rounded-xl p-3">
            <p className="text-xs text-brand-700">
              <span className="font-bold">💡 Tip: </span>
              {product.cookingTip}
            </p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 text-sm group/wa"
        >
          <FaWhatsapp className="text-xl group-hover/wa:scale-110 transition-transform" />
          Inquire on WhatsApp
        </a>
      </div>
    </article>
  );
}
