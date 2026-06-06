import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import resolveUrl from '../lib/resolveUrl';

export default function BrandCard({ brand }) {
  const color = brand.accentColor || '#1B5E20';

  return (
    <div className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-400 overflow-hidden flex flex-col border border-gray-100 hover:border-transparent hover:-translate-y-1">
      {/* Top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

      {/* Logo area */}
      <div className="flex justify-center pt-8 pb-4 px-6">
        <div
          className="w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: `${color}12`, border: `2px solid ${color}25` }}
        >
          {brand.logo ? (
            <img
              src={resolveUrl(brand.logo)}
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span
              className="font-heading font-black text-5xl select-none"
              style={{ color }}
            >
              {brand.name?.[0]?.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 text-center flex flex-col flex-1">
        <div className="mb-4">
          <h3 className="font-heading font-bold text-gray-900 text-2xl mb-0.5">
            {brand.name}
          </h3>
          {brand.nepaliName && (
            <p className="text-gray-400 text-sm">{brand.nepaliName}</p>
          )}
          {brand.tagline && (
            <p className="text-sm font-medium mt-2 italic" style={{ color }}>
              "{brand.tagline}"
            </p>
          )}
        </div>

        {brand.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
            {brand.description}
          </p>
        )}

        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:gap-3"
          style={{ backgroundColor: color }}
        >
          View Products <FaArrowRight className="text-xs" />
        </Link>
      </div>

      {/* Subtle corner glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-3xl"
        style={{ boxShadow: `inset 0 0 40px ${color}08` }}
      />
    </div>
  );
}
