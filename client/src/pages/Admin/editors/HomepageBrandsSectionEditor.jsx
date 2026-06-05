import { useState, useEffect } from 'react';
import { FaSave, FaTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

export default function HomepageBrandsSectionEditor({ data, sectionKey }) {
  const { saveSection, saving } = useAdmin();
  const [form, setForm] = useState({
    sectionTag: 'Our Brands',
    title: 'Brands That Families Trust',
    subtitle: 'Two distinct brands crafted for different needs — both delivering the quality Suryodaya is known for.',
    isVisible: true,
    ...data,
  });

  useEffect(() => { if (data) setForm((f) => ({ ...f, ...data })); }, [data]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); saveSection(sectionKey, form); }} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center">
            <FaTag className="text-forest-600 text-lg" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-forest-800 text-lg">Brands Section</h2>
            <p className="text-gray-400 text-xs">Controls the brands highlight section on the homepage</p>
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            {form.isVisible ? <FaEye className="text-forest-500" /> : <FaEyeSlash className="text-gray-400" />}
            <div>
              <p className="text-sm font-medium text-gray-700">Section Visibility</p>
              <p className="text-xs text-gray-400">{form.isVisible ? 'Brands section is shown on homepage' : 'Hidden from homepage'}</p>
            </div>
          </div>
          <button type="button" onClick={() => set('isVisible', !form.isVisible)}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.isVisible ? 'bg-forest-600' : 'bg-gray-300'}`}>
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isVisible ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Tag</label>
          <input value={form.sectionTag} onChange={(e) => set('sectionTag', e.target.value)} className="input-field" placeholder="Our Brands" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input value={form.title} onChange={(e) => set('title', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} rows={3} className="input-field resize-none" />
        </div>

        <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 text-sm text-forest-800">
          <p className="font-medium mb-1">Individual brands managed separately</p>
          <p className="text-forest-700 text-xs">Go to <strong>Brands Manager</strong> under the Content section to add, edit, or remove brands. Only active brands appear on the homepage.</p>
        </div>
      </div>

      <button type="submit" disabled={saving}
        className="flex items-center gap-2 bg-forest-700 text-white px-6 py-2.5 rounded-xl hover:bg-forest-600 transition text-sm font-medium disabled:opacity-60">
        <FaSave /> {saving ? 'Saving…' : 'Save Brands Section'}
      </button>
    </form>
  );
}
