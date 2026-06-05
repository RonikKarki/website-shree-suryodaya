import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaUser, FaTag, FaArrowRight, FaEye } from 'react-icons/fa';
import PageHero from '../components/PageHero';
import SectionReveal from '../components/SectionReveal';
import useSEO from '../hooks/useSEO';

const CATEGORIES = [
  { key: 'all',          label: 'All Posts' },
  { key: 'news',         label: 'News' },
  { key: 'product',      label: 'Products' },
  { key: 'story',        label: 'Stories' },
  { key: 'event',        label: 'Events' },
  { key: 'achievement',  label: 'Achievements' },
  { key: 'announcement', label: 'Announcements' },
];

const categoryColors = {
  news:         'bg-blue-100 text-blue-800',
  product:      'bg-amber-100 text-amber-800',
  story:        'bg-green-100 text-green-800',
  event:        'bg-purple-100 text-purple-800',
  achievement:  'bg-rose-100 text-rose-800',
  announcement: 'bg-slate-100 text-slate-700',
};

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function PostCard({ post, featured = false }) {
  return (
    <article className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-forest-200 flex flex-col ${featured ? 'lg:flex-row' : ''}`}>
      {/* Cover image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${featured ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-52'} bg-gradient-to-br from-forest-50 to-forest-100`}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl opacity-15 select-none">📰</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
            {CATEGORIES.find((c) => c.key === post.category)?.label || post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
          <span className="flex items-center gap-1">
            <FaCalendar className="text-xs" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <FaUser className="text-xs" />
            {post.author}
          </span>
          {post.views > 0 && (
            <span className="flex items-center gap-1 ml-auto">
              <FaEye className="text-xs" />
              {post.views}
            </span>
          )}
        </div>

        <h2 className={`font-heading font-bold text-forest-800 group-hover:text-forest-600 transition-colors mb-3 leading-tight ${featured ? 'text-2xl' : 'text-lg'}`}>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        <p className={`text-gray-600 text-sm leading-relaxed mb-4 flex-1 ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}>
          {post.excerpt}
        </p>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                <FaTag className="text-xs opacity-60" />{tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-800 font-semibold text-sm transition-colors group/link"
        >
          Read More
          <FaArrowRight className="text-xs group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
}

export default function Blog() {
  useSEO({ title: 'News & Updates', description: 'Latest news, product announcements, and stories from Shree Suryodaya Khadya Udhyog Limited — Nawalpur\'s trusted rice milling company.' });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 6;

  useEffect(() => {
    setLoading(true);
    const cat = activeCategory !== 'all' ? `&category=${activeCategory}` : '';
    axios.get(`/api/blog?page=${page}&limit=${LIMIT}${cat}`)
      .then((r) => {
        setPosts(r.data.data || []);
        setTotalPages(r.data.pages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, page]);

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setPage(1);
  };

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        breadcrumb="News & Updates"
        title="Blog & News"
        subtitle="Stay up to date with company announcements, product launches, farmer stories, and industry updates from Shree Suryodaya."
      />

      {/* ── Category tabs ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[64px] md:top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === key
                    ? 'bg-forest-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Posts ── */}
      <section className="py-14 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-6">
              <div className="h-64 bg-white rounded-2xl animate-pulse" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />)}
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="font-heading font-bold text-gray-700 text-xl mb-2">No posts yet</h3>
              <p className="text-gray-400">Check back soon for company news and updates.</p>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && page === 1 && (
                <SectionReveal className="mb-8">
                  <PostCard post={featured} featured />
                </SectionReveal>
              )}

              {/* Grid of remaining posts */}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(page === 1 ? rest : posts).map((post, i) => (
                    <SectionReveal key={post._id} delay={i * 60}>
                      <PostCard post={post} />
                    </SectionReveal>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${page === i + 1 ? 'bg-forest-700 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
