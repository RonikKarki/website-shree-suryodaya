import { useState } from 'react';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const defaultHighlight = () => ({ id: `h-${Date.now()}`, icon: '✅', text: '' });

export default function CompanyIntroEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const setHighlight = (i, field, val) => {
    const highlights = [...(form.highlights || [])];
    highlights[i] = { ...highlights[i], [field]: val };
    setForm((f) => ({ ...f, highlights }));
  };

  const addHighlight = () =>
    setForm((f) => ({ ...f, highlights: [...(f.highlights || []), defaultHighlight()] }));

  const removeHighlight = (i) =>
    setForm((f) => ({ ...f, highlights: f.highlights.filter((_, idx) => idx !== i) }));

  const setImage = (i, url) => {
    const images = [...(form.images || ['', ''])];
    images[i] = url;
    setForm((f) => ({ ...f, images }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Text</h2>
        <div className="space-y-4">
          <Field label="Section Tag (small label above title)" value={form.sectionTag} onChange={(v) => set('sectionTag', v)} placeholder="e.g. Our Story" />
          <Field label="Section Title" value={form.title} onChange={(v) => set('title', v)} placeholder="Rooted in Nawalpur, Trusted Across Nepal" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Description <span className="text-gray-400 font-normal">(use blank line between paragraphs)</span>
            </label>
            <textarea
              rows={8}
              value={form.description || ''}
              onChange={(e) => set('description', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
              placeholder="First paragraph&#10;&#10;Second paragraph"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Images</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <ImageUpload label="Primary Image (large)" value={form.images?.[0]} onChange={(url) => setImage(0, url)} height="h-48" />
          <ImageUpload label="Secondary Image" value={form.images?.[1]} onChange={(url) => setImage(1, url)} height="h-48" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Highlights / Bullet Points</h2>
          <button onClick={addHighlight} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add
          </button>
        </div>
        <div className="space-y-3">
          {(form.highlights || []).map((h, i) => (
            <div key={h.id} className="flex gap-3 items-center">
              <input
                type="text"
                value={h.icon || ''}
                onChange={(e) => setHighlight(i, 'icon', e.target.value)}
                className="w-14 border border-gray-200 rounded-lg px-2 py-2 text-center text-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                placeholder="✅"
              />
              <input
                type="text"
                value={h.text || ''}
                onChange={(e) => setHighlight(i, 'text', e.target.value)}
                placeholder="Highlight text"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
              <button onClick={() => removeHighlight(i)} className="text-red-400 hover:text-red-600">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">CTA Button</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Button Label" value={form.ctaLabel} onChange={(v) => set('ctaLabel', v)} placeholder="Read Our Full Story" />
          <Field label="Button Link" value={form.ctaLink} onChange={(v) => set('ctaLink', v)} placeholder="/about" />
        </div>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Company Intro
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
      />
    </div>
  );
}
