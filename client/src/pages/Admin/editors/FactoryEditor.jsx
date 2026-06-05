import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

function Section({ title, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
      >
        <h2 className="font-heading font-bold text-forest-800">{title}</h2>
        {open ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-gray-50 pt-4 space-y-4">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, textarea, rows = 3, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="input-field resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="input-field"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

const newId = () => `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function FactoryEditor() {
  const { loadFactory, saveFactory, saving } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState({ hero: true });

  const toggle = (k) => setOpen((s) => ({ ...s, [k]: !s[k] }));

  useEffect(() => {
    loadFactory().then(setData).finally(() => setLoading(false));
  }, []);

  const set = (path, val) => {
    setData((prev) => {
      const next = { ...prev };
      const parts = path.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = val;
      return next;
    });
  };

  const addItem = (arrayPath, template) => {
    setData((prev) => {
      const next = { ...prev };
      const parts = arrayPath.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      const key = parts[parts.length - 1];
      obj[key] = [...(obj[key] || []), { id: newId(), ...template }];
      return next;
    });
  };

  const removeItem = (arrayPath, id) => {
    setData((prev) => {
      const next = { ...prev };
      const parts = arrayPath.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      const key = parts[parts.length - 1];
      obj[key] = (obj[key] || []).filter((x) => x.id !== id);
      return next;
    });
  };

  const updateItem = (arrayPath, id, field, val) => {
    setData((prev) => {
      const next = { ...prev };
      const parts = arrayPath.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = { ...obj[parts[i]] };
        obj = obj[parts[i]];
      }
      const key = parts[parts.length - 1];
      obj[key] = (obj[key] || []).map((x) => x.id === id ? { ...x, [field]: val } : x);
      return next;
    });
  };

  const handleSave = async () => { await saveFactory(data); };

  if (loading) return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
      <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-gray-400">Loading factory content...</p>
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-4">

      {/* ── Hero ── */}
      <Section title="Hero Section" open={!!open.hero} onToggle={() => toggle('hero')}>
        <Field label="Page Title" value={data.hero?.title} onChange={(v) => set('hero.title', v)} placeholder="State-of-the-Art Rice Milling" />
        <Field label="Subtitle" value={data.hero?.subtitle} onChange={(v) => set('hero.subtitle', v)} textarea placeholder="Short tagline below the title" />
      </Section>

      {/* ── Capacity ── */}
      <Section title="Mill at a Glance (Capacity Cards)" open={!!open.capacity} onToggle={() => toggle('capacity')}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Section Tag" value={data.capacity?.sectionTag} onChange={(v) => set('capacity.sectionTag', v)} />
          <Field label="Section Title" value={data.capacity?.title} onChange={(v) => set('capacity.title', v)} />
        </div>
        {(data.capacity?.items || []).map((item, i) => (
          <div key={item.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Stat {i + 1}</span>
              <button type="button" onClick={() => removeItem('capacity.items', item.id)} className="text-red-400 hover:text-red-600">
                <FaTrash className="text-sm" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Icon (emoji)" value={item.icon} onChange={(v) => updateItem('capacity.items', item.id, 'icon', v)} placeholder="⚙️" />
              <Field label="Value" value={item.value} onChange={(v) => updateItem('capacity.items', item.id, 'value', v)} placeholder="50 MT" />
              <Field label="Label" value={item.label} onChange={(v) => updateItem('capacity.items', item.id, 'label', v)} placeholder="Daily Capacity" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addItem('capacity.items', { icon: '📊', label: '', value: '' })}
          className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 font-medium">
          <FaPlus /> Add Stat
        </button>
      </Section>

      {/* ── Process ── */}
      <Section title="Milling Process Steps" open={!!open.process} onToggle={() => toggle('process')}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Section Tag" value={data.process?.sectionTag} onChange={(v) => set('process.sectionTag', v)} />
          <Field label="Title" value={data.process?.title} onChange={(v) => set('process.title', v)} />
        </div>
        <Field label="Subtitle" value={data.process?.subtitle} onChange={(v) => set('process.subtitle', v)} textarea rows={2} />
        {(data.process?.steps || []).map((step, i) => (
          <div key={step.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Step {i + 1}</span>
              <button type="button" onClick={() => removeItem('process.steps', step.id)} className="text-red-400 hover:text-red-600">
                <FaTrash className="text-sm" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Step No." value={step.step} onChange={(v) => updateItem('process.steps', step.id, 'step', v)} placeholder="01" />
              <Field label="Icon" value={step.icon} onChange={(v) => updateItem('process.steps', step.id, 'icon', v)} placeholder="🌾" />
              <Field label="Title" value={step.title} onChange={(v) => updateItem('process.steps', step.id, 'title', v)} />
            </div>
            <Field label="Description" value={step.desc} onChange={(v) => updateItem('process.steps', step.id, 'desc', v)} textarea rows={2} />
          </div>
        ))}
        <button type="button" onClick={() => addItem('process.steps', { step: String((data.process?.steps?.length || 0) + 1).padStart(2, '0'), icon: '⚙️', title: '', desc: '' })}
          className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 font-medium">
          <FaPlus /> Add Step
        </button>
      </Section>

      {/* ── Machinery ── */}
      <Section title="Machinery Table" open={!!open.machinery} onToggle={() => toggle('machinery')}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Section Tag" value={data.machinery?.sectionTag} onChange={(v) => set('machinery.sectionTag', v)} />
          <Field label="Title" value={data.machinery?.title} onChange={(v) => set('machinery.title', v)} />
        </div>
        <Field label="Subtitle" value={data.machinery?.subtitle} onChange={(v) => set('machinery.subtitle', v)} textarea rows={2} />
        {(data.machinery?.items || []).map((item, i) => (
          <div key={item.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Machine {i + 1}</span>
              <button type="button" onClick={() => removeItem('machinery.items', item.id)} className="text-red-400 hover:text-red-600">
                <FaTrash className="text-sm" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Machine Name" value={item.name} onChange={(v) => updateItem('machinery.items', item.id, 'name', v)} />
              <Field label="Quantity" value={item.qty} onChange={(v) => updateItem('machinery.items', item.id, 'qty', v)} placeholder="4 units" />
              <Field label="Specification" value={item.spec} onChange={(v) => updateItem('machinery.items', item.id, 'spec', v)} placeholder="3–5 MT/hr" />
              <Field label="Purpose" value={item.purpose} onChange={(v) => updateItem('machinery.items', item.id, 'purpose', v)} placeholder="De-husking" />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addItem('machinery.items', { name: '', qty: '', spec: '', purpose: '' })}
          className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 font-medium">
          <FaPlus /> Add Machine
        </button>
      </Section>

      {/* ── Quality ── */}
      <Section title="Quality Assurance" open={!!open.quality} onToggle={() => toggle('quality')}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Section Tag" value={data.quality?.sectionTag} onChange={(v) => set('quality.sectionTag', v)} />
          <Field label="Title" value={data.quality?.title} onChange={(v) => set('quality.title', v)} />
        </div>
        <Field label="Description" value={data.quality?.description} onChange={(v) => set('quality.description', v)} textarea rows={3} />

        <p className="text-sm font-medium text-gray-600 pt-2">Checklist Items</p>
        {(data.quality?.checklist || []).map((item, i) => (
          <div key={item.id} className="flex gap-2 items-center">
            <input value={item.text} onChange={(e) => updateItem('quality.checklist', item.id, 'text', e.target.value)}
              className="input-field flex-1" placeholder="Checklist item text" />
            <button type="button" onClick={() => removeItem('quality.checklist', item.id)} className="text-red-400 hover:text-red-600 p-2">
              <FaTrash />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItem('quality.checklist', { text: '' })}
          className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 font-medium">
          <FaPlus /> Add Checklist Item
        </button>

        <p className="text-sm font-medium text-gray-600 pt-2">QA Cards</p>
        {(data.quality?.cards || []).map((card, i) => (
          <div key={card.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Card {i + 1}</span>
              <button type="button" onClick={() => removeItem('quality.cards', card.id)} className="text-red-400 hover:text-red-600">
                <FaTrash className="text-sm" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Emoji" value={card.emoji} onChange={(v) => updateItem('quality.cards', card.id, 'emoji', v)} placeholder="🔬" />
              <Field label="Title" value={card.title} onChange={(v) => updateItem('quality.cards', card.id, 'title', v)} />
              <Field label="Description" value={card.desc} onChange={(v) => updateItem('quality.cards', card.id, 'desc', v)} />
            </div>
          </div>
        ))}
        <button type="button" onClick={() => addItem('quality.cards', { emoji: '✅', title: '', desc: '' })}
          className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 font-medium">
          <FaPlus /> Add QA Card
        </button>
      </Section>

      {/* ── Location ── */}
      <Section title="Location & Map" open={!!open.location} onToggle={() => toggle('location')}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Section Tag" value={data.location?.sectionTag} onChange={(v) => set('location.sectionTag', v)} />
          <Field label="Title" value={data.location?.title} onChange={(v) => set('location.title', v)} />
        </div>
        <Field label="Subtitle" value={data.location?.subtitle} onChange={(v) => set('location.subtitle', v)} textarea rows={2} />
        <Field label="Address (display text)" value={data.location?.address} onChange={(v) => set('location.address', v)} />
        <Field label="Google Maps Link URL" value={data.location?.mapLinkUrl} onChange={(v) => set('location.mapLinkUrl', v)} placeholder="https://maps.google.com/?q=..." />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL</label>
          <textarea value={data.location?.mapEmbedUrl || ''} onChange={(e) => set('location.mapEmbedUrl', e.target.value)}
            rows={3} className="input-field resize-none text-xs" placeholder="Paste the src= URL from a Google Maps embed code here" />
          <p className="text-xs text-gray-400 mt-1">In Google Maps → Share → Embed a map → copy only the src="…" value</p>
        </div>
      </Section>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-forest-700 text-white px-6 py-3 rounded-xl hover:bg-forest-600 transition font-medium disabled:opacity-60"
      >
        <FaSave /> {saving ? 'Saving...' : 'Save All Factory Content'}
      </button>
    </div>
  );
}
