import { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaGripVertical } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

const defaultItem = () => ({
  id: `w-${Date.now()}`,
  icon: '🌾',
  title: '',
  description: '',
});

export default function WhyChooseUsEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const setItem = (i, field, val) => {
    const items = [...(form.items || [])];
    items[i] = { ...items[i], [field]: val };
    setForm((f) => ({ ...f, items }));
  };

  const addItem = () =>
    setForm((f) => ({ ...f, items: [...(f.items || []), defaultItem()] }));

  const removeItem = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Header</h2>
        <div className="space-y-4">
          <Field label="Section Tag" value={form.sectionTag} onChange={(v) => set('sectionTag', v)} placeholder="Why Us?" />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="The Suryodaya Difference" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
            <textarea rows={2} value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Feature Cards</h2>
          <button onClick={addItem} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Card
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {(form.items || []).map((item, i) => (
            <div key={item.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaGripVertical className="text-gray-300" />
                  <span className="text-sm font-semibold text-forest-700">Card {i + 1}</span>
                </div>
                <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600">
                  <FaTrash />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-1/4">
                    <label className="text-xs text-gray-500 mb-1 block">Icon (emoji)</label>
                    <input type="text" value={item.icon || ''} onChange={(e) => setItem(i, 'icon', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-center text-xl focus:outline-none focus:ring-2 focus:ring-forest-500" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Card Title</label>
                    <input type="text" value={item.title || ''} onChange={(e) => setItem(i, 'title', e.target.value)} placeholder="Feature title" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea rows={3} value={item.description || ''} onChange={(e) => setItem(i, 'description', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Why Choose Us
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
