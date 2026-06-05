import { useState, useEffect } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaEye, FaEyeSlash, FaChevronUp, FaChevronDown, FaTag,
} from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const emptyForm = {
  name: '', nepaliName: '', logo: '', tagline: '',
  description: '', accentColor: '#1B5E20', isActive: true,
};

// ─── Accent colour presets ────────────────────────────────────────────────────
const COLOR_PRESETS = [
  { label: 'Forest Green',   hex: '#1B5E20' },
  { label: 'Burnt Orange',   hex: '#E65100' },
  { label: 'Deep Gold',      hex: '#F57F17' },
  { label: 'Royal Blue',     hex: '#1A237E' },
  { label: 'Crimson',        hex: '#B71C1C' },
  { label: 'Teal',           hex: '#004D40' },
];

// ─── Form slide-out ───────────────────────────────────────────────────────────
function BrandForm({ initial, onSave, onClose, saving }) {
  const { uploadImage } = useAdmin();
  const [form, setForm] = useState({ ...emptyForm, ...initial });
  const [err, setErr]   = useState('');

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErr(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr('Brand name is required.'); return; }
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-forest-800 text-lg">
            {initial?._id ? 'Edit Brand' : 'Add Brand'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-5">

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Logo</label>
            <ImageUpload value={form.logo} onChange={(url) => set('logo', url)} uploadFn={uploadImage} placeholder="Upload brand logo or paste URL" />
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" placeholder="Manaslu" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">नेपाली नाम</label>
              <input value={form.nepaliName} onChange={(e) => set('nepaliName', e.target.value)} className="input-field" placeholder="मनास्लु" />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} className="input-field" placeholder="Premium Quality, Pure Taste" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} className="input-field resize-none" placeholder="What makes this brand unique..." />
          </div>

          {/* Accent colour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Accent Color</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PRESETS.map(({ label, hex }) => (
                <button
                  key={hex} type="button"
                  onClick={() => set('accentColor', hex)}
                  title={label}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${form.accentColor === hex ? 'border-gray-800 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
              <input value={form.accentColor} onChange={(e) => set('accentColor', e.target.value)}
                className="input-field flex-1 font-mono text-sm" placeholder="#1B5E20" />
              <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ backgroundColor: form.accentColor }} />
            </div>
          </div>

          {/* Active */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} className="w-4 h-4 accent-forest-600" />
            <span className="text-sm text-gray-700">Active (visible on website)</span>
          </label>

          {err && <p className="text-red-500 text-sm">{err}</p>}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white flex gap-3">
          <button onClick={onClose} type="button" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 text-sm font-medium">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="flex-1 bg-forest-700 text-white px-4 py-2.5 rounded-xl hover:bg-forest-600 text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
            <FaSave /> {saving ? 'Saving…' : 'Save Brand'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Brand preview card (matches public design) ───────────────────────────────
function BrandPreview({ brand }) {
  const color = brand.accentColor || '#1B5E20';
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm flex flex-col">
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />
      <div className="p-5 flex items-start gap-4 flex-1">
        {/* Logo / initials */}
        <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, border: `2px solid ${color}30` }}>
          {brand.logo
            ? <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
            : <span className="font-heading font-bold text-xl" style={{ color }}>{brand.name?.[0]}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-heading font-bold text-gray-900 text-lg">{brand.name}</h3>
            {brand.nepaliName && <span className="text-gray-400 text-sm">{brand.nepaliName}</span>}
            {!brand.isActive && <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">Hidden</span>}
          </div>
          {brand.tagline && <p className="text-sm italic mt-0.5" style={{ color }}>{brand.tagline}</p>}
          {brand.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{brand.description}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Main manager ─────────────────────────────────────────────────────────────
export default function BrandsManager() {
  const { loadBrands, createBrand, updateBrand, deleteBrand, toggleBrand, reorderBrands, saving } = useAdmin();
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [formItem, setFormItem] = useState(null);

  const reload = () => { setLoading(true); loadBrands().then(setItems).finally(() => setLoading(false)); };
  useEffect(reload, []);

  const handleSave = async (data) => {
    if (formItem?._id) {
      const updated = await updateBrand(formItem._id, data);
      setItems((p) => p.map((b) => b._id === formItem._id ? updated : b));
    } else {
      const created = await createBrand(data);
      setItems((p) => [...p, created]);
    }
    setFormItem(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this brand?')) return;
    await deleteBrand(id);
    setItems((p) => p.filter((b) => b._id !== id));
  };

  const handleToggle = async (id) => {
    const updated = await toggleBrand(id);
    setItems((p) => p.map((b) => b._id === id ? updated : b));
  };

  const move = async (idx, dir) => {
    const arr = [...items];
    const swap = idx + dir;
    if (swap < 0 || swap >= arr.length) return;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    setItems(arr);
    await reorderBrands(arr.map((b, i) => ({ id: b._id, sortOrder: i })));
  };

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-gray-400">Loading brands…</p>
    </div>
  );

  return (
    <>
      {formItem !== null && (
        <BrandForm initial={formItem} onSave={handleSave} onClose={() => setFormItem(null)} saving={saving} />
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{items.length} brand{items.length !== 1 ? 's' : ''} · drag ↑↓ to reorder</p>
          </div>
          <button onClick={() => setFormItem({})}
            className="bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-forest-600 transition flex items-center gap-2">
            <FaPlus /> Add Brand
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FaTag className="text-4xl mx-auto mb-3 opacity-20" />
            <p>No brands yet. Add Manaslu and Namche to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((brand, idx) => (
              <div key={brand._id} className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-start">
                {/* Colour swatch */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: brand.accentColor }} />

                {/* Preview */}
                <div className="flex-1 min-w-0">
                  <BrandPreview brand={brand} />
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    <button onClick={() => move(idx, -1)} disabled={idx === 0} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><FaChevronUp /></button>
                    <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><FaChevronDown /></button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleToggle(brand._id)} className={`p-1.5 rounded-lg ${brand.isActive ? 'text-forest-600 hover:bg-forest-50' : 'text-gray-400 hover:bg-gray-50'}`} title={brand.isActive ? 'Hide' : 'Show'}>
                      {brand.isActive ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button onClick={() => setFormItem(brand)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                    <button onClick={() => handleDelete(brand._id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tip */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">💡 Brand logos</p>
          <p className="text-amber-700 text-xs">Upload a logo image for each brand. Transparent PNG or high-res JPG works best. Without a logo, the brand initial letter is shown instead.</p>
        </div>
      </div>
    </>
  );
}
