import { useState, useEffect, useCallback } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaSave,
  FaTimes, FaChevronUp, FaChevronDown, FaStar,
} from 'react-icons/fa';
import ImageUpload from '../../../components/admin/ImageUpload';

const CATEGORIES = [
  { value: 'factory',    label: 'Factory',    emoji: '🏭' },
  { value: 'machinery',  label: 'Machinery',  emoji: '⚙️' },
  { value: 'warehouse',  label: 'Warehouse',  emoji: '🏗️' },
  { value: 'processing', label: 'Processing', emoji: '🌾' },
  { value: 'packaging',  label: 'Packaging',  emoji: '📦' },
  { value: 'team',       label: 'Team',       emoji: '👷' },
  { value: 'other',      label: 'Other',      emoji: '📷' },
];

const emptyForm = { title: '', category: 'factory', src: '', caption: '', alt: '', isActive: true, isFeatured: false };

function ImageFormModal({ image, onSave, onClose, saving }) {
  const [form, setForm] = useState(image ? { ...emptyForm, ...image } : { ...emptyForm });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-forest-800 text-lg">{image ? 'Edit Image' : 'Add Image'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"><FaTimes /></button>
        </div>
        <div className="flex-1 p-6 space-y-5">
          <ImageUpload label="Image" value={form.src} onChange={(url) => set('src', url)} height="h-52" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title</label>
            <input type="text" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Milling Floor" className={cls} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ value, label, emoji }) => (
                <button key={value} type="button" onClick={() => set('category', value)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border-2 transition flex flex-col items-center gap-0.5 ${form.category === value ? 'border-forest-600 bg-forest-50 text-forest-700' : 'border-gray-100 text-gray-600'}`}>
                  <span className="text-lg">{emoji}</span>{label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Caption (shown on hover)</label>
            <input type="text" value={form.caption} onChange={(e) => set('caption', e.target.value)} placeholder="Short description of the image" className={cls} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Alt Text (for accessibility)</label>
            <input type="text" value={form.alt} onChange={(e) => set('alt', e.target.value)} placeholder="Description for screen readers" className={cls} />
          </div>
          <div className="flex items-center gap-6">
            <Toggle label="Active (visible on website)" value={form.isActive} onChange={(v) => set('isActive', v)} />
            <Toggle label="Featured" value={form.isFeatured} onChange={(v) => set('isFeatured', v)} />
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={() => onSave(form)}
            disabled={saving}
            className="btn-primary flex-1 justify-center py-3 disabled:opacity-60"
          >
            {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><FaSave /> {image ? 'Update Image' : 'Add Image'}</>}
          </button>
          <button onClick={onClose} className="px-5 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ image, onConfirm, onCancel, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-heading font-bold text-gray-800 text-xl mb-2">Delete Image?</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{image.title || 'this image'}</strong>?</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">
            {saving ? 'Deleting...' : 'Delete'}
          </button>
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

const cls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const { default: axios } = await import('axios');
      const r = await axios.get('/api/admin/gallery', { headers });
      setImages(r.data.data || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      const { default: axios } = await import('axios');
      if (editingImage?._id) {
        await axios.put(`/api/admin/gallery/${editingImage._id}`, form, { headers });
      } else {
        await axios.post('/api/admin/gallery', form, { headers });
      }
      setShowForm(false); setEditingImage(null);
      fetchImages();
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const { default: axios } = await import('axios');
      await axios.delete(`/api/admin/gallery/${deletingImage._id}`, { headers });
      setDeletingImage(null);
      fetchImages();
    } finally { setSaving(false); }
  };

  const handleToggle = async (img) => {
    const { default: axios } = await import('axios');
    await axios.patch(`/api/admin/gallery/${img._id}/toggle`, {}, { headers });
    fetchImages();
  };

  const move = async (index, dir) => {
    const arr = [...images];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setImages(arr);
    const { default: axios } = await import('axios');
    await axios.post('/api/admin/gallery/reorder', { order: arr.map((img, i) => ({ id: img._id, sortOrder: i })) }, { headers });
  };

  const filtered = filterCategory === 'all' ? images : images.filter((img) => img.category === filterCategory);
  const catCounts = images.reduce((acc, img) => { acc[img.category] = (acc[img.category] || 0) + 1; return acc; }, {});

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-forest-800 text-xl">Gallery</h2>
          <p className="text-gray-400 text-sm mt-0.5">{images.length} images · {images.filter((i) => i.isActive).length} active</p>
        </div>
        <button onClick={() => { setEditingImage(null); setShowForm(true); }} className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
          <FaPlus /> Add Image
        </button>
      </div>

      {/* Category filter */}
      <div className="bg-white rounded-2xl shadow-sm px-5 py-3.5">
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setFilterCategory('all')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${filterCategory === 'all' ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest-50'}`}>
            All ({images.length})
          </button>
          {CATEGORIES.map(({ value, label, emoji }) => (
            <button key={value} onClick={() => setFilterCategory(value)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${filterCategory === value ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest-50'}`}>
              {emoji} {label} <span className="opacity-70">({catCounts[value] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Image grid */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-400">No images. Click Add Image to upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((img, index) => {
              const realIndex = images.findIndex((i) => i._id === img._id);
              return (
                <div key={img._id} className={`relative group rounded-2xl overflow-hidden border-2 ${!img.isActive ? 'opacity-50 border-gray-200' : 'border-transparent hover:border-forest-300'} transition-all`}>
                  <div className="aspect-square bg-gray-100">
                    {img.src ? (
                      <img src={img.src} alt={img.alt || img.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-4xl opacity-20">{CATEGORIES.find((c) => c.value === img.category)?.emoji || '📷'}</span>
                      </div>
                    )}
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button onClick={() => move(realIndex, 'up')} disabled={realIndex === 0} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-gray-700 disabled:opacity-30 text-xs hover:bg-white"><FaChevronUp /></button>
                      <button onClick={() => move(realIndex, 'down')} disabled={realIndex === images.length - 1} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center text-gray-700 disabled:opacity-30 text-xs hover:bg-white"><FaChevronDown /></button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingImage(img); setShowForm(true); }} className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs hover:bg-blue-600"><FaEdit /></button>
                      <button onClick={() => handleToggle(img)} className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white text-xs hover:bg-amber-600">{img.isActive ? <FaEyeSlash /> : <FaEye />}</button>
                      <button onClick={() => setDeletingImage(img)} className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs hover:bg-red-600"><FaTrash /></button>
                    </div>
                  </div>

                  {/* Caption + badges */}
                  {img.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium truncate">{img.title}</p>
                    </div>
                  )}
                  {img.isFeatured && <div className="absolute top-2 right-2 bg-brand-500 rounded-full p-1"><FaStar className="text-white text-xs" /></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showForm && (
        <ImageFormModal image={editingImage} onSave={handleSave} onClose={() => { setShowForm(false); setEditingImage(null); }} saving={saving} />
      )}
      {deletingImage && (
        <DeleteModal image={deletingImage} onConfirm={handleDelete} onCancel={() => setDeletingImage(null)} saving={saving} />
      )}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div onClick={() => onChange(!value)} className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-forest-600' : 'bg-gray-300'}`}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  );
}
