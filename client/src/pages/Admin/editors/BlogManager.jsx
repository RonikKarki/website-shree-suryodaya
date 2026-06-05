import { useState, useEffect, useCallback } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSave,
  FaTimes, FaCalendar, FaUser, FaTag, FaSearch,
} from 'react-icons/fa';
import ImageUpload from '../../../components/admin/ImageUpload';

const CATEGORIES = [
  { value: 'news',          label: 'News' },
  { value: 'product',       label: 'Products' },
  { value: 'story',         label: 'Stories' },
  { value: 'event',         label: 'Events' },
  { value: 'achievement',   label: 'Achievement' },
  { value: 'announcement',  label: 'Announcement' },
];

const categoryColors = {
  news: 'bg-blue-100 text-blue-800', product: 'bg-amber-100 text-amber-800',
  story: 'bg-green-100 text-green-800', event: 'bg-purple-100 text-purple-800',
  achievement: 'bg-rose-100 text-rose-800', announcement: 'bg-slate-100 text-slate-700',
};

const emptyForm = {
  title: '', excerpt: '', content: '', coverImage: '', category: 'news',
  tags: [], author: 'Shree Suryodaya Team', isPublished: false,
};

function PostFormPanel({ post, onSave, onClose, saving }) {
  const isEditing = Boolean(post?._id);
  const [form, setForm] = useState(post ? { ...emptyForm, ...post } : { ...emptyForm });
  const [tagInput, setTagInput] = useState('');
  const [preview, setPreview] = useState(false);
  const [formError, setFormError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) { set('tags', [...form.tags, t]); setTagInput(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.title.trim()) { setFormError('Title is required.'); return; }
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-forest-800 text-lg">{isEditing ? 'Edit Post' : 'New Post'}</h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview((p) => !p)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${preview ? 'bg-forest-100 text-forest-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <FaEye /> {preview ? 'Edit Mode' : 'Preview'}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><FaTimes /></button>
          </div>
        </div>

        {preview ? (
          /* PREVIEW MODE */
          <div className="flex-1 p-8 overflow-y-auto">
            {form.coverImage && <img src={form.coverImage} alt="" className="w-full h-48 object-cover rounded-2xl mb-6" />}
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[form.category] || 'bg-gray-100'}`}>
              {CATEGORIES.find((c) => c.value === form.category)?.label}
            </span>
            <h1 className="font-heading text-2xl font-bold text-forest-800 mt-4 mb-3">{form.title || 'Post Title'}</h1>
            <p className="text-gray-500 text-sm mb-6">{form.author} · {new Date().toLocaleDateString()}</p>
            {form.excerpt && <p className="text-lg text-gray-600 border-l-4 border-forest-600 pl-4 mb-6">{form.excerpt}</p>}
            <div className="space-y-4">
              {form.content?.split('\n\n').map((p, i) => <p key={i} className="text-gray-700 leading-relaxed">{p}</p>)}
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {form.tags.map((t) => <span key={t} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"><FaTag className="text-xs opacity-60" />{t}</span>)}
              </div>
            )}
          </div>
        ) : (
          /* EDIT MODE */
          <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-5">
            <ImageUpload label="Cover Image" value={form.coverImage} onChange={(url) => set('coverImage', url)} height="h-48" />

            <fieldset>
              <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Post Details</legend>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Post title" required className={icls} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(({ value, label }) => (
                      <button key={value} type="button" onClick={() => set('category', value)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium border-2 transition ${form.category === value ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-gray-100 text-gray-600'}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Excerpt / Summary</label>
                  <textarea rows={3} value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} placeholder="Short summary shown in the blog listing..." className={`${icls} resize-none`} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Content <span className="text-gray-400 font-normal">(use blank line between paragraphs)</span>
                  </label>
                  <textarea rows={16} value={form.content} onChange={(e) => set('content', e.target.value)} placeholder="Write your full article here..." className={`${icls} resize-none font-mono text-xs`} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Author</label>
                  <input type="text" value={form.author} onChange={(e) => set('author', e.target.value)} className={icls} />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Type tag and press Enter" className={`${icls} flex-1`} />
                    <button type="button" onClick={addTag} className="bg-forest-700 text-white px-4 rounded-xl text-sm font-medium hover:bg-forest-800 transition">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags.map((t) => (
                      <span key={t} className="flex items-center gap-1.5 text-xs bg-forest-50 text-forest-700 border border-forest-100 px-3 py-1.5 rounded-full">
                        {t}
                        <button type="button" onClick={() => set('tags', form.tags.filter((x) => x !== t))} className="text-forest-400 hover:text-red-500"><FaTimes className="text-xs" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => set('isPublished', !form.isPublished)} className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${form.isPublished ? 'bg-forest-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isPublished ? 'translate-x-6' : ''}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 text-sm">{form.isPublished ? 'Published — visible to visitors' : 'Draft — not visible to visitors'}</p>
                  </div>
                </label>
              </div>
            </fieldset>

            {formError && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{formError}</div>}

            <div className="flex gap-3 pb-6">
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60">
                {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><FaSave /> {isEditing ? 'Update Post' : 'Create Post'}</>}
              </button>
              <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const icls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { default: axios } = await import('axios');
      const r = await axios.get('/api/admin/blog', { headers });
      setPosts(r.data.data || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const openEdit = async (post) => {
    // Load full post including content
    const { default: axios } = await import('axios');
    const r = await axios.get(`/api/admin/blog/${post._id}`, { headers });
    setEditingPost(r.data.data);
    setShowForm(true);
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const { default: axios } = await import('axios');
      if (editingPost?._id) {
        await axios.put(`/api/admin/blog/${editingPost._id}`, form, { headers });
      } else {
        await axios.post('/api/admin/blog', form, { headers });
      }
      setShowForm(false); setEditingPost(null);
      fetchPosts();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const { default: axios } = await import('axios');
      await axios.delete(`/api/admin/blog/${deletingPost._id}`, { headers });
      setDeletingPost(null); fetchPosts();
    } finally { setSaving(false); }
  };

  const handleToggle = async (post) => {
    const { default: axios } = await import('axios');
    await axios.patch(`/api/admin/blog/${post._id}/toggle`, {}, { headers });
    fetchPosts();
  };

  const filtered = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.author?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-forest-800 text-xl">Blog & News</h2>
          <p className="text-gray-400 text-sm mt-0.5">{posts.length} posts · {posts.filter((p) => p.isPublished).length} published</p>
        </div>
        <button onClick={() => { setEditingPost(null); setShowForm(true); }} className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
          <FaPlus /> New Post
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm px-5 py-3.5">
        <div className="relative max-w-xs">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input type="text" placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 bg-gray-50" />
        </div>
      </div>

      {/* Posts list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400">Loading posts...</p></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📰</div>
            <p className="text-gray-500">No posts yet.</p>
            <button onClick={() => setShowForm(true)} className="mt-4 btn-primary text-sm"><FaPlus /> Write First Post</button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Header row */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">Cover</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Actions</div>
            </div>
            {filtered.map((post) => (
              <div key={post._id} className={`grid grid-cols-2 md:grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors ${!post.isPublished ? 'opacity-60' : ''}`}>
                {/* Cover */}
                <div className="hidden md:block col-span-1">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {post.coverImage ? <img src={post.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-xl opacity-20">📰</span></div>}
                  </div>
                </div>

                {/* Title */}
                <div className="col-span-2 md:col-span-5">
                  <p className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-gray-400 text-xs"><FaUser className="text-xs" />{post.author}</span>
                    {!post.isPublished && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Draft</span>}
                  </div>
                </div>

                {/* Category */}
                <div className="hidden md:block col-span-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {CATEGORIES.find((c) => c.value === post.category)?.label || post.category}
                  </span>
                </div>

                {/* Date */}
                <div className="hidden md:flex col-span-2 items-center gap-1 text-gray-400 text-xs">
                  <FaCalendar className="text-xs" />
                  {formatDate(post.publishedAt || post.createdAt)}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex gap-2 justify-end md:justify-start">
                  <button onClick={() => handleToggle(post)} title={post.isPublished ? 'Unpublish' : 'Publish'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition text-sm ${post.isPublished ? 'bg-forest-100 text-forest-700 hover:bg-forest-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {post.isPublished ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button onClick={() => openEdit(post)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition text-sm"><FaEdit /></button>
                  <button onClick={() => setDeletingPost(post)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition text-sm"><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <PostFormPanel post={editingPost} onSave={handleSave} onClose={() => { setShowForm(false); setEditingPost(null); }} saving={saving} />}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeletingPost(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-heading font-bold text-gray-800 text-xl mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>"{deletingPost.title}"</strong>?</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">{saving ? 'Deleting...' : 'Delete'}</button>
              <button onClick={() => setDeletingPost(null)} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
