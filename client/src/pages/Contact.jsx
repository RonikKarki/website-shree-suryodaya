import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaCheckCircle, FaExclamationCircle, FaWhatsapp,
  FaFacebook, FaInstagram, FaExternalLinkAlt,
} from 'react-icons/fa';
import SectionReveal from '../components/SectionReveal';
import useSEO from '../hooks/useSEO';

const subjectOptions = [
  'Product Inquiry', 'Wholesale / Bulk Order', 'Dealership / Distribution',
  'Quality Feedback', 'General Inquiry', 'Other',
];
const emptyForm = { name: '', email: '', phone: '', subject: '', message: '' };

const platformIcons = { facebook: FaFacebook, instagram: FaInstagram, whatsapp: FaWhatsapp };

export default function Contact() {
  useSEO({ title: 'Contact Us', description: 'Get in touch with Shree Suryodaya Khadya Udhyog Limited. Call, email, or send a WhatsApp message for product inquiries, wholesale orders, and dealer applications.' });
  const [pageData, setPageData] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    axios.get('/api/pages/contact-page')
      .then((r) => setPageData(r.data.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading'); setErrorMsg('');
    try {
      await axios.post('/api/contact', form);
      setStatus('success');
      setForm(emptyForm);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const d = pageData;
  const waNumber = (d?.whatsappNumber || '').replace(/\D/g, '');
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(d?.whatsappMessage || 'Hello! I would like to inquire about your rice products.')}`
    : null;

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-earth-800 text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-brand-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-brand-300 font-semibold uppercase tracking-widest text-sm mb-3">Get in Touch</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            {d?.hero?.title || 'Contact Us'}
          </h1>
          {d?.hero?.subtitle && (
            <p className="text-white/75 text-lg max-w-2xl mx-auto">{d.hero.subtitle}</p>
          )}
        </div>
      </section>

      {/* ── WHATSAPP QUICK CONTACT BANNER ── */}
      {waUrl && (
        <div className="bg-[#25D366] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <FaWhatsapp className="text-2xl flex-shrink-0" />
              <p><span className="font-semibold">Fastest response?</span> Message us directly on WhatsApp — we reply within minutes.</p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-white text-[#25D366] hover:bg-green-50 font-bold text-sm px-5 py-2 rounded-full transition shadow-sm flex items-center gap-2"
            >
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* ── Left: contact info ── */}
            <div className="lg:col-span-2 space-y-5">
              {d?.intro && (
                <SectionReveal>
                  <div className="bg-white rounded-2xl shadow-sm p-7">
                    <h2 className="font-heading font-bold text-forest-800 text-xl mb-3">{d.intro.title}</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{d.intro.description}</p>
                  </div>
                </SectionReveal>
              )}

              {/* Contact details */}
              <SectionReveal delay={80}>
                <div className="bg-white rounded-2xl shadow-sm p-7 space-y-5">
                  <h3 className="font-heading font-bold text-forest-800 text-lg border-b border-gray-100 pb-3">Contact Details</h3>

                  {/* Address */}
                  {(d?.address?.full || d?.address?.city) && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaMapMarkerAlt className="text-forest-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Address</p>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {d.address.street && <>{d.address.street}<br /></>}
                          {d.address.city && <>{d.address.city}{d.address.district && `, ${d.address.district}`}<br /></>}
                          {d.address.province && <>{d.address.province}, </>}
                          {d.address.country || 'Nepal'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phones */}
                  {d?.phones?.length > 0 && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaPhone className="text-forest-700" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Phone</p>
                        {d.phones.map((p) => (
                          <div key={p.id}>
                            <span className="text-xs text-gray-400">{p.label}: </span>
                            <a href={`tel:${p.number}`} className="text-forest-600 hover:text-forest-800 text-sm font-medium transition">{p.number}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emails */}
                  {d?.emails?.length > 0 && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaEnvelope className="text-forest-700" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Email</p>
                        {d.emails.map((e) => (
                          <div key={e.id}>
                            <span className="text-xs text-gray-400">{e.label}: </span>
                            <a href={`mailto:${e.email}`} className="text-forest-600 hover:text-forest-800 text-sm font-medium transition break-all">{e.email}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Office hours */}
                  {d?.officeHours && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaClock className="text-forest-700" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase mb-0.5">Office Hours</p>
                        {d.officeHours.split('\n').map((line, i) => (
                          <p key={i} className="text-gray-700 text-sm">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </SectionReveal>

              {/* WhatsApp card */}
              {waUrl && (
                <SectionReveal delay={120}>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-2xl p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
                  >
                    <FaWhatsapp className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-bold text-lg">WhatsApp Inquiry</p>
                      <p className="text-white/80 text-sm">Tap to open WhatsApp chat — fastest way to reach us.</p>
                    </div>
                  </a>
                </SectionReveal>
              )}

              {/* Social links */}
              {d?.socialLinks?.filter((s) => s.url).length > 0 && (
                <SectionReveal delay={140}>
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <p className="text-sm font-bold text-gray-500 mb-3">Follow Us</p>
                    <div className="flex gap-3">
                      {d.socialLinks.filter((s) => s.url).map((s) => {
                        const Icon = platformIcons[s.icon?.toLowerCase()] || FaExternalLinkAlt;
                        return (
                          <a
                            key={s.id}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-forest-100 hover:bg-forest-700 text-forest-700 hover:text-white rounded-xl flex items-center justify-center transition"
                            title={s.platform}
                          >
                            <Icon />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </SectionReveal>
              )}
            </div>

            {/* ── Right: Contact form ── */}
            <SectionReveal delay={100} className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="font-heading font-bold text-forest-800 text-xl mb-6">Send Us a Message</h3>

                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FaCheckCircle className="text-forest-600 text-5xl mb-4" />
                    <h4 className="font-heading font-bold text-forest-800 text-xl mb-2">Message Received!</h4>
                    <p className="text-gray-600 mb-6">Thank you for reaching out. Our team will get back to you within 1–2 business days.</p>
                    <button onClick={() => setStatus(null)} className="btn-primary">Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label="Full Name *" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                      <FormField label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-5">
                      <FormField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+977-98XXXXXXXX" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject *</label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white transition"
                        >
                          <option value="">Select a subject</option>
                          {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        placeholder="Tell us what you need..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none transition"
                      />
                    </div>
                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                        <FaExclamationCircle className="flex-shrink-0" /> {errorMsg}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? (
                        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                      ) : 'Send Message'}
                    </button>
                    <p className="text-xs text-gray-400 text-center">We typically respond within 1–2 business days.</p>
                  </form>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── MAP ── */}
      <section className="bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SectionReveal className="text-center mb-6">
            <h2 className="font-heading text-2xl font-bold text-forest-800">Find Us in Gaindakot</h2>
          </SectionReveal>

          <div className="rounded-2xl overflow-hidden shadow-lg h-80 bg-forest-50">
            {d?.mapEmbedUrl ? (
              <iframe
                src={d.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shree Suryodaya location"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <div className="text-6xl">🗺️</div>
                <div className="text-center">
                  <p className="font-semibold text-forest-800">Gaindakot, Nawalpur, Nepal</p>
                  <p className="text-gray-500 text-sm">Gandaki Province</p>
                </div>
                <a
                  href={d?.mapLinkUrl || 'https://maps.google.com/?q=Gaindakot+Nawalpur+Nepal'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  <FaExternalLinkAlt className="text-xs" /> Open in Google Maps
                </a>
                {!d?.mapEmbedUrl && (
                  <p className="text-xs text-gray-400">Add a Google Maps embed URL in the admin panel to show an interactive map here.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function FormField({ label, name, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 transition"
      />
    </div>
  );
}
