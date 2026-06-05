import { useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

export default function FeaturedProductsEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Header</h2>
        <div className="space-y-4">
          <Field label="Section Tag" value={form.sectionTag} onChange={(v) => set('sectionTag', v)} placeholder="Our Range" />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="Handpicked Rice Varieties" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
            <textarea rows={2} value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Display Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Number of products to show on homepage: <strong>{form.limit || 3}</strong>
            </label>
            <input
              type="range" min="1" max="6" step="1"
              value={form.limit || 3}
              onChange={(e) => set('limit', Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <p className="text-xs text-gray-400 mt-1">
              Products are pulled from the database in order. Manage products in the Products section.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">CTA Button</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Button Label" value={form.ctaLabel} onChange={(v) => set('ctaLabel', v)} placeholder="View All Products" />
          <Field label="Button Link" value={form.ctaLink} onChange={(v) => set('ctaLink', v)} placeholder="/products" />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="font-semibold text-blue-800 mb-2">About Featured Products</h3>
        <p className="text-blue-700 text-sm">
          Products shown here are pulled automatically from the database. To add, edit, or reorder products,
          go to the <strong>Products</strong> section (via the API or directly in MongoDB).
          The first <strong>{form.limit || 3}</strong> active products (sorted by sortOrder) will be displayed.
        </p>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Featured Products Settings
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
