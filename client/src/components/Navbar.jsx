import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';

const navLinks = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/gallery',  label: 'Gallery' },
  { to: '/blog',     label: 'News' },
  { to: '/contact',  label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location                    = useLocation();
  const isHome                      = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-sand-100/80 backdrop-blur-sm'
          : 'glass shadow-[0_1px_0_0_rgba(228,222,211,0.7)]'
      }`}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Shree Suryodaya"
                className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-gold-500/0 group-hover:ring-gold-400/50 transition-all duration-300" />
            </div>
            <div className="leading-none">
              <div className="font-heading font-bold text-[15px] tracking-tight text-ink-900">
                Shree Suryodaya
              </div>
              <div className="text-[10px] tracking-widest uppercase mt-0.5 hidden sm:block text-ink-400">
                Khadya Udhyog Limited
              </div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 group ${
                    isActive ? 'text-gold-600' : 'text-ink-600 hover:text-ink-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-gold-500 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 scale-x-100'
                        : 'opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100'
                    }`} />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="tel:+977"
              className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full border border-sand-300 text-ink-600 hover:border-gold-400 hover:text-gold-600 transition-all duration-300"
            >
              <FaPhone className="text-[10px]" /> Call Us
            </a>
            <Link
              to="/contact"
              className="flex items-center gap-1.5 text-[13px] font-semibold px-5 py-2.5 rounded-full bg-gold-500 text-white hover:bg-gold-600 transition-all duration-300 shadow-sm"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-ink-700 hover:bg-sand-200 transition-colors"
            aria-label="Open menu"
          >
            <FaBars size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile slide drawer */}
      <div className={`fixed inset-0 z-[60] transition-all duration-400 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-ink-900/50 backdrop-blur-sm transition-opacity duration-400 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer panel */}
        <div className={`absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-400 flex flex-col ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-sand-300">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" className="w-9 h-9 rounded-full object-cover" alt="Logo" />
              <div>
                <p className="font-heading font-bold text-ink-900 text-sm leading-tight">Shree Suryodaya</p>
                <p className="text-ink-400 text-[10px] tracking-wide">Khadya Udhyog Limited</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-full hover:bg-sand-200 text-ink-500 transition-colors"
              aria-label="Close menu"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 py-3 overflow-y-auto">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-4 text-sm font-medium border-b border-sand-200/60 transition-colors ${
                    isActive
                      ? 'text-gold-600 bg-gold-50 border-r-[3px] border-r-gold-500'
                      : 'text-ink-700 hover:bg-sand-100 hover:text-ink-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA footer */}
          <div className="px-6 py-5 border-t border-sand-300 space-y-3">
            <a
              href="tel:+977"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full border-2 border-ink-900 text-ink-900 font-semibold text-sm hover:bg-ink-900 hover:text-white transition-all"
            >
              <FaPhone className="text-xs" /> Call Us
            </a>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gold-500 text-white font-semibold text-sm hover:bg-gold-600 transition-all shadow-sm"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
