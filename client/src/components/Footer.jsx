import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaTwitter,
  FaArrowRight, FaLeaf,
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

const SOCIAL = {
  facebook:  { Icon: FaFacebook,  label: 'Facebook',  hoverBg: 'hover:bg-[#1877f2]' },
  instagram: { Icon: FaInstagram, label: 'Instagram', hoverBg: 'hover:bg-[#e1306c]' },
  whatsapp:  { Icon: FaWhatsapp,  label: 'WhatsApp',  hoverBg: 'hover:bg-[#25d366]' },
  youtube:   { Icon: FaYoutube,   label: 'YouTube',   hoverBg: 'hover:bg-[#ff0000]' },
  twitter:   { Icon: FaTwitter,   label: 'Twitter/X', hoverBg: 'hover:bg-[#1da1f2]' },
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
  const companyName    = s.companyName    || 'Shree Suryodaya Khadya Udhyog Limited';
  const tagline        = s.tagline        || "Nepal's Finest Rice, Milled with Pride";
  const phone          = s.phoneNumber    || '';
  const email          = s.email          || '';
  const factoryAddress = s.address        || 'Gaindakot, Nawalpur, Gandaki Province, Nepal';
  const headOfficeAddress = s.headOfficeAddress || '';

  const socialLinks = [
    s.facebookUrl   && { key: 'facebook',  url: s.facebookUrl },
    s.instagramUrl  && { key: 'instagram', url: s.instagramUrl },
    s.whatsappNumber && {
      key: 'whatsapp',
      url: `https://wa.me/${s.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(s.whatsappDefaultMessage || 'Hello!')}`,
    },
    s.youtubeUrl   && { key: 'youtube',   url: s.youtubeUrl },
    s.twitterUrl   && { key: 'twitter',   url: s.twitterUrl },
  ].filter(Boolean);

  return (
    <footer className="bg-ink-900 text-white">
      {/* Gold top accent */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* ── Brand column ── */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative flex-shrink-0">
                <img src="/logo.jpg" alt="Shree Suryodaya" className="w-13 h-13 rounded-full object-cover" style={{ width: 48, height: 48 }} />
                <div className="absolute inset-0 rounded-full ring-2 ring-gold-500/40" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-[15px] leading-tight">{companyName.split(' ').slice(0, 2).join(' ')}</p>
                <p className="text-white/40 text-[11px] tracking-wide mt-0.5">{companyName.split(' ').slice(2).join(' ')}</p>
              </div>
            </div>

            <div className="w-10 h-px bg-gold-500/40 mb-5" />

            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">{tagline}</p>

            <div className="flex items-center gap-1.5 text-white/35 text-xs mb-6">
              <FaLeaf className="text-gold-500/60 text-xs" />
              <span>Est. 2009 · Gaindakot, Nepal</span>
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map(({ key, url }) => {
                  const meta = SOCIAL[key];
                  if (!meta) return null;
                  const { Icon, label, hoverBg } = meta;
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-9 h-9 bg-white/8 border border-white/10 ${hoverBg} text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 hover:border-transparent hover:scale-110`}>
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

          {/* ── Quick Links ── */}
          <div className="lg:col-span-3 lg:col-start-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="group flex items-center gap-2 text-white/55 hover:text-gold-300 text-sm transition-colors duration-200">
                    <FaArrowRight className="text-[9px] text-gold-500/30 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Our Rice ── */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35 mb-6">Our Rice</h4>
            <ul className="space-y-3">
              {products.length > 0 ? products.map((p) => (
                <li key={p._id}>
                  <Link to="/products"
                    className="group flex items-center gap-2 text-white/55 hover:text-gold-300 text-sm transition-colors duration-200">
                    <FaArrowRight className="text-[9px] text-gold-500/30 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    <span className="line-clamp-1">{p.name}</span>
                  </Link>
                </li>
              )) : [...Array(4)].map((_, i) => (
                <li key={i} className="h-3 bg-white/8 rounded animate-pulse" style={{ width: `${55 + i * 8}%` }} />
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35 mb-6">Contact</h4>
            <ul className="space-y-4">
              {/* Factory address */}
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-gold-500/30 transition-colors">
                  <span className="text-[11px]">🏭</span>
                </div>
                <div>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Factory</p>
                  <span className="text-white/50 text-sm leading-relaxed">{factoryAddress}</span>
                </div>
              </li>
              {/* Head office address */}
              {headOfficeAddress && (
                <li className="flex items-start gap-3 group">
                  <div className="w-8 h-8 bg-white/5 border border-white/8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-gold-500/30 transition-colors">
                    <span className="text-[11px]">🏢</span>
                  </div>
                  <div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Head Office</p>
                    <span className="text-white/50 text-sm leading-relaxed">{headOfficeAddress}</span>
                  </div>
                </li>
              )}
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
                  <a href={`mailto:${email}`} className="text-white/50 hover:text-gold-300 text-sm break-all transition-colors">{email}</a>
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

      {/* Bottom bar */}
      <div className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {year} {companyName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/20 text-xs">
            <span className="w-1 h-1 rounded-full bg-gold-500/40 inline-block" />
            <span>Gaindakot, Nawalpur, Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
