import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaUser, FaTag, FaArrowLeft, FaEye, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import useSEO from '../hooks/useSEO';

const categoryColors = {
  news: 'bg-blue-100 text-blue-800', product: 'bg-amber-100 text-amber-800',
  story: 'bg-green-100 text-green-800', event: 'bg-purple-100 text-purple-800',
  achievement: 'bg-rose-100 text-rose-800', announcement: 'bg-slate-100 text-slate-700',
};

const categoryLabels = {
  news: 'News', product: 'Products', story: 'Story', event: 'Event',
  achievement: 'Achievement', announcement: 'Announcement',
};

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState([]);

  useSEO({
    title: post?.title || 'Blog',
    description: post?.excerpt || 'Read the latest news and updates from Shree Suryodaya Khadya Udhyog Limited.',
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setLoading(true);
    axios.get(`/api/blog/${slug}`)
      .then((r) => {
        setPost(r.data.data);
        // Fetch related posts from same category
        return axios.get(`/api/blog?category=${r.data.data.category}&limit=3`);
      })
      .then((r) => {
        setRelated((r.data.data || []).filter((p) => p.slug !== slug).slice(0, 2));
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-16 space-y-5">
          <div className="h-8 bg-gray-200 rounded-xl w-1/4 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded-xl animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />)}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="font-heading text-3xl font-bold text-gray-800 mb-3">Post Not Found</h1>
          <p className="text-gray-500 mb-6">This article does not exist or has been removed.</p>
          <Link to="/blog" className="btn-primary">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`${post.title} — Shree Suryodaya`);

  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* ── Cover image ── */}
      {post.coverImage && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* ── Back button ── */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-800 text-sm font-medium mb-8 group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to News & Updates
        </Link>

        {/* ── Article header ── */}
        <article className="bg-white rounded-3xl shadow-sm p-8 md:p-12 mb-8">
          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
              {categoryLabels[post.category] || post.category}
            </span>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1.5"><FaCalendar className="text-xs" />{formatDate(post.publishedAt || post.createdAt)}</span>
              <span className="flex items-center gap-1.5"><FaUser className="text-xs" />{post.author}</span>
              {post.views > 0 && <span className="flex items-center gap-1.5"><FaEye className="text-xs" />{post.views} views</span>}
            </div>
          </div>

          {/* Cover image inline if no hero */}
          {!post.coverImage && (
            <div className="w-full h-48 bg-gradient-to-br from-forest-50 to-forest-100 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-6xl opacity-20">📰</span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest-800 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8 pb-8 border-b border-gray-100">
              {post.excerpt}
            </p>
          )}

          {/* Body content */}
          <div className="prose prose-sm md:prose-base max-w-none">
            {post.content?.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-5 text-base">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
              <span className="text-sm text-gray-500 font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  <FaTag className="text-xs opacity-60" />{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-500 mb-3">Share this post:</p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
              >
                <FaWhatsapp /> Share on WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#0e5fd8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm"
              >
                <FaFacebook /> Share on Facebook
              </a>
            </div>
          </div>
        </article>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div>
            <h3 className="font-heading font-bold text-forest-800 text-xl mb-5">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((rp) => (
                <Link
                  key={rp._id}
                  to={`/blog/${rp.slug}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-5 group flex gap-4"
                >
                  {rp.coverImage ? (
                    <img src={rp.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl opacity-40">📰</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-forest-800 group-hover:text-forest-600 text-sm leading-tight line-clamp-2 transition-colors">{rp.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{formatDate(rp.publishedAt || rp.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
