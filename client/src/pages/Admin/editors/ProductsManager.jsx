import { useState, useEffect, useCallback } from 'react';
import {
  FaPlus, FaEdit, FaTrash, FaChevronUp, FaChevronDown,
  FaTimes, FaSave, FaEye, FaEyeSlash, FaSearch, FaTag,
} from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const CATEGORIES = [
  { value: 'premium',   label: 'Premium' },
  { value: 'specialty', label: 'Specialty' },
  { value: 'medium',    label: 'Medium' },
  { value: 'economy',   label: 'Economy' },
];

const categoryColors = {
  premium:   'bg-amber-100 text-amber-800',
  specialty: 'bg-purple-100 text-purple-800',
  medium:    'bg-blue-100 text-blue-800',
  economy:   'bg-slate-100 text-slate-700',
};

const emptyForm = {
  name: '', nameNepali: '', category: 'medium', brand: '', description: '',
  features: [], grainType: '', grainLength: '', aroma: '', texture: '',
  cookingTip: '', packagingSizes: [], image: '', whatsappMessage: '', isActive: true,
};

// ─── Reusable text field ─────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
    </div>
  );
}

// ─── Product form slide-out panel ────────────────────────────────────────────
function ProductFormPanel({ product, brands, onSave, onClose, saving }) {
  const { uploadImage } = useAdmin();
  const isEditing = Boolean(product?._id);
  const [form, setForm]         = useState(() => product ? { ...emptyForm, ...product } : { ...emptyForm });
  const [featureInput, setFI]   = useState('');
  const [sizeInput, setSI]      = useState('');
  const [formError, setFormError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addFeature = () => {
    const v = featureInput.trim();
    if (v && !form.features.includes(v)) { setForm((f) => ({ ...f, features: [...f.features, v] })); setFI(''); }
  };
  const removeFeature = (i) => setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));

  const addSize = () => {
    const v = sizeInput.trim();
    if (v && !form.packagingSizes.includes(v)) { setForm((f) => ({ ...f, packagingSizes: [...f.packagingSizes, v] })); setSI(''); }
  };
  const removeSize = (i) => setForm((f) => ({ ...f, packagingSizes: f.packagingSizes.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) { setFormError('Product name is required.'); return; }
    if (!form.description.trim()) { setFormError('Description is required.'); return; }
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="font-heading font-bold text-forest-800 text-lg">
            {isEditing ? `Edit: ${product.name}` : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 space-y-6">

          {/* Image */}
          <ImageUpload label="Product Image" value={form.image} onChange={(url) => set('image', url)} height="h-52" />

          {/* Basic Info */}
          <fieldset>
            <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Basic Information</legend>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Product Name *" value={form.name} onChange={(v) => set('name', v)} placeholder="e.g. Sona Mansuli Rice" required />
                <Field label="Nepali Name" value={form.nameNepali} onChange={(v) => set('nameNepali', v)} placeholder="e.g. सोना मसुरी चामल" />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category *</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map(({ value, label }) => (
                    <button key={value} type="button" onClick={() => set('category', value)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition ${
                        form.category === value
                          ? 'border-forest-600 bg-forest-50 text-forest-700'
                          : 'border-gray-100 text-gray-600 hover:border-gray-200'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand picker */}
              {brands.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <FaTag className="text-forest-500 text-xs" /> Brand
                    <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {/* "No brand" option */}
                    <button type="button" onClick={() => set('brand', '')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${
                        !form.brand
                          ? 'border-gray-500 bg-gray-100 text-gray-700'
                          : 'border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}>
                      No Brand
                    </button>
                    {brands.map((b) => {
                      const selected = form.brand === b.name;
                      return (
                        <button key={b._id} type="button" onClick={() => set('brand', b.name)}
                          style={selected ? { borderColor: b.accentColor, backgroundColor: `${b.accentColor}12`, color: b.accentColor } : {}}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${
                            selected ? '' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                          }`}>
                          {b.logo
                            ? <img src={b.logo} alt={b.name} className="w-4 h-4 object-contain rounded-sm" />
                            : <span className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-bold"
                                style={{ backgroundColor: `${b.accentColor}25`, color: b.accentColor }}>{b.name[0]}</span>}
                          {b.name}
                          {b.nepaliName && <span className="opacity-60 text-xs">{b.nepaliName}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {form.brand && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      Assigned to <strong>{form.brand}</strong> brand — will appear in brand filter on the products page.
                    </p>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
                <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the rice variety — origin, taste, ideal use..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" required />
              </div>
            </div>
          </fieldset>

          {/* Grain Specs */}
          <fieldset>
            <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Grain Specifications</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Grain Type" value={form.grainType} onChange={(v) => set('grainType', v)} placeholder="e.g. Medium Grain" />
              <Field label="Grain Length" value={form.grainLength} onChange={(v) => set('grainLength', v)} placeholder="e.g. 5–6 mm" />
              <Field label="Aroma" value={form.aroma} onChange={(v) => set('aroma', v)} placeholder="e.g. Mild, pleasant" />
              <Field label="Texture" value={form.texture} onChange={(v) => set('texture', v)} placeholder="e.g. Soft and fluffy" />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cooking Tip</label>
              <textarea rows={2} value={form.cookingTip} onChange={(e) => set('cookingTip', e.target.value)}
                placeholder="Optional tip shown on the product card..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
            </div>
          </fieldset>

          {/* Features */}
          <fieldset>
            <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Features / Highlights</legend>
            <div className="flex gap-2 mb-3">
              <input type="text" value={featureInput} onChange={(e) => setFI(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="e.g. Stone-free (press Enter to add)"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              <button type="button" onClick={addFeature} className="bg-forest-700 text-white px-4 rounded-xl text-sm font-medium hover:bg-forest-800 transition">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.features.map((f, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-forest-50 text-forest-700 border border-forest-100 px-3 py-1.5 rounded-full text-sm">
                  {f}
                  <button type="button" onClick={() => removeFeature(i)} className="text-forest-400 hover:text-red-500 transition"><FaTimes className="text-xs" /></button>
                </span>
              ))}
              {form.features.length === 0 && <p className="text-gray-400 text-sm">No features added yet. Type above and press Enter.</p>}
            </div>
          </fieldset>

          {/* Packaging Sizes */}
          <fieldset>
            <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Packaging Sizes</legend>
            <div className="flex gap-2 mb-3">
              <input type="text" value={sizeInput} onChange={(e) => setSI(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                placeholder="e.g. 5 kg (press Enter to add)"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500" />
              <button type="button" onClick={addSize} className="bg-forest-700 text-white px-4 rounded-xl text-sm font-medium hover:bg-forest-800 transition">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.packagingSizes.map((s, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {s}
                  <button type="button" onClick={() => removeSize(i)} className="text-gray-400 hover:text-red-500 transition"><FaTimes className="text-xs" /></button>
                </span>
              ))}
              {form.packagingSizes.length === 0 && <p className="text-gray-400 text-sm">No sizes added yet.</p>}
            </div>
          </fieldset>

          {/* WhatsApp */}
          <fieldset>
            <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">WhatsApp Inquiry</legend>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Custom WhatsApp Message <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea rows={3} value={form.whatsappMessage} onChange={(e) => set('whatsappMessage', e.target.value)}
                placeholder={`Hello! I am interested in *${form.name || 'your rice'}*. Please provide more information...`}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none" />
              <p className="text-xs text-gray-400 mt-1">Use *bold* for emphasis. Leave blank to use the site default message.</p>
            </div>
          </fieldset>

          {/* Status */}
          <fieldset>
            <legend className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Visibility</legend>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => set('isActive', !form.isActive)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 cursor-pointer ${form.isActive ? 'bg-forest-600' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? 'translate-x-6' : ''}`} />
              </div>
              <div>
                <p className="font-medium text-gray-700 text-sm">{form.isActive ? 'Active — visible on website' : 'Inactive — hidden from website'}</p>
                <p className="text-xs text-gray-400">Toggle to show or hide this product</p>
              </div>
            </label>
          </fieldset>

          {formError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{formError}</div>
          )}

          <div className="flex gap-3 pb-6">
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center py-3 disabled:opacity-60">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                : <><FaSave /> {isEditing ? 'Update Product' : 'Create Product'}</>}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirmation ──────────────────────────────────────────────────────
function DeleteModal({ product, onConfirm, onCancel, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-heading font-bold text-gray-800 text-xl mb-2">Delete Product?</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete <strong>{product.name}</strong>? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={saving} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">
            {saving ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button onClick={onCancel} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-100 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ProductsManager ─────────────────────────────────────────────────────
export default function ProductsManager() {
  const { loadProducts, createProduct, updateProduct, deleteProduct, toggleProduct, reorderProducts, loadBrands, saving } = useAdmin();
  const [products, setProducts]   = useState([]);
  const [brands, setBrands]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBrand, setFilterBrand]   = useState('all');
  const [showFormPanel, setShowFormPanel] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, brnds] = await Promise.all([loadProducts(), loadBrands()]);
      setProducts(prods);
      setBrands(brnds);
    } finally { setLoading(false); }
  }, [loadProducts, loadBrands]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd  = () => { setEditingProduct(null); setShowFormPanel(true); };
  const openEdit = (p) => { setEditingProduct(p); setShowFormPanel(true); };
  const closePanel = () => { setShowFormPanel(false); setEditingProduct(null); };

  const handleSave = async (formData) => {
    if (editingProduct?._id) { await updateProduct(editingProduct._id, formData); }
    else { await createProduct(formData); }
    closePanel();
    fetchAll();
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    await deleteProduct(deletingProduct._id);
    setDeletingProduct(null);
    fetchAll();
  };

  const handleToggle = async (product) => {
    await toggleProduct(product._id);
    fetchAll();
  };

  const moveProduct = async (index, direction) => {
    const arr = [...products];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setProducts(arr);
    await reorderProducts(arr.map((p, i) => ({ id: p._id, sortOrder: i })));
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat   = filterCategory === 'all' || p.category === filterCategory;
    const matchesBrand = filterBrand === 'all' || p.brand === filterBrand;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.nameNepali?.toLowerCase().includes(q);
    return matchesCat && matchesBrand && matchesSearch;
  });

  // Brand lookup map for colour
  const brandMap = Object.fromEntries(brands.map((b) => [b.name, b]));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-forest-800 text-xl">Products</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {products.length} total · {products.filter((p) => p.isActive).length} active
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm">
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl shadow-sm px-5 py-3.5 space-y-3">
        {/* Search + category row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-xs flex-shrink-0">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500 bg-gray-50" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'premium', 'specialty', 'medium', 'economy'].map((cat) => (
              <button key={cat} onClick={() => setFilterCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition ${filterCategory === cat ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest-700'}`}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Brand filter row — only shown if brands exist */}
        {brands.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0 flex items-center gap-1">
              <FaTag className="text-xs" /> Brand:
            </span>
            <button onClick={() => setFilterBrand('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${filterBrand === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All Brands
            </button>
            {brands.map((b) => {
              const active = filterBrand === b.name;
              return (
                <button key={b._id} onClick={() => setFilterBrand(b.name)}
                  style={active ? { backgroundColor: b.accentColor, color: '#fff' } : {}}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${active ? '' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {b.logo
                    ? <img src={b.logo} alt="" className="w-3.5 h-3.5 object-contain" />
                    : <span className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: active ? 'rgba(255,255,255,0.4)' : b.accentColor }} />}
                  {b.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Products list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">🌾</div>
            <p className="text-gray-500 font-medium">No products found</p>
            {!searchQuery && filterCategory === 'all' && filterBrand === 'all' && (
              <button onClick={openAdd} className="mt-4 btn-primary text-sm"><FaPlus /> Add First Product</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {/* Table header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div className="col-span-1">Order</div>
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Product</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Brand</div>
              <div className="col-span-1">Sizes</div>
              <div className="col-span-2">Actions</div>
            </div>

            {filteredProducts.map((product) => {
              const realIndex = products.findIndex((p) => p._id === product._id);
              const brand = product.brand ? brandMap[product.brand] : null;
              return (
                <div key={product._id}
                  className={`grid grid-cols-2 md:grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 transition-colors ${!product.isActive ? 'opacity-55' : ''}`}>

                  {/* Reorder */}
                  <div className="hidden md:flex col-span-1 flex-col gap-1 items-center">
                    <button onClick={() => moveProduct(realIndex, 'up')} disabled={realIndex === 0}
                      className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 transition">
                      <FaChevronUp className="text-xs" />
                    </button>
                    <span className="text-xs text-gray-300 font-mono">{realIndex + 1}</span>
                    <button onClick={() => moveProduct(realIndex, 'down')} disabled={realIndex === products.length - 1}
                      className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 transition">
                      <FaChevronDown className="text-xs" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="col-span-1 hidden md:block">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                      {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🌾</span>}
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="col-span-2 md:col-span-3">
                    <p className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</p>
                    {product.nameNepali && <p className="text-gray-400 text-xs mt-0.5">{product.nameNepali}</p>}
                    <p className="text-gray-500 text-xs mt-1 line-clamp-1">{product.description}</p>
                  </div>

                  {/* Category */}
                  <div className="hidden md:block col-span-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[product.category] || ''}`}>
                      {product.category}
                    </span>
                  </div>

                  {/* Brand */}
                  <div className="hidden md:block col-span-2">
                    {brand ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${brand.accentColor}18`, color: brand.accentColor }}>
                        {brand.logo && <img src={brand.logo} alt="" className="w-3.5 h-3.5 object-contain" />}
                        {brand.name}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className="hidden md:flex col-span-1 flex-wrap gap-1">
                    {product.packagingSizes?.slice(0, 2).map((s) => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{s}</span>
                    ))}
                    {(product.packagingSizes?.length || 0) > 2 && (
                      <span className="text-xs text-gray-400">+{product.packagingSizes.length - 2}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 md:col-span-2 flex gap-2 justify-end md:justify-start flex-wrap">
                    <button onClick={() => handleToggle(product)} title={product.isActive ? 'Deactivate' : 'Activate'}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition text-sm ${product.isActive ? 'bg-forest-100 text-forest-700 hover:bg-forest-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                      {product.isActive ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button onClick={() => openEdit(product)} title="Edit product"
                      className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition text-sm">
                      <FaEdit />
                    </button>
                    <button onClick={() => setDeletingProduct(product)} title="Delete product"
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition text-sm">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {products.length > 1 && (
        <p className="text-xs text-gray-400 text-center">Use ↑ ↓ to reorder. Order is reflected immediately on the website.</p>
      )}

      {showFormPanel && (
        <ProductFormPanel product={editingProduct} brands={brands} onSave={handleSave} onClose={closePanel} saving={saving} />
      )}

      {deletingProduct && (
        <DeleteModal product={deletingProduct} onConfirm={handleDelete} onCancel={() => setDeletingProduct(null)} saving={saving} />
      )}
    </div>
  );
}
