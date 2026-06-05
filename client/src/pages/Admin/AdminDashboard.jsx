import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSignOutAlt, FaHome, FaImage, FaStar, FaCog,
  FaChartBar, FaImages, FaBullhorn, FaList, FaEnvelope,
  FaBoxOpen, FaWrench, FaCheck, FaTimes, FaExternalLinkAlt,
  FaInfoCircle, FaPhotoVideo, FaNewspaper, FaAddressCard,
  FaShieldAlt, FaThLarge, FaClock, FaTag,
} from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

// Homepage section editors
import HeroEditor from './editors/HeroEditor';
import CompanyIntroEditor from './editors/CompanyIntroEditor';
import WhyChooseUsEditor from './editors/WhyChooseUsEditor';
import ProcessEditor from './editors/ProcessEditor';
import FeaturedProductsEditor from './editors/FeaturedProductsEditor';
import StatsEditor from './editors/StatsEditor';
import GalleryEditor from './editors/GalleryEditor';
import CtaEditor from './editors/CtaEditor';
import HomepageTestimonialsEditor from './editors/HomepageTestimonialsEditor';
import HomepageBrandsSectionEditor from './editors/HomepageBrandsSectionEditor';

// Content managers
import DashboardHome from './editors/DashboardHome';
import ProductsManager from './editors/ProductsManager';
import TestimonialsManager from './editors/TestimonialsManager';
import MessagesViewer from './editors/MessagesViewer';
import SecurityEditor from './editors/SecurityEditor';
import FactoryEditor  from './editors/FactoryEditor';
import BrandsManager  from './editors/BrandsManager';
import SettingsEditor from './editors/SettingsEditor';
import AboutEditor from './editors/AboutEditor';
import GalleryManager from './editors/GalleryManager';
import BlogManager from './editors/BlogManager';
import ContactEditor from './editors/ContactEditor';

// ─── Sidebar structure ──────────────────────────────────────────────────────
const SIDEBAR_GROUPS = [
  {
    groupLabel: 'Overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: FaThLarge },
    ],
  },
  {
    groupLabel: 'Homepage Sections',
    items: [
      { key: 'hero',                 label: 'Hero Slider',        icon: FaImage },
      { key: 'companyIntro',         label: 'Company Intro',      icon: FaHome },
      { key: 'whyChooseUs',          label: 'Why Choose Us',      icon: FaStar },
      { key: 'process',              label: 'Process Steps',      icon: FaCog },
      { key: 'featuredProducts',     label: 'Featured Products',  icon: FaList },
      { key: 'stats',                label: 'Statistics',         icon: FaChartBar },
      { key: 'gallery',              label: 'Factory Gallery',    icon: FaImages },
      { key: 'brandsSection',        label: 'Brands Section',     icon: FaTag },
      { key: 'testimonialsSection',  label: 'Testimonials',       icon: FaStar },
      { key: 'cta',                  label: 'Call to Action',     icon: FaBullhorn },
    ],
  },
  {
    groupLabel: 'Page Content',
    items: [
      { key: 'about',         label: 'About Us',      icon: FaInfoCircle },
      { key: 'factory',       label: 'Our Factory',   icon: FaCog },
      { key: 'galleryPage',   label: 'Gallery',       icon: FaPhotoVideo },
      { key: 'blog',          label: 'Blog & News',   icon: FaNewspaper },
      { key: 'contactPage',   label: 'Contact Page',  icon: FaAddressCard },
    ],
  },
  {
    groupLabel: 'Content',
    items: [
      { key: 'products',      label: 'Products',       icon: FaBoxOpen },
      { key: 'brands',        label: 'Brands',         icon: FaTag },
      { key: 'testimonials',  label: 'Testimonials',   icon: FaStar },
      { key: 'messages',      label: 'Messages',       icon: FaEnvelope, badge: true },
    ],
  },
  {
    groupLabel: 'Settings',
    items: [
      { key: 'settings',   label: 'Site Settings', icon: FaWrench },
      { key: 'security',   label: 'Security',      icon: FaShieldAlt },
    ],
  },
];

const ALL_ITEMS = SIDEBAR_GROUPS.flatMap((g) => g.items);

const HOMEPAGE_EDITORS = {
  hero:                HeroEditor,
  companyIntro:        CompanyIntroEditor,
  whyChooseUs:         WhyChooseUsEditor,
  process:             ProcessEditor,
  featuredProducts:    FeaturedProductsEditor,
  stats:               StatsEditor,
  gallery:             GalleryEditor,
  brandsSection:       HomepageBrandsSectionEditor,
  testimonialsSection: HomepageTestimonialsEditor,
  cta:                 CtaEditor,
};

const SECTION_DESCRIPTIONS = {
  dashboard:            'Overview of your site — stats, quick actions, and recent messages.',
  products:             'Add, edit, reorder, and manage all product listings.',
  testimonials:         'Manage customer reviews and testimonials shown on the homepage.',
  messages:             'View and manage contact form submissions from visitors.',
  settings:             'Configure WhatsApp number, contact info, and social links.',
  brands:              'Manage rice brand identities — Manaslu, Namche, and future brands.',
  factory:             'Factory process steps, machinery table, capacity stats, quality assurance, and location map.',
  security:             'Change admin password and review security settings.',
  about:                'Edit company profile, vision, mission, values, history, and team.',
  galleryPage:          'Upload, organise, and manage factory and operations photos.',
  blog:                 'Write, publish, and manage company news and blog posts.',
  contactPage:          'Edit contact details, phone, email, map, and social links.',
};

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { token, logout, content, loadContent, saving, toast, unreadCount, isSessionExpired } = useAdmin();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [hpLoading, setHpLoading] = useState(false);
  const [hpLoaded, setHpLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    if (isSessionExpired()) { logout(); navigate('/admin'); }
  }, [token]);

  // Lazy-load homepage content only when a homepage section is selected
  useEffect(() => {
    const isHomepageSection = Object.keys(HOMEPAGE_EDITORS).includes(activeSection);
    if (isHomepageSection && !hpLoaded) {
      setHpLoading(true);
      loadContent()
        .catch(() => { logout(); navigate('/admin'); })
        .finally(() => { setHpLoading(false); setHpLoaded(true); });
    }
  }, [activeSection, hpLoaded]);

  const handleLogout = () => { logout(); navigate('/admin'); };
  const navigateTo = useCallback((key) => { setActiveSection(key); setSidebarOpen(false); }, []);
  const activeMeta = ALL_ITEMS.find((s) => s.key === activeSection);

  const isHomepageSection = Object.keys(HOMEPAGE_EDITORS).includes(activeSection);
  const ActiveEditor = HOMEPAGE_EDITORS[activeSection];

  // Session time remaining (approximate)
  const [sessionInfo, setSessionInfo] = useState('');
  useEffect(() => {
    const expiry = Number(localStorage.getItem('admin_token_expiry'));
    if (!expiry) return;
    const remaining = expiry * 1000 - Date.now();
    if (remaining <= 0) return;
    const hrs = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    setSessionInfo(hrs > 0 ? `Session: ${hrs}h ${mins}m left` : `Session: ${mins}m left`);
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-16 md:pt-20">
      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium transition-all duration-300 max-w-sm ${toast.type === 'success' ? 'bg-forest-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <FaCheck /> : <FaTimes />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full px-2 sm:px-4 lg:px-6 py-6 gap-6">
        {/* ── Sidebar ── */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-40 w-64
          bg-white rounded-2xl shadow-sm flex flex-col
          transition-transform duration-300 md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:block mt-16 md:mt-0 h-[calc(100vh-6rem)] md:h-auto md:self-start md:sticky md:top-24
        `}>
          {/* Brand */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Shree Suryodaya"
              className="flex-shrink-0 object-contain rounded-full"
              style={{ width: '38px', height: '38px' }}
            />
            <div>
              <p className="font-bold text-forest-800 text-sm leading-tight">Admin Panel</p>
              <p className="text-gray-400 text-xs">Shree Suryodaya</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
            {SIDEBAR_GROUPS.map((group) => (
              <div key={group.groupLabel}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 py-2">
                  {group.groupLabel}
                </p>
                <div className="space-y-0.5">
                  {group.items.map(({ key, label, icon: Icon, badge }) => (
                    <button
                      key={key}
                      onClick={() => navigateTo(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeSection === key
                          ? 'bg-forest-700 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-forest-700'
                      }`}
                    >
                      <Icon className="flex-shrink-0 text-base" />
                      <span className="flex-1 text-left">{label}</span>
                      {badge && unreadCount > 0 && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
                          activeSection === key ? 'bg-white text-forest-700' : 'bg-red-500 text-white'
                        }`}>
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 space-y-1">
            {sessionInfo && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400">
                <FaClock className="text-xs flex-shrink-0" />
                {sessionInfo}
              </div>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition"
            >
              <FaExternalLinkAlt className="text-xs" /> View Website
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Main ── */}
        <main className="flex-1 min-w-0">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between bg-white rounded-2xl shadow-sm p-4 mb-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-forest-700">
              <FaList />
            </button>
            <p className="font-semibold text-forest-800 text-sm">
              {activeMeta?.label}
              {activeMeta?.badge && unreadCount > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </p>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
              <FaSignOutAlt />
            </button>
          </div>

          {/* Desktop page header */}
          <div className="hidden md:flex items-center justify-between bg-white rounded-2xl shadow-sm px-6 py-4 mb-6">
            <div>
              <h1 className="font-heading font-bold text-forest-800 text-xl flex items-center gap-2">
                {activeMeta?.label}
                {activeMeta?.badge && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                )}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {SECTION_DESCRIPTIONS[activeSection] || 'Changes are saved to MongoDB and go live immediately.'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {sessionInfo && (
                <span className="hidden lg:flex items-center gap-1.5 text-xs text-gray-400">
                  <FaClock /> {sessionInfo}
                </span>
              )}
              {saving && (
                <div className="flex items-center gap-2 text-forest-600 text-sm">
                  <div className="w-4 h-4 border-2 border-forest-600 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              )}
            </div>
          </div>

          {/* Editor area */}
          {activeSection === 'dashboard' ?    <DashboardHome onNavigate={navigateTo} /> :
           activeSection === 'products' ?     <ProductsManager /> :
           activeSection === 'brands' ?        <BrandsManager /> :
           activeSection === 'testimonials' ? <TestimonialsManager /> :
           activeSection === 'messages' ?     <MessagesViewer /> :
           activeSection === 'settings' ?     <SettingsEditor /> :
           activeSection === 'security' ?     <SecurityEditor /> :
           activeSection === 'about' ?        <AboutEditor /> :
           activeSection === 'factory' ?      <FactoryEditor /> :
           activeSection === 'galleryPage' ?  <GalleryManager /> :
           activeSection === 'blog' ?         <BlogManager /> :
           activeSection === 'contactPage' ?  <ContactEditor /> :
           isHomepageSection ? (
            hpLoading ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="text-5xl mb-4 animate-float">🌾</div>
                <p className="text-gray-500">Loading content...</p>
              </div>
            ) : content && ActiveEditor ? (
              <ActiveEditor data={content[activeSection]} sectionKey={activeSection} />
            ) : null
          ) : null}
        </main>
      </div>
    </div>
  );
}
