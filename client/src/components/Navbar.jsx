import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/blog', label: 'News' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const transparent = isHome && !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.jpg"
              alt="Shree Suryodaya Khadya Udhyog Limited"
              className="w-11 h-11 md:w-13 md:h-13 object-contain rounded-full shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
              style={{ width: '44px', height: '44px' }}
            />
            <div className="leading-tight">
              <div className={`font-heading font-bold text-base md:text-lg ${transparent ? 'text-white' : 'text-forest-800'} transition-colors`}>
                Shree Suryodaya
              </div>
              <div className={`text-xs ${transparent ? 'text-white/80' : 'text-gray-500'} transition-colors hidden sm:block`}>
                Khadya Udhyog Limited
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-forest-700 text-white shadow-sm'
                      : transparent
                      ? 'text-white/90 hover:bg-white/15'
                      : 'text-gray-700 hover:bg-forest-50 hover:text-forest-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* CTA button */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="btn-secondary text-sm px-5 py-2.5"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${transparent ? 'text-white' : 'text-gray-700'}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 mb-4 overflow-hidden border border-gray-100">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block px-5 py-3.5 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                    isActive ? 'bg-forest-700 text-white' : 'text-gray-700 hover:bg-forest-50 hover:text-forest-700'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="p-4 pt-3">
              <Link to="/contact" className="btn-primary w-full justify-center text-sm">
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
