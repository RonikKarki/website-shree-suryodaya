import { useState, useEffect } from 'react';
import axios from 'axios';
import SectionReveal from '../components/SectionReveal';
import PageHero from '../components/PageHero';
import useSEO from '../hooks/useSEO';
import resolveUrl from '../lib/resolveUrl';

function SkeletonBlock({ h = 'h-8', w = 'w-full' }) {
  return <div className={`${h} ${w} bg-sand-200 rounded-xl animate-pulse`} />;
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
      <div className="pt-20 min-h-screen bg-sand-100">
        <div className="h-64 bg-sand-300 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-6">
          <SkeletonBlock h="h-10" w="w-1/2" /><SkeletonBlock /><SkeletonBlock /><SkeletonBlock w="w-3/4" />
        </div>
      </div>
    );
  }
  if (!data) return null;

  const { hero, profile, visionMission, values, history, factory, team, certifications } = data;

  return (
    <>
      <PageHero breadcrumb="About Us" title={hero?.title || 'Our Story'} subtitle={hero?.subtitle} image={hero?.image} />

      {/* ── PROFILE ── */}
      {profile && (
        <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-14 items-start">
              <SectionReveal direction="left">
                {profile.sectionTag && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-px bg-gold-500" />
                    <span className="section-tag">{profile.sectionTag}</span>
                  </div>
                )}
                <h2 className="section-title mb-6">{profile.title}</h2>
                <div className="space-y-4 text-ink-500 leading-relaxed">
                  {profile.description?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </SectionReveal>

              <SectionReveal direction="right" delay={150}>
                {profile.image ? (
                  <img src={resolveUrl(profile.image)} alt="Company" className="w-full h-72 object-cover rounded-3xl shadow-xl mb-6" />
                ) : (
                  <div className="w-full h-72 bg-gradient-to-br from-sage-700 to-sage-900 rounded-3xl shadow-xl mb-6 flex items-center justify-center">
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
                      <div key={h.id} className="bg-sand-100 rounded-2xl p-4 text-center border border-sand-300">
                        <div className="text-2xl mb-1">{h.icon}</div>
                        <div className="font-bold text-ink-800 text-sm leading-tight">{h.value}</div>
                        <div className="text-ink-400 text-xs mt-0.5">{h.label}</div>
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
        <section className="section-pad bg-sand-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">Our Purpose</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="section-title mx-auto">Vision, Mission &amp; Commitment</h2>
            </SectionReveal>
            <div className="grid md:grid-cols-3 gap-7">
              {[
                { data: visionMission.vision, icon: '🎯', accent: '#C8A86B' },
                { data: visionMission.mission, icon: '🚀', accent: '#4F6D4A' },
                { data: visionMission.commitment, icon: '❤️', accent: '#C8A86B' },
              ].map(({ data: vm, icon, accent }, i) => vm && (
                <SectionReveal key={i} delay={i * 80}>
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-400 h-full border border-sand-300 hover:border-gold-300">
                    {vm.image && (
                      <img src={resolveUrl(vm.image)} alt={vm.title} className="w-full h-36 object-cover" />
                    )}
                    <div className="p-7">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-2xl shadow-md"
                        style={{ backgroundColor: `${accent}20`, border: `2px solid ${accent}40` }}>
                        {icon}
                      </div>
                      <h3 className="font-heading font-bold text-ink-900 text-xl mb-3">{vm.title}</h3>
                      <p className="text-ink-500 text-sm leading-relaxed">{vm.content}</p>
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
        <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-px bg-gold-500" />
                <span className="section-tag">What We Stand For</span>
                <div className="w-8 h-px bg-gold-500" />
              </div>
              <h2 className="section-title mx-auto">Our Core Values</h2>
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <SectionReveal key={v.id} delay={i * 70}>
                  <div className="group bg-sand-100 hover:bg-sand-200 rounded-2xl p-6 transition-all duration-300 border border-sand-300 hover:border-gold-300 h-full">
                    <div className="w-12 h-12 bg-gold-100 border border-gold-200 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                      {v.icon}
                    </div>
                    <h3 className="font-heading font-bold text-ink-900 text-lg mb-2">{v.title}</h3>
                    <p className="text-ink-500 text-sm leading-relaxed">{v.description}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HISTORY TIMELINE ── */}
      {history?.milestones?.length > 0 && (
        <section className="section-pad bg-sand-200">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {history.sectionTag && (
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{history.sectionTag}</span>
                  <div className="w-8 h-px bg-gold-500" />
                </div>
              )}
              <h2 className="section-title mx-auto">{history.title}</h2>
              {history.subtitle && <p className="section-subtitle mt-4 mx-auto text-center">{history.subtitle}</p>}
            </SectionReveal>

            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-sand-400 -translate-x-1/2" />
              <div className="space-y-10">
                {history.milestones.map((m, i) => (
                  <SectionReveal key={m.id} delay={i * 70}>
                    <div className={`flex gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}>
                      <div className={`flex-1 pl-14 md:pl-0 ${i % 2 === 0 ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}>
                        <div className="bg-white border border-sand-300 shadow-sm hover:shadow-md rounded-2xl p-5 transition-shadow">
                          {m.image && <img src={resolveUrl(m.image)} alt={m.title} className="w-full h-32 object-cover rounded-xl mb-4" />}
                          <span className="inline-block bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{m.year}</span>
                          <h4 className="font-heading font-bold text-ink-900 mb-1">{m.title}</h4>
                          <p className="text-ink-500 text-sm leading-relaxed">{m.description}</p>
                        </div>
                      </div>
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-gold-500 border-4 border-white rounded-full shadow-md" />
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
        <section className="section-pad bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {factory.sectionTag && (
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{factory.sectionTag}</span>
                  <div className="w-8 h-px bg-gold-500" />
                </div>
              )}
              <h2 className="section-title mx-auto">{factory.title}</h2>
              {factory.subtitle && <p className="section-subtitle mt-4 mx-auto text-center">{factory.subtitle}</p>}
            </SectionReveal>

            <div className="grid lg:grid-cols-2 gap-14 items-start mb-14">
              <SectionReveal direction="left">
                <p className="text-ink-500 leading-relaxed mb-8">{factory.description}</p>
                {factory.specs?.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {factory.specs.map((s) => (
                      <div key={s.id} className="bg-sand-100 rounded-2xl p-4 text-center border border-sand-300">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="font-bold text-ink-800 text-sm">{s.value}</div>
                        <div className="text-ink-400 text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionReveal>
              <SectionReveal direction="right" delay={150}>
                {factory.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {factory.images.map((img, i) => (
                      img.src ? (
                        <img key={img.id} src={resolveUrl(img.src)} alt={img.caption} className={`rounded-2xl object-cover shadow-md ${i === 0 ? 'col-span-2 h-48' : 'h-36'}`} />
                      ) : (
                        <div key={img.id} className={`rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center ${i === 0 ? 'col-span-2 h-48' : 'h-36'}`}>
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
        <section className="section-pad bg-sand-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-14">
              {team.sectionTag && (
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-8 h-px bg-gold-500" />
                  <span className="section-tag">{team.sectionTag}</span>
                  <div className="w-8 h-px bg-gold-500" />
                </div>
              )}
              <h2 className="section-title mx-auto">{team.title}</h2>
              {team.subtitle && <p className="section-subtitle mt-4 mx-auto text-center">{team.subtitle}</p>}
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.members.map((m, i) => (
                <SectionReveal key={m.id} delay={i * 80}>
                  <div className="bg-white rounded-3xl overflow-hidden border border-sand-300 shadow-sm hover:shadow-xl hover:border-gold-300 transition-all duration-400 h-full">
                    {m.image ? (
                      <img src={resolveUrl(m.image)} alt={m.name} className="w-full h-52 object-cover" />
                    ) : (
                      <div className="h-52 bg-gradient-to-br from-sage-600 to-sage-800 flex items-center justify-center">
                        <span className="text-white text-6xl font-bold font-heading opacity-40">
                          {m.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <h4 className="font-heading font-bold text-ink-900 text-lg">{m.name}</h4>
                      <p className="text-gold-600 text-sm font-semibold mb-3">{m.role}</p>
                      <p className="text-ink-500 text-sm leading-relaxed">{m.bio}</p>
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
        <section className="section-pad-sm bg-ink-900 grain-overlay text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionReveal className="text-center mb-10">
              {certifications.sectionTag && (
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-6 h-px bg-gold-500/50" />
                  <span className="text-gold-400 text-[11px] font-semibold uppercase tracking-[0.25em]">{certifications.sectionTag}</span>
                  <div className="w-6 h-px bg-gold-500/50" />
                </div>
              )}
              <h2 className="font-heading text-3xl font-bold text-white">{certifications.title}</h2>
            </SectionReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.items.map((c, i) => (
                <SectionReveal key={c.id} delay={i * 80}>
                  <div className="flex items-center gap-4 bg-white/8 border border-white/12 rounded-2xl p-5 hover:bg-white/12 transition-colors">
                    <span className="text-4xl">{c.icon}</span>
                    <div>
                      <p className="font-bold text-white">{c.title}</p>
                      <p className="text-white/60 text-sm">{c.issuer}</p>
                      {c.year && <p className="text-gold-400 text-xs mt-0.5">{c.year}</p>}
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
