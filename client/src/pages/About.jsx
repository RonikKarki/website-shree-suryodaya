import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import SectionReveal from '../components/SectionReveal';
import useSEO from '../hooks/useSEO';

const valueColors = {
  green: 'bg-forest-700',
  gold:  'bg-brand-500',
  blue:  'bg-blue-600',
  brown: 'bg-earth-600',
};

function SkeletonBlock({ h = 'h-8', w = 'w-full' }) {
  return <div className={`${h} ${w} bg-gray-100 rounded-xl animate-pulse`} />;
}

export default function About() {
  useSEO({ title: 'About Us', description: 'Learn about Shree Suryodaya Khadya Udhyog Limited — our story, mission, vision, values, and 15+ years of rice milling excellence in Gaindakot, Nawalpur, Nepal.' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/pages/about')
      .then((r) => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="h-64 bg-gray-200 animate-pulse" />
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-6">
          <SkeletonBlock h="h-10" w="w-1/2" /><SkeletonBlock /><SkeletonBlock /><SkeletonBlock w="w-3/4" />
        </div>
      </div>
    );
  }
  if (!data) return null;

  const { hero, profile, visionMission, values, history, factory, team, certifications } = data;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-earth-800 text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          {hero?.image && (
            <img src={hero.image} alt="" className="w-full h-full object-cover opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-forest-900/90 to-forest-800/80" />
        </div>
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-300 font-semibold uppercase tracking-widest text-sm mb-4">About Us</p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            {hero?.title}
          </h1>
          {hero?.subtitle && (
            <p className="text-white/75 text-xl max-w-3xl mx-auto leading-relaxed">{hero.subtitle}</p>
          )}
        </div>
      </section>

      {/* ── PROFILE ── */}
      {profile && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <SectionReveal>
                {profile.sectionTag && (
                  <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-3">{profile.sectionTag}</p>
                )}
                <h2 className="section-title">{profile.title}</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  {profile.description?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </SectionReveal>

              <SectionReveal delay={150}>
                {profile.image ? (
                  <img src={profile.image} alt="Company" className="w-full h-72 object-cover rounded-3xl shadow-xl mb-6" />
                ) : (
                  <div className="w-full h-72 bg-gradient-to-br from-forest-700 to-forest-900 rounded-3xl shadow-xl mb-6 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-7xl mb-4">🌾</div>
                      <p className="font-heading text-xl font-bold">"Quality in Every Grain"</p>
                      <p className="text-white/60 text-sm mt-1">Est. 2009 · Gaindakot, Nepal</p>
                    </div>
                  </div>
                )}
                {profile.highlights?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {profile.highlights.map((h) => (
                      <div key={h.id} className="bg-forest-50 rounded-2xl p-4 text-center border border-forest-100">
                        <div className="text-2xl mb-1">{h.icon}</div>
                        <div className="font-bold text-forest-800 text-sm leading-tight">{h.value}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{h.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── VISION MISSION ── */}
      {visionMission && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">Our Purpose</p>
              <h2 className="section-title">Vision, Mission & Commitment</h2>
            </SectionReveal>
            <div className="grid md:grid-cols-3 gap-7">
              {[
                { data: visionMission.vision, icon: '🎯', bg: 'bg-forest-700', accent: 'border-forest-200' },
                { data: visionMission.mission, icon: '🚀', bg: 'bg-brand-500', accent: 'border-brand-200' },
                { data: visionMission.commitment, icon: '❤️', bg: 'bg-earth-600', accent: 'border-earth-200' },
              ].map(({ data: vm, icon, bg, accent }, i) => vm && (
                <SectionReveal key={i} delay={i * 80}>
                  <div className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full border ${accent}`}>
                    {vm.image && (
                      <img src={vm.image} alt={vm.title} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-7">
                      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-5 text-2xl shadow-md`}>
                        {icon}
                      </div>
                      <h3 className="font-heading font-bold text-forest-800 text-xl mb-3">{vm.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{vm.content}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VALUES ── */}
      {values?.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">What We Stand For</p>
              <h2 className="section-title">Our Core Values</h2>
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <SectionReveal key={v.id} delay={i * 70}>
                  <div className="group bg-gray-50 hover:bg-forest-50 rounded-2xl p-6 transition-all duration-300 border border-transparent hover:border-forest-100 h-full">
                    <div className={`w-12 h-12 ${valueColors[v.color] || 'bg-forest-700'} rounded-xl flex items-center justify-center text-2xl mb-4 shadow group-hover:scale-110 transition-transform`}>
                      {v.icon}
                    </div>
                    <h3 className="font-heading font-bold text-forest-800 text-lg mb-2">{v.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HISTORY TIMELINE ── */}
      {history?.milestones?.length > 0 && (
        <section className="py-20 bg-forest-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {history.sectionTag && <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{history.sectionTag}</p>}
              <h2 className="section-title">{history.title}</h2>
              {history.subtitle && <p className="section-subtitle mx-auto">{history.subtitle}</p>}
            </SectionReveal>

            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-forest-200 -translate-x-1/2" />
              <div className="space-y-10">
                {history.milestones.map((m, i) => (
                  <SectionReveal key={m.id} delay={i * 70}>
                    <div className={`flex gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}>
                      <div className={`flex-1 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}>
                        <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-2xl p-5 transition-shadow">
                          {m.image && <img src={m.image} alt={m.title} className="w-full h-32 object-cover rounded-xl mb-4" />}
                          <span className="inline-block bg-forest-700 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{m.year}</span>
                          <h4 className="font-heading font-bold text-forest-800 mb-1">{m.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-brand-500 border-4 border-white rounded-full shadow-md" />
                      <div className="hidden md:block flex-1" />
                    </div>
                  </SectionReveal>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FACTORY ── */}
      {factory && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {factory.sectionTag && <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{factory.sectionTag}</p>}
              <h2 className="section-title">{factory.title}</h2>
              {factory.subtitle && <p className="section-subtitle mx-auto">{factory.subtitle}</p>}
            </SectionReveal>

            <div className="grid lg:grid-cols-2 gap-14 items-start mb-14">
              <SectionReveal>
                <p className="text-gray-600 leading-relaxed mb-8">{factory.description}</p>
                {factory.specs?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {factory.specs.map((s) => (
                      <div key={s.id} className="bg-forest-50 rounded-2xl p-4 text-center border border-forest-100">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="font-bold text-forest-800 text-sm">{s.value}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionReveal>
              <SectionReveal delay={150}>
                {factory.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {factory.images.map((img, i) => (
                      img.src ? (
                        <img key={img.id} src={img.src} alt={img.caption} className={`rounded-2xl object-cover shadow-md ${i === 0 ? 'col-span-2 h-48' : 'h-36'}`} />
                      ) : (
                        <div key={img.id} className={`rounded-2xl bg-gradient-to-br from-forest-100 to-forest-200 flex items-center justify-center ${i === 0 ? 'col-span-2 h-48' : 'h-36'}`}>
                          <span className="text-4xl opacity-30">🏭</span>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </SectionReveal>
            </div>
          </div>
        </section>
      )}

      {/* ── TEAM ── */}
      {team?.members?.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {team.sectionTag && <p className="text-brand-600 font-semibold uppercase tracking-widest text-sm mb-2">{team.sectionTag}</p>}
              <h2 className="section-title">{team.title}</h2>
              {team.subtitle && <p className="section-subtitle mx-auto">{team.subtitle}</p>}
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.members.map((m, i) => (
                <SectionReveal key={m.id} delay={i * 80}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow h-full">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-52 object-cover" />
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold font-heading opacity-40">
                          {m.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="font-heading font-bold text-forest-800 text-lg">{m.name}</h4>
                      <p className="text-brand-600 text-sm font-semibold mb-3">{m.role}</p>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS ── */}
      {certifications?.items?.length > 0 && (
        <section className="py-16 bg-forest-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-10">
              {certifications.sectionTag && <p className="text-brand-300 font-semibold uppercase tracking-widest text-sm mb-2">{certifications.sectionTag}</p>}
              <h2 className="font-heading text-3xl font-bold text-white">{certifications.title}</h2>
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.items.map((c, i) => (
                <SectionReveal key={c.id} delay={i * 80}>
                  <div className="flex items-center gap-4 bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-colors">
                    <span className="text-4xl">{c.icon}</span>
                    <div>
                      <p className="font-bold text-white">{c.title}</p>
                      <p className="text-white/65 text-sm">{c.issuer}</p>
                      {c.year && <p className="text-brand-300 text-xs mt-0.5">{c.year}</p>}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
