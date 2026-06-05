import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaTwitter,
} from 'react-icons/fa';

const quickLinks = [
  { to: '/',        label: 'Home' },
  { to: '/about',   label: 'About Us' },
  { to: '/products',label: 'Our Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog',    label: 'News & Updates' },
  { to: '/factory', label: 'Our Factory' },
  { to: '/contact', label: 'Contact Us' },
];

const SOCIAL_ICONS = {
  facebook:  { Icon: FaFacebook,  label: 'Facebook' },
  instagram: { Icon: FaInstagram, label: 'Instagram' },
  whatsapp:  { Icon: FaWhatsapp,  label: 'WhatsApp' },
  youtube:   { Icon: FaYoutube,   label: 'YouTube' },
  twitter:   { Icon: FaTwitter,   label: 'Twitter / X' },
};

export default function Footer() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/settings')
      .then((r) => setSettings(r.data.data || {}))
      .catch(() => {});
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

  // Build social links from settings
  const socialLinks = [
    s.facebookUrl  && { key: 'facebook',  url: s.facebookUrl },
    s.instagramUrl && { key: 'instagram', url: s.instagramUrl },
    s.whatsappNumber && {
      key: 'whatsapp',
      url: `https://wa.me/${s.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(s.whatsappDefaultMessage || 'Hello!')}`,
    },
    s.youtubeUrl   && { key: 'youtube',  url: s.youtubeUrl },
    s.twitterUrl   && { key: 'twitter',  url: s.twitterUrl },
  ].filter(Boolean);

  return (
    <footer className="bg-forest-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.jpg"
                alt="Shree Suryodaya Khadya Udhyog Limited"
                className="flex-shrink-0 object-contain rounded-full bg-white"
                style={{ width: '52px', height: '52px' }}
              />
              <div>
                <div className="font-heading font-bold text-lg text-white leading-tight">
                  {companyName.split(' ').slice(0, 2).join(' ')}
                </div>
                <div className="text-xs text-white/60">
                  {companyName.split(' ').slice(2).join(' ')}
                </div>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed mb-5">{tagline}</p>

            {socialLinks.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {socialLinks.map(({ key, url }) => {
                  const meta = SOCIAL_ICONS[key];
                  if (!meta) return null;
                  const { Icon, label } = meta;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 bg-white/10 hover:bg-brand-500 text-white hover:text-forest-900 rounded-full flex items-center justify-center transition-all duration-200"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            ) : (
              /* Placeholder while settings load */
              <div className="flex gap-2">
                {['fb', 'wa'].map((k) => (
                  <div key={k} className="w-9 h-9 bg-white/10 rounded-full" />
                ))}
              </div>
            )}
          </div>

          {/* ── Quick links ── */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/70 hover:text-brand-400 text-sm transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <span className="text-brand-500">›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Products ── */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Our Rice</h4>
            <ul className="space-y-2.5">
              {products.length > 0 ? (
                products.map((p) => (
                  <li key={p._id}>
                    <Link
                      to="/products"
                      className="text-white/70 hover:text-brand-400 text-sm transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <span className="text-brand-500">›</span> {p.name}
                    </Link>
                  </li>
                ))
              ) : (
                /* Skeleton while loading */
                [...Array(5)].map((_, i) => (
                  <li key={i} className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                ))
              )}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h4 className="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-brand-400 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">{address}</span>
              </li>
              {phone && (
                <li className="flex items-center gap-3">
                  <FaPhone className="text-brand-400 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="text-white/70 hover:text-brand-400 text-sm transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-3">
                  <FaEnvelope className="text-brand-400 mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-white/70 hover:text-brand-400 text-sm transition-colors break-all">
                    {email}
                  </a>
                </li>
              )}
              {!phone && !email && !settings && (
                /* Skeleton */
                <>
                  <li className="h-4 bg-white/10 rounded animate-pulse w-4/5" />
                  <li className="h-4 bg-white/10 rounded animate-pulse w-3/5" />
                </>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-white/50 text-sm">
            © {year} {companyName}. All rights reserved.
          </p>
          <p className="text-white/35 text-xs">
            {s.address ? s.address.split(',').slice(-2).join(',').trim() : 'Gaindakot, Nawalpur, Nepal'}
          </p>
        </div>
      </div>
    </footer>
  );
}
