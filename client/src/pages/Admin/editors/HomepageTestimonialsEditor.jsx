import { useState, useEffect } from 'react';
import { FaSave, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

export default function HomepageTestimonialsEditor({ data, sectionKey }) {
  const { saveSection, saving } = useAdmin();
  const [form, setForm] = useState({
    sectionTag: 'Customer Reviews',
    title: 'Trusted by Thousands Across Nepal',
    subtitle: 'Hear from the retailers, restaurants, and households who choose Suryodaya rice every day.',
    isVisible: true,
    ...data,
  });

  useEffect(() => {
    if (data) setForm((f) => ({ ...f, ...data }));
  }, [data]);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    await saveSection(sectionKey, form);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <FaStar className="text-amber-500 text-lg" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-forest-800 text-lg">Testimonials Section</h2>
            <p className="text-gray-400 text-xs">Controls the customer reviews section on the homepage</p>
          </div>
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            {form.isVisible
              ? <FaEye className="text-forest-500" />
              : <FaEyeSlash className="text-gray-400" />}
            <div>
              <p className="text-sm font-medium text-gray-700">Section Visibility</p>
              <p className="text-xs text-gray-400">
                {form.isVisible ? 'Testimonials section is shown on homepage' : 'Section is hidden from homepage'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => set('isVisible', !form.isVisible)}
            className={`relative w-12 h-6 rounded-full transition-colors ${form.isVisible ? 'bg-forest-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isVisible ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Section tag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Tag</label>
          <input
            value={form.sectionTag}
            onChange={(e) => set('sectionTag', e.target.value)}
            className="input-field"
            placeholder="Customer Reviews"
          />
          <p className="text-xs text-gray-400 mt-1">Small label shown above the title (e.g. "Customer Reviews")</p>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            className="input-field"
            placeholder="Trusted by Thousands Across Nepal"
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <textarea
            value={form.subtitle}
            onChange={(e) => set('subtitle', e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="A short description under the title"
          />
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">Testimonial content is managed separately</p>
          <p className="text-amber-700 text-xs">
            To add, edit, or remove individual customer reviews, go to <strong>Testimonials Manager</strong> in the Content section of the sidebar.
            Only testimonials marked as "Active" will appear on the homepage.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-forest-700 text-white px-6 py-2.5 rounded-xl hover:bg-forest-600 transition text-sm font-medium disabled:opacity-60"
      >
        <FaSave /> {saving ? 'Saving...' : 'Save Testimonials Section'}
      </button>
    </form>
  );
}
