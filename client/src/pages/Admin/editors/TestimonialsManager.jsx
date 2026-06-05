import { useState, useEffect } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaStar, FaTimes, FaSave,
  FaEye, FaEyeSlash, FaChevronUp, FaChevronDown,
} from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const emptyForm = {
  name: '', role: '', company: '', content: '', rating: 5,
  avatar: '', isActive: true, isFeatured: false,
};

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <FaStar className={n <= value ? 'text-amber-400 text-xl' : 'text-gray-200 text-xl'} />
        </button>
      ))}
    </div>
  );
}

function TestimonialForm({ initial, onSave, onClose, saving }) {
  const { uploadImage } = useAdmin();
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [err, setErr] = useState('');

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.name.trim()) { setErr('Name is required.'); return; }
    if (!form.content.trim()) { setErr('Review text is required.'); return; }
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-forest-800 text-lg">
            {initial?._id ? 'Edit Testimonial' : 'Add Testimonial'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar (optional)</label>
            <ImageUpload
              value={form.avatar}
              onChange={(url) => set('avatar', url)}
              uploadFn={uploadImage}
              placeholder="Upload photo or paste URL"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input-field"
              placeholder="Ram Prasad Sharma"
            />
          </div>

          {/* Role + Company */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                className="input-field"
                placeholder="Owner"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                className="input-field"
                placeholder="Sharma General Store"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarPicker value={form.rating} onChange={(v) => set('rating', v)} />
          </div>

          {/* Review text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review *</label>
            <textarea
              value={form.content}
              onChange={(e) => set('content', e.target.value)}
              rows={5}
              className="input-field resize-none"
              placeholder="What the customer said about Suryodaya rice..."
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => set('isActive', e.target.checked)}
                className="w-4 h-4 accent-forest-600"
              />
              <span className="text-sm text-gray-700">Active (visible on site)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => set('isFeatured', e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
          </div>

          {err && <p className="text-red-500 text-sm">{err}</p>}
        </form>

        <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-forest-700 text-white px-4 py-2.5 rounded-xl hover:bg-forest-600 transition text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <FaSave /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsManager() {
  const {
    loadTestimonials, createTestimonial, updateTestimonial,
    deleteTestimonial, toggleTestimonial, reorderTestimonials,
    saving,
  } = useAdmin();

  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [formItem, setFormItem] = useState(null); // null = closed, {} = new, obj = edit

  const reload = () => {
    setLoading(true);
    loadTestimonials().then(setItems).finally(() => setLoading(false));
  };
  useEffect(reload, []);

  const handleSave = async (data) => {
    if (formItem?._id) {
      const updated = await updateTestimonial(formItem._id, data);
      setItems((prev) => prev.map((t) => t._id === formItem._id ? updated : t));
    } else {
      const created = await createTestimonial(data);
      setItems((prev) => [...prev, created]);
    }
    setFormItem(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    setItems((prev) => prev.filter((t) => t._id !== id));
  };

  const handleToggle = async (id) => {
    const updated = await toggleTestimonial(id);
    setItems((prev) => prev.map((t) => t._id === id ? updated : t));
  };

  const move = async (idx, dir) => {
    const arr = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    const order = arr.map((t, i) => ({ id: t._id, sortOrder: i }));
    setItems(arr);
    await reorderTestimonials(order);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <>
      {formItem !== null && (
        <TestimonialForm
          initial={formItem}
          onSave={handleSave}
          onClose={() => setFormItem(null)}
          saving={saving}
        />
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{items.length} testimonial{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setFormItem({})}
            className="bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-600 transition flex items-center gap-2"
          >
            <FaPlus /> Add Testimonial
          </button>
        </div>

        {/* List */}
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FaStar className="text-4xl mx-auto mb-3 opacity-20" />
            <p>No testimonials yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t, idx) => (
              <div key={t._id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-start">
                {/* Avatar */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-forest-100 flex items-center justify-center">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-forest-600 font-bold text-lg">{t.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    {t.isFeatured && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Featured</span>
                    )}
                    {!t.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Hidden</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{[t.role, t.company].filter(Boolean).join(' · ')}</p>
                  <div className="flex gap-0.5 my-1">
                    {[1,2,3,4,5].map((n) => (
                      <FaStar key={n} className={n <= t.rating ? 'text-amber-400 text-xs' : 'text-gray-200 text-xs'} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{t.content}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <FaChevronUp />
                    </button>
                    <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                      <FaChevronDown />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggle(t._id)}
                      className={`p-1.5 rounded-lg transition ${t.isActive ? 'text-forest-600 hover:bg-forest-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      title={t.isActive ? 'Hide' : 'Show'}
                    >
                      {t.isActive ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => setFormItem(t)}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
