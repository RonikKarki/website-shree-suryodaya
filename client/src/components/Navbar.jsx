import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/blog',     label: 'News' },
  { to: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location              = useLocation();
  const isHome                = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      transparent ? 'bg-transparent' : 'bg-white/96 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
    }`}>

      {/* ── Top info strip (desktop only, hidden on scroll) ── */}
      <div className={`overflow-hidden transition-all duration-500 ${
        scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'
      } ${transparent ? 'border-b border-white/10' : 'border-b border-gray-100 bg-[#0D1B0E]'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 hidden md:flex items-center justify-between py-1.5">
          <div className="flex items-center gap-5 text-xs">
            <span className="flex items-center gap-1.5 text-white/70">
              <FaMapMarkerAlt className="text-gold-500" />
              Gaindakot, Nawalpur, Nepal
            </span>
          </div>
          <a href="tel:+977" className="flex items-center gap-1.5 text-xs text-white/70 hover:text-gold-400 transition-colors">
            <FaPhone className="text-gold-500 text-[10px]" />
            Call Us
          </a>
        </div>
      </div>

      {/* ── Main nav ── */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Shree Suryodaya"
                className="w-10 h-10 md:w-11 md:h-11 object-contain rounded-full shadow-md group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-gold-500/0 group-hover:ring-gold-500/40 transition-all duration-300" />
            </div>
            <div className="leading-none">
              <div className={`font-heading font-bold text-[15px] md:text-base tracking-tight transition-colors duration-300 ${
                transparent ? 'text-white' : 'text-charcoal-900'
              }`}>
                Shree Suryodaya
              </div>
              <div className={`text-[10px] tracking-widest uppercase mt-0.5 transition-colors duration-300 hidden sm:block ${
                transparent ? 'text-white/60' : 'text-gray-400'
              }`}>
                Khadya Udhyog Limited
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors duration-200 group ${
                    isActive
                      ? transparent ? 'text-gold-300' : 'text-gold-600'
                      : transparent ? 'text-white/85 hover:text-white' : 'text-gray-600 hover:text-charcoal-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gold-500 rounded-full transition-all duration-300 ${
                      isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'
                    }`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className={`hidden md:inline-flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full border-2 transition-all duration-300 ${
                transparent
                  ? 'border-white/40 text-white hover:bg-white hover:text-charcoal-900 hover:border-white'
                  : 'border-forest-700 text-forest-700 hover:bg-forest-700 hover:text-white'
              }`}
            >
              Get in Touch
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {open ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white rounded-2xl shadow-xl mb-4 border border-gray-100 overflow-hidden">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-5 py-3.5 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                    isActive ? 'text-gold-600 bg-gold-50' : 'text-gray-700 hover:bg-gray-50 hover:text-charcoal-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
                  </>
                )}
              </NavLink>
            ))}
            <div className="p-4">
              <Link to="/contact" className="btn-primary w-full justify-center">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
