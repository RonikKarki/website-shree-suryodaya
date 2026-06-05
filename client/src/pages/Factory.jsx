import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import PageHero from '../components/PageHero';
import SectionReveal from '../components/SectionReveal';
import useSEO from '../hooks/useSEO';

function SkeletonBlock({ h = 'h-6', w = 'w-full', className = '' }) {
  return <div className={`${h} ${w} bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

export default function Factory() {
  useSEO({
    title: 'Our Factory',
    description: 'Explore the Shree Suryodaya rice milling facility in Gaindakot, Nawalpur — 50 MT/day capacity, modern machinery, and rigorous quality control.',
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/pages/factory')
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <div className="bg-gradient-to-br from-forest-900 to-forest-800 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <SkeletonBlock h="h-10" w="w-64" className="mx-auto bg-white/10" />
            <SkeletonBlock h="h-5" w="w-96" className="mx-auto bg-white/10" />
          </div>
        </div>
        <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonBlock key={i} h="h-28" />)}
          </div>
        </div>
      </>
    );
  }

  if (!data) return null;

  const { hero, capacity, process, machinery, quality, location } = data;

  return (
    <>
      <PageHero
        breadcrumb="Our Factory"
        title={hero?.title || 'State-of-the-Art Rice Milling'}
        subtitle={hero?.subtitle}
      />

      {/* ── Capacity cards ── */}
      {capacity?.items?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-12">
              {capacity.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{capacity.sectionTag}</p>
              )}
              <h2 className="section-title">{capacity.title}</h2>
            </SectionReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {capacity.items.map(({ id, label, value, icon }, i) => (
                <SectionReveal key={id} delay={i * 60}>
                  <div className="bg-forest-50 rounded-2xl p-5 text-center hover:bg-forest-100 transition-colors h-full">
                    <div className="text-3xl mb-2">{icon}</div>
                    <div className="font-heading font-bold text-forest-800 text-xl">{value}</div>
                    <div className="text-gray-500 text-xs mt-1 leading-tight">{label}</div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Milling process ── */}
      {process?.steps?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {process.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{process.sectionTag}</p>
              )}
              <h2 className="section-title">{process.title}</h2>
              {process.subtitle && <p className="section-subtitle mx-auto">{process.subtitle}</p>}
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.steps.map(({ id, step, title, desc, icon }, i) => (
                <SectionReveal key={id} delay={i * 70}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full relative overflow-hidden group">
                    <div className="absolute top-3 right-4 font-heading font-bold text-6xl text-gray-50 select-none group-hover:text-forest-50 transition-colors">
                      {step}
                    </div>
                    <div className="text-4xl mb-4 relative">{icon}</div>
                    <h3 className="font-heading font-bold text-forest-800 mb-2 relative">{title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed relative">{desc}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Machinery table ── */}
      {machinery?.items?.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-12">
              {machinery.sectionTag && (
                <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{machinery.sectionTag}</p>
              )}
              <h2 className="section-title">{machinery.title}</h2>
              {machinery.subtitle && <p className="section-subtitle mx-auto">{machinery.subtitle}</p>}
            </SectionReveal>
            <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-forest-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Machine</th>
                    <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-left font-semibold hidden sm:table-cell">Specification</th>
                    <th className="px-6 py-4 text-left font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {machinery.items.map(({ id, name, qty, spec, purpose }, i) => (
                    <tr key={id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-medium text-forest-800">{name}</td>
                      <td className="px-6 py-4 text-gray-600">{qty}</td>
                      <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{spec}</td>
                      <td className="px-6 py-4 text-gray-600">{purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── Quality assurance ── */}
      <section className="py-16 bg-forest-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <SectionReveal>
              {quality?.sectionTag && (
                <p className="text-brand-300 font-semibold uppercase tracking-widest text-sm mb-3">{quality.sectionTag}</p>
              )}
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                {quality?.title || 'Every Batch Tested. Every Bag Guaranteed.'}
              </h2>
              {quality?.description && (
                <p className="text-white/75 leading-relaxed mb-8">{quality.description}</p>
              )}
              {quality?.checklist?.length > 0 && (
                <ul className="space-y-4">
                  {quality.checklist.map(({ id, text }) => (
                    <li key={id} className="flex items-start gap-3 text-white/85">
                      <FaCheckCircle className="text-brand-400 mt-0.5 flex-shrink-0" />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionReveal>

            {quality?.cards?.length > 0 && (
              <SectionReveal delay={150}>
                <div className="grid grid-cols-2 gap-5">
                  {quality.cards.map(({ id, emoji, title, desc }) => (
                    <div key={id} className="bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors">
                      <div className="text-3xl mb-3">{emoji}</div>
                      <h4 className="font-semibold text-white mb-2">{title}</h4>
                      <p className="text-white/65 text-sm">{desc}</p>
                    </div>
                  ))}
                </div>
              </SectionReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── Location / Map ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-12">
            {location?.sectionTag && (
              <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{location.sectionTag}</p>
            )}
            <h2 className="section-title">{location?.title || 'Find Our Mill'}</h2>
            {location?.subtitle && <p className="section-subtitle mx-auto">{location.subtitle}</p>}
          </SectionReveal>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            {location?.mapEmbedUrl ? (
              <iframe
                src={location.mapEmbedUrl}
                width="100%"
                height="360"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shree Suryodaya Factory location"
              />
            ) : (
              <div className="h-80 bg-gradient-to-br from-forest-50 to-forest-100 flex flex-col items-center justify-center text-center p-8">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="font-heading font-bold text-forest-800 text-xl mb-2">
                  Shree Suryodaya Khadya Udhyog Limited
                </h3>
                <p className="text-forest-600 mb-5">{location?.address || 'Gaindakot, Nawalpur, Gandaki Province, Nepal'}</p>
                <a
                  href={location?.mapLinkUrl || 'https://maps.google.com/?q=Gaindakot,Nawalpur,Nepal'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  <FaExternalLinkAlt className="text-xs" /> Open in Google Maps
                </a>
                <p className="text-xs text-gray-400 mt-4">
                  Add a Google Maps embed URL in Admin → Our Factory to show an interactive map here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
