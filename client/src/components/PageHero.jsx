export default function PageHero({ title, subtitle, breadcrumb }) {
  return (
    <section className="relative bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-white pt-32 pb-20 overflow-hidden">
      {/* decorative circles */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
      <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-brand-500/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {breadcrumb && (
          <p className="text-brand-300 text-sm font-medium mb-3 uppercase tracking-widest">{breadcrumb}</p>
        )}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        {subtitle && <p className="text-white/75 text-lg max-w-2xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
