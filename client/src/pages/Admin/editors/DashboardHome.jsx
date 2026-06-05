import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBoxOpen, FaNewspaper, FaImages, FaStar, FaEnvelope,
  FaArrowRight, FaCheckCircle, FaClock, FaExclamationCircle,
} from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
      <div>
        <p className="text-2xl font-bold font-heading text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MessageRow({ msg, onRead }) {
  const date = new Date(msg.createdAt).toLocaleDateString('en-NP', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${msg.isRead ? 'border-gray-100 bg-white' : 'border-forest-100 bg-forest-50'}`}>
      <div className="flex-shrink-0 mt-0.5">
        {msg.isRead
          ? <FaCheckCircle className="text-gray-300 text-base" />
          : <FaExclamationCircle className="text-forest-500 text-base" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-gray-800 text-sm truncate">{msg.name}</p>
          <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
        </div>
        <p className="text-xs text-gray-500 truncate">{msg.email}</p>
        {msg.message && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
        )}
      </div>
      {!msg.isRead && (
        <button
          onClick={() => onRead(msg._id)}
          className="flex-shrink-0 text-xs text-forest-600 hover:text-forest-800 font-medium"
        >
          Mark read
        </button>
      )}
    </div>
  );
}

export default function DashboardHome({ onNavigate }) {
  const { loadDashboard, markMessageRead } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    loadDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleRead = async (id) => {
    await markMessageRead(id);
    setStats((s) => ({
      ...s,
      messages: { ...s.messages, unread: Math.max(0, s.messages.unread - 1) },
      recentMessages: s.recentMessages.map((m) => m._id === id ? { ...m, isRead: true } : m),
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { icon: FaBoxOpen,   label: 'Products',     value: stats.products.total,     sub: `${stats.products.active} active`,     color: 'bg-forest-600' },
    { icon: FaNewspaper, label: 'Blog Posts',   value: stats.posts.total,        sub: `${stats.posts.published} published`,  color: 'bg-blue-500' },
    { icon: FaImages,    label: 'Gallery',      value: stats.gallery.active,     sub: 'active images',                       color: 'bg-purple-500' },
    { icon: FaStar,      label: 'Testimonials', value: stats.testimonials.active,sub: 'active reviews',                      color: 'bg-amber-500' },
    { icon: FaEnvelope,  label: 'Messages',     value: stats.messages.total,     sub: `${stats.messages.unread} unread`,     color: stats.messages.unread > 0 ? 'bg-red-500' : 'bg-gray-400' },
  ];

  const quickActions = [
    { label: 'Add Product',     key: 'products',   color: 'bg-forest-600 hover:bg-forest-700' },
    { label: 'Write Blog Post', key: 'blog',       color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Add Testimonial', key: 'testimonials', color: 'bg-amber-500 hover:bg-amber-600' },
    { label: 'View Messages',   key: 'messages',   color: 'bg-red-500 hover:bg-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.key}
              onClick={() => onNavigate(a.key)}
              className={`${a.color} text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2`}
            >
              {a.label} <FaArrowRight className="text-xs" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-bold text-forest-800 text-base">
            Recent Messages
            {stats.messages.unread > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {stats.messages.unread} unread
              </span>
            )}
          </h2>
          <button
            onClick={() => onNavigate('messages')}
            className="text-sm text-forest-600 hover:text-forest-800 flex items-center gap-1 font-medium"
          >
            View all <FaArrowRight className="text-xs" />
          </button>
        </div>

        {stats.recentMessages?.length > 0 ? (
          <div className="space-y-2">
            {stats.recentMessages.map((msg) => (
              <MessageRow key={msg._id} msg={msg} onRead={handleRead} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <FaEnvelope className="text-3xl mx-auto mb-2 opacity-30" />
            <p className="text-sm">No messages yet</p>
          </div>
        )}
      </div>

      {/* Website link */}
      <div className="bg-gradient-to-r from-forest-700 to-forest-900 rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <p className="font-bold">Shree Suryodaya Website</p>
          <p className="text-forest-200 text-sm">View your live site to verify changes</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-forest-800 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-forest-50 transition flex items-center gap-2"
        >
          Open Site <FaArrowRight className="text-xs" />
        </a>
      </div>
    </div>
  );
}
