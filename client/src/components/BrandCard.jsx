import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';

export default function BrandCard({ brand }) {
  const color = brand.accentColor || '#4F6D4A';

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-sand-300 hover:border-transparent hover:shadow-xl transition-all duration-400 flex flex-col hover:-translate-y-1">
      {/* Top accent line */}
      <div className="h-1 w-full" style={{ backgroundColor: color }} />

      {/* Logo area */}
      <div className="flex justify-center pt-8 pb-4 px-6">
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-400 group-hover:scale-105"
          style={{ backgroundColor: `${color}10`, border: `2px solid ${color}20` }}
        >
          {brand.logo ? (
            <img
              src={resolveUrl(brand.logo)}
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="font-heading font-black text-5xl select-none" style={{ color }}>
              {brand.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-7 text-center flex flex-col flex-1">
        <h3 className="font-heading font-bold text-ink-900 text-2xl mb-0.5">{brand.name}</h3>
        {brand.nepaliName && (
          <p className="text-ink-400 text-sm mb-1">{brand.nepaliName}</p>
        )}
        {brand.tagline && (
          <p className="text-sm font-medium italic mt-2 mb-4" style={{ color }}>"{brand.tagline}"</p>
        )}

        {brand.description && (
          <p className="text-ink-500 text-sm leading-relaxed mb-5 flex-1">{brand.description}</p>
        )}

        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:gap-3 hover:-translate-y-0.5"
          style={{ backgroundColor: color }}
        >
          View Products <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Corner glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
        style={{ boxShadow: `inset 0 0 50px ${color}08` }}
      />
    </div>
  );
}
