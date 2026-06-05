import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';
import ImageUpload from '../../../components/admin/ImageUpload';

const TABS = [
  { key: 'hero',            label: 'Hero' },
  { key: 'profile',         label: 'Profile' },
  { key: 'visionMission',   label: 'Vision & Mission' },
  { key: 'values',          label: 'Values' },
  { key: 'history',         label: 'History' },
  { key: 'factory',         label: 'Factory' },
  { key: 'team',            label: 'Team' },
  { key: 'certifications',  label: 'Certifications' },
];

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AboutEditor({ data: initialData, sectionKey }) {
  const { loadContent: _lc, saveSection, uploadImage } = useAdmin();
  // About uses a different API endpoint — we call it directly
  const { token } = useAdmin();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load about content via admin API
  useEffect(() => {
    import('axios').then(({ default: axios }) => {
      axios.get('/api/admin/about', { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } })
        .then((r) => setData(r.data.data || {}))
        .finally(() => setLoading(false));
    });
  }, []);

  const saveAboutSection = async (section, sectionData) => {
    setSaving(true);
    try {
      const { default: axios } = await import('axios');
      const res = await axios.put(
        '/api/admin/about',
        { section, data: sectionData },
        { headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } }
      );
      setData(res.data.data);
      alert(`✅ ${section} saved!`);
    } catch {
      alert('❌ Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const set = (section, field, val) =>
    setData((d) => ({ ...d, [section]: { ...d[section], [field]: val } }));

  const setNested = (section, subsection, field, val) =>
    setData((d) => ({
      ...d,
      [section]: { ...d[section], [subsection]: { ...d[section]?.[subsection], [field]: val } },
    }));

  if (loading || !data) {
    return <div className="bg-white rounded-2xl shadow-sm p-12 text-center"><div className="text-5xl animate-float mb-3">🌾</div><p className="text-gray-400">Loading about content...</p></div>;
  }

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === key ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-forest-50 hover:text-forest-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      {activeTab === 'hero' && (
        <EditorCard title="Hero Section" onSave={() => saveAboutSection('hero', data.hero)} saving={saving}>
          <Field label="Page Title" value={data.hero?.title} onChange={(v) => set('hero', 'title', v)} placeholder="About Shree Suryodaya" />
          <TextareaField label="Subtitle" value={data.hero?.subtitle} onChange={(v) => set('hero', 'subtitle', v)} rows={2} />
          <ImageUpload label="Hero Background Image (optional)" value={data.hero?.image} onChange={(url) => set('hero', 'image', url)} height="h-44" />
        </EditorCard>
      )}

      {/* ── PROFILE ── */}
      {activeTab === 'profile' && (
        <EditorCard title="Company Profile" onSave={() => saveAboutSection('profile', data.profile)} saving={saving}>
          <Field label="Section Tag" value={data.profile?.sectionTag} onChange={(v) => set('profile', 'sectionTag', v)} />
          <Field label="Title" value={data.profile?.title} onChange={(v) => set('profile', 'title', v)} placeholder="Who We Are" />
          <TextareaField label="Description (use blank line between paragraphs)" value={data.profile?.description} onChange={(v) => set('profile', 'description', v)} rows={10} />
          <ImageUpload label="Company Photo" value={data.profile?.image} onChange={(url) => set('profile', 'image', url)} height="h-48" />
          <ArrayEditor
            title="Highlight Stats"
            items={data.profile?.highlights || []}
            onChange={(items) => set('profile', 'highlights', items)}
            defaultItem={() => ({ id: uid(), icon: '📊', label: '', value: '' })}
            renderItem={(item, setItem) => (
              <div className="grid sm:grid-cols-3 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Icon</label><input type="text" value={item.icon} onChange={(e) => setItem('icon', e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Value</label><input type="text" value={item.value} onChange={(e) => setItem('value', e.target.value)} className={inputCls} placeholder="e.g. 2009" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Label</label><input type="text" value={item.label} onChange={(e) => setItem('label', e.target.value)} className={inputCls} placeholder="Established" /></div>
              </div>
            )}
          />
        </EditorCard>
      )}

      {/* ── VISION & MISSION ── */}
      {activeTab === 'visionMission' && (
        <div className="space-y-5">
          {[
            { sub: 'vision', label: 'Vision', hasImage: true },
            { sub: 'mission', label: 'Mission', hasImage: true },
            { sub: 'commitment', label: 'Commitment', hasImage: false },
          ].map(({ sub, label, hasImage }) => (
            <EditorCard key={sub} title={label} onSave={() => saveAboutSection('visionMission', data.visionMission)} saving={saving}>
              <Field label="Title" value={data.visionMission?.[sub]?.title} onChange={(v) => setNested('visionMission', sub, 'title', v)} placeholder={`Our ${label}`} />
              <TextareaField label="Content" value={data.visionMission?.[sub]?.content} onChange={(v) => setNested('visionMission', sub, 'content', v)} rows={5} />
              {hasImage && <ImageUpload label="Section Image (optional)" value={data.visionMission?.[sub]?.image} onChange={(url) => setNested('visionMission', sub, 'image', url)} height="h-36" />}
            </EditorCard>
          ))}
        </div>
      )}

      {/* ── VALUES ── */}
      {activeTab === 'values' && (
        <EditorCard title="Core Values" onSave={() => saveAboutSection('values', data.values)} saving={saving}>
          <ArrayEditor
            items={data.values || []}
            onChange={(items) => setData((d) => ({ ...d, values: items }))}
            defaultItem={() => ({ id: uid(), icon: '⭐', title: '', description: '', color: 'green' })}
            renderItem={(item, setItem) => (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Icon</label><input type="text" value={item.icon} onChange={(e) => setItem('icon', e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Title</label><input type="text" value={item.title} onChange={(e) => setItem('title', e.target.value)} className={inputCls} /></div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Color</label>
                    <select value={item.color} onChange={(e) => setItem('color', e.target.value)} className={`${inputCls} bg-white`}>
                      {['green', 'gold', 'blue', 'brown'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="text-xs text-gray-500 mb-1 block">Description</label><textarea rows={2} value={item.description} onChange={(e) => setItem('description', e.target.value)} className={`${inputCls} resize-none`} /></div>
              </div>
            )}
          />
        </EditorCard>
      )}

      {/* ── HISTORY ── */}
      {activeTab === 'history' && (
        <EditorCard title="Company History" onSave={() => saveAboutSection('history', data.history)} saving={saving}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Tag" value={data.history?.sectionTag} onChange={(v) => set('history', 'sectionTag', v)} />
            <Field label="Title" value={data.history?.title} onChange={(v) => set('history', 'title', v)} />
          </div>
          <TextareaField label="Subtitle" value={data.history?.subtitle} onChange={(v) => set('history', 'subtitle', v)} rows={2} />
          <ArrayEditor
            title="Timeline Milestones"
            items={data.history?.milestones || []}
            onChange={(items) => set('history', 'milestones', items)}
            defaultItem={() => ({ id: uid(), year: '', title: '', description: '', image: '' })}
            renderItem={(item, setItem, _, uploadImg) => (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Year</label><input type="text" value={item.year} onChange={(e) => setItem('year', e.target.value)} className={inputCls} placeholder="2009" /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Title</label><input type="text" value={item.title} onChange={(e) => setItem('title', e.target.value)} className={inputCls} /></div>
                </div>
                <div><label className="text-xs text-gray-500 mb-1 block">Description</label><textarea rows={3} value={item.description} onChange={(e) => setItem('description', e.target.value)} className={`${inputCls} resize-none`} /></div>
                <ImageUpload label="Image (optional)" value={item.image} onChange={(url) => setItem('image', url)} height="h-28" />
              </div>
            )}
          />
        </EditorCard>
      )}

      {/* ── FACTORY ── */}
      {activeTab === 'factory' && (
        <EditorCard title="Factory Information" onSave={() => saveAboutSection('factory', data.factory)} saving={saving}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Tag" value={data.factory?.sectionTag} onChange={(v) => set('factory', 'sectionTag', v)} />
            <Field label="Title" value={data.factory?.title} onChange={(v) => set('factory', 'title', v)} />
          </div>
          <TextareaField label="Subtitle" value={data.factory?.subtitle} onChange={(v) => set('factory', 'subtitle', v)} rows={2} />
          <TextareaField label="Description" value={data.factory?.description} onChange={(v) => set('factory', 'description', v)} rows={4} />
          <ArrayEditor
            title="Factory Specs"
            items={data.factory?.specs || []}
            onChange={(items) => set('factory', 'specs', items)}
            defaultItem={() => ({ id: uid(), icon: '⚙️', label: '', value: '' })}
            renderItem={(item, setItem) => (
              <div className="grid sm:grid-cols-3 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Icon</label><input type="text" value={item.icon} onChange={(e) => setItem('icon', e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Value</label><input type="text" value={item.value} onChange={(e) => setItem('value', e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Label</label><input type="text" value={item.label} onChange={(e) => setItem('label', e.target.value)} className={inputCls} /></div>
              </div>
            )}
          />
          <ArrayEditor
            title="Factory Images"
            items={data.factory?.images || []}
            onChange={(items) => set('factory', 'images', items)}
            defaultItem={() => ({ id: uid(), src: '', caption: '' })}
            renderItem={(item, setItem) => (
              <div className="space-y-2">
                <ImageUpload label="" value={item.src} onChange={(url) => setItem('src', url)} height="h-32" />
                <input type="text" value={item.caption} onChange={(e) => setItem('caption', e.target.value)} placeholder="Caption" className={inputCls} />
              </div>
            )}
          />
        </EditorCard>
      )}

      {/* ── TEAM ── */}
      {activeTab === 'team' && (
        <EditorCard title="Team" onSave={() => saveAboutSection('team', data.team)} saving={saving}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Tag" value={data.team?.sectionTag} onChange={(v) => set('team', 'sectionTag', v)} />
            <Field label="Title" value={data.team?.title} onChange={(v) => set('team', 'title', v)} />
          </div>
          <TextareaField label="Subtitle" value={data.team?.subtitle} onChange={(v) => set('team', 'subtitle', v)} rows={2} />
          <ArrayEditor
            title="Team Members"
            items={data.team?.members || []}
            onChange={(items) => set('team', 'members', items)}
            defaultItem={() => ({ id: uid(), name: '', role: '', bio: '', image: '' })}
            renderItem={(item, setItem) => (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Name</label><input type="text" value={item.name} onChange={(e) => setItem('name', e.target.value)} className={inputCls} /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Role</label><input type="text" value={item.role} onChange={(e) => setItem('role', e.target.value)} className={inputCls} /></div>
                </div>
                <TextareaField label="Bio" value={item.bio} onChange={(v) => setItem('bio', v)} rows={2} />
                <ImageUpload label="Photo" value={item.image} onChange={(url) => setItem('image', url)} height="h-36" />
              </div>
            )}
          />
        </EditorCard>
      )}

      {/* ── CERTIFICATIONS ── */}
      {activeTab === 'certifications' && (
        <EditorCard title="Certifications" onSave={() => saveAboutSection('certifications', data.certifications)} saving={saving}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Section Tag" value={data.certifications?.sectionTag} onChange={(v) => set('certifications', 'sectionTag', v)} />
            <Field label="Title" value={data.certifications?.title} onChange={(v) => set('certifications', 'title', v)} />
          </div>
          <ArrayEditor
            items={data.certifications?.items || []}
            onChange={(items) => set('certifications', 'items', items)}
            defaultItem={() => ({ id: uid(), icon: '🏛️', title: '', issuer: '', year: '' })}
            renderItem={(item, setItem) => (
              <div className="grid sm:grid-cols-4 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Icon</label><input type="text" value={item.icon} onChange={(e) => setItem('icon', e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Title</label><input type="text" value={item.title} onChange={(e) => setItem('title', e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Issuer</label><input type="text" value={item.issuer} onChange={(e) => setItem('issuer', e.target.value)} className={inputCls} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Year</label><input type="text" value={item.year} onChange={(e) => setItem('year', e.target.value)} className={inputCls} /></div>
              </div>
            )}
          />
        </EditorCard>
      )}
    </div>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────────
const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500';

function EditorCard({ title, children, onSave, saving }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
      <h2 className="font-heading font-bold text-forest-800 text-lg">{title}</h2>
      {children}
      <button onClick={onSave} disabled={saving} className="btn-primary w-full justify-center py-3 disabled:opacity-60">
        {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><FaSave /> Save {title}</>}
      </button>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 4 }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} resize-none`} />
    </div>
  );
}

function ArrayEditor({ title, items, onChange, defaultItem, renderItem }) {
  const update = (i, field, val) => {
    const arr = [...items];
    arr[i] = { ...arr[i], [field]: val };
    onChange(arr);
  };
  const add = () => onChange([...items, defaultItem()]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-700">{title}</label>
          <button type="button" onClick={add} className="flex items-center gap-1.5 bg-forest-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-forest-800 transition"><FaPlus /> Add</button>
        </div>
      )}
      {!title && <div className="flex justify-end mb-3"><button type="button" onClick={add} className="flex items-center gap-1.5 bg-forest-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-forest-800 transition"><FaPlus /> Add</button></div>}
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={item.id || i} className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative">
            <button type="button" onClick={() => remove(i)} className="absolute top-3 right-3 text-red-400 hover:text-red-600"><FaTrash className="text-xs" /></button>
            {renderItem(item, (field, val) => update(i, field, val))}
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No items yet. Click Add to create one.</p>}
      </div>
    </div>
  );
}
