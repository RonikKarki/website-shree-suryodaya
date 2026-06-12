import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaUser, FaTag, FaArrowLeft, FaEye, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import useSEO from '../hooks/useSEO';
import resolveUrl from '../lib/resolveUrl';

const categoryColors = {
  news:         'bg-blue-100 text-blue-800',
  product:      'bg-gold-100 text-gold-800',
  story:        'bg-sage-100 text-sage-800',
  event:        'bg-purple-100 text-purple-800',
  achievement:  'bg-rose-100 text-rose-800',
  announcement: 'bg-sand-200 text-ink-700',
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
  const [post, setPost]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated]   = useState([]);

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
      <div className="pt-24 min-h-screen bg-sand-100">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-5">
          <div className="h-8 bg-sand-300 rounded-xl w-1/4 animate-pulse" />
          <div className="h-12 bg-sand-300 rounded-xl animate-pulse" />
          <div className="h-64 bg-sand-200 rounded-2xl animate-pulse" />
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-sand-200 rounded-xl animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />)}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-sand-100">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="font-heading text-3xl font-bold text-ink-800 mb-3">Post Not Found</h1>
          <p className="text-ink-500 mb-6">This article does not exist or has been removed.</p>
          <Link to="/blog" className="btn-primary">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const shareUrl  = encodeURIComponent(window.location.href);
  const shareText = encodeURIComponent(`${post.title} — Shree Suryodaya`);

  return (
    <div className="pt-20 bg-sand-100 min-h-screen">
      {post.coverImage && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img src={resolveUrl(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/blog"
          className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-medium mb-8 group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to News &amp; Updates
        </Link>

        <article className="bg-white rounded-3xl border border-sand-300 p-8 md:p-12 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${categoryColors[post.category] || 'bg-sand-200 text-ink-600'}`}>
              {categoryLabels[post.category] || post.category}
            </span>
            <div className="flex items-center gap-4 text-ink-400 text-sm">
              <span className="flex items-center gap-1.5"><FaCalendar className="text-xs" />{formatDate(post.publishedAt || post.createdAt)}</span>
              <span className="flex items-center gap-1.5"><FaUser className="text-xs" />{post.author}</span>
              {post.views > 0 && <span className="flex items-center gap-1.5"><FaEye className="text-xs" />{post.views} views</span>}
            </div>
          </div>

          {!post.coverImage && (
            <div className="w-full h-48 bg-gradient-to-br from-sage-50 to-sand-200 rounded-2xl mb-6 flex items-center justify-center">
              <span className="text-6xl opacity-20">📰</span>
            </div>
          )}

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-ink-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-ink-500 font-medium leading-relaxed mb-8 pb-8 border-b border-sand-200">
              {post.excerpt}
            </p>
          )}

          <div className="prose prose-sm md:prose-base max-w-none">
            {post.content?.split('\n\n').map((para, i) => (
              <p key={i} className="text-ink-600 leading-relaxed mb-5 text-base">{para}</p>
            ))}
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-sand-200">
              <span className="text-sm text-ink-400 font-medium">Tags:</span>
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 text-sm bg-sand-100 text-ink-500 border border-sand-300 px-3 py-1 rounded-full">
                  <FaTag className="text-xs opacity-60" />{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-sand-200">
            <p className="text-sm font-semibold text-ink-400 mb-3">Share this post:</p>
            <div className="flex gap-3">
              <a href={`https://wa.me/?text=${shareText}%20${shareUrl}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
                <FaWhatsapp /> Share on WhatsApp
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#0e5fd8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
                <FaFacebook /> Share on Facebook
              </a>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <div>
            <h3 className="font-heading font-bold text-ink-900 text-xl mb-5">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((rp) => (
                <Link key={rp._id} to={`/blog/${rp.slug}`}
                  className="bg-white rounded-2xl border border-sand-300 hover:border-gold-300 hover:shadow-md transition-all duration-300 p-5 group flex gap-4">
                  {rp.coverImage ? (
                    <img src={resolveUrl(rp.coverImage)} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-sand-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl opacity-40">📰</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-800 group-hover:text-gold-700 text-sm leading-tight line-clamp-2 transition-colors">{rp.title}</p>
                    <p className="text-ink-400 text-xs mt-1">{formatDate(rp.publishedAt || rp.createdAt)}</p>
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
