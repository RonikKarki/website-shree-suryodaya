import { useState } from 'react';
import { FaPlus, FaTrash, FaSave, FaGripVertical } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

const defaultStep = (i) => ({
  id: `p-${Date.now()}`,
  step: String(i + 1).padStart(2, '0'),
  icon: '⚙️',
  title: '',
  description: '',
});

export default function ProcessEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const setStep = (i, field, val) => {
    const steps = [...(form.steps || [])];
    steps[i] = { ...steps[i], [field]: val };
    setForm((f) => ({ ...f, steps }));
  };

  const addStep = () =>
    setForm((f) => ({ ...f, steps: [...(f.steps || []), defaultStep((f.steps || []).length)] }));

  const removeStep = (i) =>
    setForm((f) => ({ ...f, steps: f.steps.filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Section Header</h2>
        <div className="space-y-4">
          <Field label="Section Tag" value={form.sectionTag} onChange={(v) => set('sectionTag', v)} placeholder="Our Process" />
          <Field label="Title" value={form.title} onChange={(v) => set('title', v)} placeholder="From Paddy to Your Plate" />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle</label>
            <textarea rows={2} value={form.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Process Steps</h2>
          <button onClick={addStep} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Step
          </button>
        </div>

        <div className="space-y-4">
          {(form.steps || []).map((step, i) => (
            <div key={step.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaGripVertical className="text-gray-300" />
                  <div className="w-8 h-8 bg-forest-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{step.step || String(i + 1).padStart(2, '0')}</span>
                  </div>
                </div>
                <button onClick={() => removeStep(i)} className="text-red-400 hover:text-red-600">
                  <FaTrash />
                </button>
              </div>

              <div className="grid sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Step No.</label>
                  <input type="text" value={step.step || ''} onChange={(e) => setStep(i, 'step', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" placeholder="01" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Icon (emoji)</label>
                  <input type="text" value={step.icon || ''} onChange={(e) => setStep(i, 'icon', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xl text-center focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Step Title</label>
                  <input type="text" value={step.title || ''} onChange={(e) => setStep(i, 'title', e.target.value)} placeholder="e.g. Paddy Procurement" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
                </div>
                <div className="sm:col-span-4">
                  <label className="text-xs text-gray-500 mb-1 block">Description</label>
                  <textarea rows={3} value={step.description || ''} onChange={(e) => setStep(i, 'description', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => saveSection(sectionKey, form)} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Process Steps
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
