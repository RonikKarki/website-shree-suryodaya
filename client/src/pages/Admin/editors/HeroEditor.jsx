import { useState } from 'react';
import { FaPlus, FaTrash, FaGripVertical, FaSave } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const defaultSlide = () => ({
  id: `slide-${Date.now()}`,
  image: '',
  overlayOpacity: 0.55,
  tag: '',
  title: '',
  subtitle: '',
});

const defaultButton = () => ({
  id: `btn-${Date.now()}`,
  label: '',
  link: '/',
  variant: 'primary',
});

export default function HeroEditor({ data, sectionKey }) {
  const { saveSection } = useAdmin();
  const [form, setForm] = useState(() => JSON.parse(JSON.stringify(data || {})));

  const setSlide = (i, field, val) => {
    const slides = [...form.slides];
    slides[i] = { ...slides[i], [field]: val };
    setForm((f) => ({ ...f, slides }));
  };

  const addSlide = () =>
    setForm((f) => ({ ...f, slides: [...(f.slides || []), defaultSlide()] }));

  const removeSlide = (i) =>
    setForm((f) => ({ ...f, slides: f.slides.filter((_, idx) => idx !== i) }));

  const setButton = (i, field, val) => {
    const buttons = [...form.buttons];
    buttons[i] = { ...buttons[i], [field]: val };
    setForm((f) => ({ ...f, buttons }));
  };

  const addButton = () =>
    setForm((f) => ({ ...f, buttons: [...(f.buttons || []), defaultButton()] }));

  const removeButton = (i) =>
    setForm((f) => ({ ...f, buttons: f.buttons.filter((_, idx) => idx !== i) }));

  const handleSave = () => saveSection(sectionKey, form);

  return (
    <div className="space-y-6">
      {/* Slides */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Hero Slides</h2>
          <button onClick={addSlide} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Slide
          </button>
        </div>

        <div className="space-y-6">
          {(form.slides || []).map((slide, i) => (
            <div key={slide.id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaGripVertical className="text-gray-300" />
                  <span className="font-semibold text-forest-700 text-sm">Slide {i + 1}</span>
                </div>
                {(form.slides || []).length > 1 && (
                  <button onClick={() => removeSlide(i)} className="text-red-400 hover:text-red-600 transition">
                    <FaTrash />
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Background Image (leave empty to use gradient)"
                    value={slide.image}
                    onChange={(url) => setSlide(i, 'image', url)}
                    height="h-44"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                    Overlay Darkness ({Math.round((slide.overlayOpacity || 0.55) * 100)}%)
                  </label>
                  <input
                    type="range" min="0" max="0.9" step="0.05"
                    value={slide.overlayOpacity || 0.55}
                    onChange={(e) => setSlide(i, 'overlayOpacity', parseFloat(e.target.value))}
                    className="w-full accent-forest-600"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tag / Badge Text</label>
                  <input
                    type="text"
                    value={slide.tag || ''}
                    onChange={(e) => setSlide(i, 'tag', e.target.value)}
                    placeholder="e.g. Gaindakot, Nawalpur, Nepal"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Slide Title</label>
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => setSlide(i, 'title', e.target.value)}
                    placeholder="Main headline text"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={slide.subtitle || ''}
                    onChange={(e) => setSlide(i, 'subtitle', e.target.value)}
                    placeholder="Supporting text below the title"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autoplay */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-4">Autoplay Settings</h2>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Autoplay Interval: {(form.autoplayInterval || 5000) / 1000}s
          </label>
          <input
            type="range" min="2000" max="10000" step="500"
            value={form.autoplayInterval || 5000}
            onChange={(e) => setForm((f) => ({ ...f, autoplayInterval: Number(e.target.value) }))}
            className="w-full accent-forest-600"
          />
          <p className="text-xs text-gray-400 mt-1">
            How long each slide is shown before advancing automatically
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading font-bold text-forest-800 text-lg">Action Buttons</h2>
          <button onClick={addButton} className="flex items-center gap-2 bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-800 transition">
            <FaPlus /> Add Button
          </button>
        </div>

        <div className="space-y-4">
          {(form.buttons || []).map((btn, i) => (
            <div key={btn.id} className="grid sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Button Label</label>
                <input
                  type="text"
                  value={btn.label || ''}
                  onChange={(e) => setButton(i, 'label', e.target.value)}
                  placeholder="e.g. Explore Our Rice"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Link / URL</label>
                <input
                  type="text"
                  value={btn.link || ''}
                  onChange={(e) => setButton(i, 'link', e.target.value)}
                  placeholder="/products or tel:+977..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Style</label>
                  <select
                    value={btn.variant || 'primary'}
                    onChange={(e) => setButton(i, 'variant', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    <option value="primary">Primary (Green)</option>
                    <option value="secondary">Secondary (Gold)</option>
                    <option value="outline">Outline (White border)</option>
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

      {/* Save */}
      <button onClick={handleSave} className="btn-primary w-full justify-center py-3.5 text-base">
        <FaSave /> Save Hero Section
      </button>
    </div>
  );
}
