import { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaGripVertical } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

const defaultStat = () => ({
  id: `s-${Date.now()}`,
  icon: '📊',
  value: '0',
  suffix: '+',
  label: '',
});

export default function StatsEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const setStat = (i, field, val) => {
    const items = [...(form.items || [])];
    items[i] = { ...items[i], [field]: val };
    setForm((f) => ({ ...f, items }));
  };

  const addStat = () =>
    setForm((f) => ({ ...f, items: [...(f.items || []), defaultStat()] }));

  const removeStat = (i) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Header</h2>
        <div className="space-y-4">
          <Field label="Section Tag" value={form.sectionTag} onChange={(v) => set('sectionTag', v)} placeholder="By the Numbers" />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="Our Achievements in Numbers" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
            <textarea rows={2} value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Background Style</label>
            <div className="flex gap-3">
              {[
                { val: 'dark', label: 'Dark Green', preview: 'bg-forest-900' },
                { val: 'brand', label: 'Gold', preview: 'bg-brand-600' },
                { val: 'white', label: 'White', preview: 'bg-white border border-gray-200' },
              ].map(({ val, label, preview }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('backgroundStyle', val)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${
                    form.backgroundStyle === val ? 'border-forest-600' : 'border-gray-100'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full ${preview}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Stat Items</h2>
          <button onClick={addStat} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Stat
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {(form.items || []).map((item, i) => (
            <div key={item.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaGripVertical className="text-gray-300" />
                  <span className="text-sm font-semibold text-forest-700">Stat {i + 1}</span>
                </div>
                <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600">
                  <FaTrash />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Icon</label>
                  <input type="text" value={item.icon || ''} onChange={(e) => setStat(i, 'icon', e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-center text-xl focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Number</label>
                  <input type="text" value={item.value || ''} onChange={(e) => setStat(i, 'value', e.target.value)} placeholder="15" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Suffix</label>
                  <input type="text" value={item.suffix || ''} onChange={(e) => setStat(i, 'suffix', e.target.value)} placeholder="+ or MT" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
                <div className="col-span-3">
                  <label className="text-xs text-gray-500 mb-1 block">Label</label>
                  <input type="text" value={item.label || ''} onChange={(e) => setStat(i, 'label', e.target.value)} placeholder="Years of Experience" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Statistics
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
