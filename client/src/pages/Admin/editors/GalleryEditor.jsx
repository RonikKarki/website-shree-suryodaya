import { useState } from 'react';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const defaultImage = () => ({
  id: `g-${Date.now()}`,
  src: '',
  caption: '',
});

export default function GalleryEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const setImage = (i, field, val) => {
    const images = [...(form.images || [])];
    images[i] = { ...images[i], [field]: val };
    setForm((f) => ({ ...f, images }));
  };

  const addImage = () =>
    setForm((f) => ({ ...f, images: [...(f.images || []), defaultImage()] }));

  const removeImage = (i) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Header</h2>
        <div className="space-y-4">
          <Field label="Section Tag" value={form.sectionTag} onChange={(v) => set('sectionTag', v)} placeholder="Factory Gallery" />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="Inside Our Mill" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
            <textarea rows={2} value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Gallery Images</h2>
          <button onClick={addImage} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Image
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Images appear in a 2×3 grid on the homepage. Recommended size: at least 600×600 px.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(form.images || []).map((img, i) => (
            <div key={img.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-forest-700">Image {i + 1}</span>
                <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-600">
                  <FaTrash />
                </button>
              </div>
              <ImageUpload
                label=""
                value={img.src}
                onChange={(url) => setImage(i, 'src', url)}
                height="h-36"
              />
              <div className="mt-3">
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => setImage(i, 'caption', e.target.value)}
                  placeholder="Caption (shown on hover)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">CTA Button</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Button Label" value={form.ctaLabel} onChange={(v) => set('ctaLabel', v)} placeholder="Explore Our Factory" />
          <Field label="Button Link" value={form.ctaLink} onChange={(v) => set('ctaLink', v)} placeholder="/factory" />
        </div>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Gallery
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
    </div>
  );
}
