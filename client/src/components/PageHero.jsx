export default function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <section className="relative bg-sand-200 pt-36 pb-20 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gold-300/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sage-200/20 rounded-full blur-3xl" />

        {/* Large faded breadcrumb text */}
        <div className="absolute inset-0 flex items-center justify-end overflow-hidden">
          <span className="font-heading font-black text-[18vw] text-ink-900/[0.03] leading-none pr-8 whitespace-nowrap select-none">
            {(breadcrumb || 'PAGE').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {breadcrumb && (
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-px bg-gold-500" />
            <span className="text-gold-600 text-[11px] font-semibold uppercase tracking-[0.25em]">
              {breadcrumb}
            </span>
          </div>
        )}
        <h1 className="font-heading text-5xl md:text-6xl font-bold text-ink-900 mb-5 leading-[1.05] max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-ink-500 text-lg md:text-xl max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
