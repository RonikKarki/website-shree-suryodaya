import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaTwitter,
  FaArrowRight,
} from 'react-icons/fa';

const quickLinks = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About Us' },
  { to: '/products', label: 'Our Products' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/blog',     label: 'News & Updates' },
  { to: '/factory',  label: 'Our Factory' },
  { to: '/contact',  label: 'Contact Us' },
];

const SOCIAL_ICONS = {
  facebook:  { Icon: FaFacebook,  label: 'Facebook',  color: 'hover:bg-[#1877f2]' },
  instagram: { Icon: FaInstagram, label: 'Instagram', color: 'hover:bg-[#e1306c]' },
  whatsapp:  { Icon: FaWhatsapp,  label: 'WhatsApp',  color: 'hover:bg-[#25d366]' },
  youtube:   { Icon: FaYoutube,   label: 'YouTube',   color: 'hover:bg-[#ff0000]' },
  twitter:   { Icon: FaTwitter,   label: 'Twitter/X', color: 'hover:bg-[#1da1f2]' },
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/settings').then((r) => setSettings(r.data.data || {})).catch(() => {});
    axios.get('/api/products')
      .then((r) => setProducts((r.data.data || []).filter((p) => p.isActive).slice(0, 6)))
      .catch(() => {});
  }, []);

  const s = settings || {};
  const companyName = s.companyName || 'Shree Suryodaya Khadya Udhyog Limited';
  const tagline     = s.tagline || "Nepal's Finest Rice, Milled with Pride";
  const phone       = s.phoneNumber || '';
  const email       = s.email || '';
  const address     = s.address || 'Gaindakot, Nawalpur, Gandaki Province, Nepal';

  const socialLinks = [
    s.facebookUrl   && { key: 'facebook',  url: s.facebookUrl },
    s.instagramUrl  && { key: 'instagram', url: s.instagramUrl },
    s.whatsappNumber && {
      key: 'whatsapp',
      url: `https://wa.me/${s.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(s.whatsappDefaultMessage || 'Hello!')}`,
    },
    s.youtubeUrl    && { key: 'youtube',  url: s.youtubeUrl },
    s.twitterUrl    && { key: 'twitter',  url: s.twitterUrl },
  ].filter(Boolean);

  return (
    <footer className="bg-[#0a120b] text-white">

      {/* ── Decorative top border ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* ── Main footer body ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* ── Brand column (spans 4 cols) ── */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <img
                  src="/logo.jpg"
                  alt="Shree Suryodaya"
                  className="w-13 h-13 object-contain rounded-full"
                  style={{ width: 52, height: 52 }}
                />
                <div className="absolute inset-0 rounded-full ring-2 ring-gold-500/30" />
              </div>
              <div className="leading-tight">
                <div className="font-heading font-bold text-white text-base">
                  {companyName.split(' ').slice(0, 2).join(' ')}
                </div>
                <div className="text-[11px] text-white/40 tracking-wide mt-0.5">
                  {companyName.split(' ').slice(2).join(' ')}
                </div>
              </div>
            </div>

            <div className="w-12 h-px bg-gold-500/40 mb-5" />

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">{tagline}</p>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map(({ key, url }) => {
                  const meta = SOCIAL_ICONS[key];
                  if (!meta) return null;
                  const { Icon, label, color } = meta;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-9 h-9 bg-white/8 border border-white/10 ${color} text-white rounded-full flex items-center justify-center transition-all duration-300 hover:border-transparent hover:scale-110`}>
                      <Icon className="text-sm" />
                    </a>
                  );
                })}
              </div>
            )}
            {socialLinks.length === 0 && (
              <div className="flex gap-2">
                {[1, 2].map((k) => <div key={k} className="w-9 h-9 bg-white/8 rounded-full border border-white/5" />)}
              </div>
            )}
          </div>

          {/* ── Quick Links (3 cols) ── */}
          <div className="lg:col-span-3 lg:col-start-5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="group flex items-center gap-2 text-white/55 hover:text-gold-300 text-sm transition-colors duration-200">
                    <FaArrowRight className="text-[8px] text-gold-500/40 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Products (2 cols) ── */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Our Rice
            </h4>
            <ul className="space-y-3">
              {products.length > 0 ? products.map((p) => (
                <li key={p._id}>
                  <Link to="/products"
                    className="group flex items-center gap-2 text-white/55 hover:text-gold-300 text-sm transition-colors duration-200">
                    <FaArrowRight className="text-[8px] text-gold-500/40 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                    {p.name}
                  </Link>
                </li>
              )) : [...Array(4)].map((_, i) => (
                <li key={i} className="h-3 bg-white/8 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
              ))}
            </ul>
          </div>

          {/* ── Contact (3 cols) ── */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-gold-500/30 transition-colors">
                  <FaMapMarkerAlt className="text-gold-500/60 text-xs" />
                </div>
                <span className="text-white/50 text-sm leading-relaxed pt-1">{address}</span>
              </li>
              {phone && (
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:border-gold-500/30 transition-colors">
                    <FaPhone className="text-gold-500/60 text-xs" />
                  </div>
                  <a href={`tel:${phone}`} className="text-white/50 hover:text-gold-300 text-sm transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-gold-500/30 transition-colors">
                    <FaEnvelope className="text-gold-500/60 text-xs" />
                  </div>
                  <a href={`mailto:${email}`} className="text-white/50 hover:text-gold-300 text-sm transition-colors break-all pt-1">{email}</a>
                </li>
              )}
              {!phone && !email && !settings && (
                <>
                  <li className="h-3 bg-white/8 rounded animate-pulse w-4/5" />
                  <li className="h-3 bg-white/8 rounded animate-pulse w-3/5" />
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {year} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500/50" />
            <p className="text-white/20 text-xs">Gaindakot, Nawalpur, Nepal</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
