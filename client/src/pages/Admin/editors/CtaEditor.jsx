import { useState } from 'react';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

const defaultButton = () => ({
  id: `c-${Date.now()}`,
  label: '',
  link: '/contact',
  variant: 'secondary',
  icon: '',
});

export default function CtaEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const setButton = (i, field, val) => {
    const buttons = [...(form.buttons || [])];
    buttons[i] = { ...buttons[i], [field]: val };
    setForm((f) => ({ ...f, buttons }));
  };

  const addButton = () =>
    setForm((f) => ({ ...f, buttons: [...(f.buttons || []), defaultButton()] }));

  const removeButton = (i) =>
    setForm((f) => ({ ...f, buttons: f.buttons.filter((_, idx) => idx !== i) }));

  const bgPreview = {
    green: 'bg-gradient-to-r from-forest-800 to-forest-900',
    gold:  'bg-gradient-to-r from-brand-600 to-brand-700',
    dark:  'bg-gradient-to-r from-earth-800 to-earth-900',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">CTA Content</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Headline</label>
            <input type="text" value={form.title || ''} onChange={(e) => set('title', e.target.value)} placeholder="Ready to Order or Have Questions?" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
            <textarea rows={3} value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Background Style</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { val: 'green', label: 'Dark Green' },
            { val: 'gold',  label: 'Gold' },
            { val: 'dark',  label: 'Dark Brown' },
          ].map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => set('backgroundStyle', val)}
              className={`rounded-2xl overflow-hidden border-4 transition ${form.backgroundStyle === val ? 'border-forest-600' : 'border-transparent'}`}
            >
              <div className={`${bgPreview[val]} h-16 flex items-center justify-center`}>
                <span className="text-white text-xs font-semibold">{label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Action Buttons</h2>
          <button onClick={addButton} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Button
          </button>
        </div>

        <div className="space-y-4">
          {(form.buttons || []).map((btn, i) => (
            <div key={btn.id} className="grid sm:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Icon (optional emoji)</label>
                <input type="text" value={btn.icon || ''} onChange={(e) => setButton(i, 'icon', e.target.value)} placeholder="✉️" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Label</label>
                <input type="text" value={btn.label || ''} onChange={(e) => setButton(i, 'label', e.target.value)} placeholder="Send a Message" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Link</label>
                <input type="text" value={btn.link || ''} onChange={(e) => setButton(i, 'link', e.target.value)} placeholder="/contact or tel:+977..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Style</label>
                  <select value={btn.variant || 'secondary'} onChange={(e) => setButton(i, 'variant', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white">
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary (Gold)</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>
                {(form.buttons || []).length > 1 && (
                  <button onClick={() => removeButton(i)} className="text-red-400 hover:text-red-600 pb-2">
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Call to Action
      </button>
    </div>
  );
}
