import { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaWhatsapp, FaExternalLinkAlt } from 'react-icons/fa';

const uid = () => `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const icls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500';

export default function ContactEditor() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    import('axios').then(({ default: axios }) => {
      axios.get('/api/admin/contact-page', { headers })
        .then((r) => setForm(r.data.data || {}))
        .finally(() => setLoading(false));
    });
  }, []);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const setNested = (parent, field, val) => setForm((f) => ({ ...f, [parent]: { ...f[parent], [field]: val } }));

  const save = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const { default: axios } = await import('axios');
      await axios.put('/api/admin/contact-page', form, { headers });
      alert('✅ Contact page saved!');
    } catch { alert('❌ Save failed.'); }
    finally { setSaving(false); }
  };

  if (loading || !form) {
    return <div className="bg-white rounded-2xl shadow-sm p-12 text-center"><div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400">Loading...</p></div>;
  }

  const waNumber = (form.whatsappNumber || '').replace(/\D/g, '');
  const waPreview = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(form.whatsappMessage || 'Hello!')}` : null;

  return (
    <form onSubmit={save} className="space-y-6">
      {/* Hero */}
      <Card title="Page Hero">
        <Field label="Page Title" value={form.hero?.title} onChange={(v) => setNested('hero', 'title', v)} placeholder="Contact Us" />
        <TextArea label="Subtitle" value={form.hero?.subtitle} onChange={(v) => setNested('hero', 'subtitle', v)} rows={2} />
      </Card>

      {/* Intro */}
      <Card title="Intro Text">
        <Field label="Intro Title" value={form.intro?.title} onChange={(v) => setNested('intro', 'title', v)} placeholder="Reach Out to Us" />
        <TextArea label="Intro Description" value={form.intro?.description} onChange={(v) => setNested('intro', 'description', v)} rows={3} />
      </Card>

      {/* Address */}
      <Card title="Address">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Street / Area" value={form.address?.street} onChange={(v) => setNested('address', 'street', v)} placeholder="Gaindakot Municipality" />
          <Field label="City" value={form.address?.city} onChange={(v) => setNested('address', 'city', v)} placeholder="Gaindakot" />
          <Field label="District" value={form.address?.district} onChange={(v) => setNested('address', 'district', v)} placeholder="Nawalpur" />
          <Field label="Province" value={form.address?.province} onChange={(v) => setNested('address', 'province', v)} placeholder="Gandaki Province" />
          <Field label="Country" value={form.address?.country} onChange={(v) => setNested('address', 'country', v)} placeholder="Nepal" />
        </div>
      </Card>

      {/* Phone numbers */}
      <Card title="Phone Numbers">
        <div className="space-y-3">
          {(form.phones || []).map((p, i) => (
            <div key={p.id} className="flex gap-3 items-center">
              <div className="w-1/3"><label className="text-xs text-gray-500 mb-1 block">Label</label><input type="text" value={p.label} onChange={(e) => { const arr=[...form.phones]; arr[i]={...arr[i],label:e.target.value}; set('phones',arr); }} className={icls} placeholder="Main Office" /></div>
              <div className="flex-1"><label className="text-xs text-gray-500 mb-1 block">Number</label><input type="text" value={p.number} onChange={(e) => { const arr=[...form.phones]; arr[i]={...arr[i],number:e.target.value}; set('phones',arr); }} className={icls} placeholder="+977-XX-XXXXXXX" /></div>
              <button type="button" onClick={() => set('phones', form.phones.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 mt-5"><FaTrash /></button>
            </div>
          ))}
          <button type="button" onClick={() => set('phones', [...(form.phones||[]), { id: uid(), label: '', number: '' }])} className="flex items-center gap-2 text-forest-600 hover:text-forest-800 text-sm font-medium"><FaPlus /> Add Phone Number</button>
        </div>
      </Card>

      {/* Email addresses */}
      <Card title="Email Addresses">
        <div className="space-y-3">
          {(form.emails || []).map((e, i) => (
            <div key={e.id} className="flex gap-3 items-center">
              <div className="w-1/3"><label className="text-xs text-gray-500 mb-1 block">Label</label><input type="text" value={e.label} onChange={(ev) => { const arr=[...form.emails]; arr[i]={...arr[i],label:ev.target.value}; set('emails',arr); }} className={icls} placeholder="General" /></div>
              <div className="flex-1"><label className="text-xs text-gray-500 mb-1 block">Email</label><input type="email" value={e.email} onChange={(ev) => { const arr=[...form.emails]; arr[i]={...arr[i],email:ev.target.value}; set('emails',arr); }} className={icls} placeholder="info@example.com" /></div>
              <button type="button" onClick={() => set('emails', form.emails.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 mt-5"><FaTrash /></button>
            </div>
          ))}
          <button type="button" onClick={() => set('emails', [...(form.emails||[]), { id: uid(), label: '', email: '' }])} className="flex items-center gap-2 text-forest-600 hover:text-forest-800 text-sm font-medium"><FaPlus /> Add Email</button>
        </div>
      </Card>

      {/* Office hours */}
      <Card title="Office Hours">
        <TextArea label="Office Hours (one line per entry)" value={form.officeHours} onChange={(v) => set('officeHours', v)} rows={4} placeholder={"Sunday – Friday: 9:00 AM – 5:00 PM\nSaturday: 9:00 AM – 1:00 PM"} />
      </Card>

      {/* WhatsApp */}
      <Card title="WhatsApp Settings">
        <Field label="WhatsApp Number (digits only: 977XXXXXXXXXX)" value={form.whatsappNumber} onChange={(v) => set('whatsappNumber', v)} placeholder="977XXXXXXXXXX" />
        <TextArea label="WhatsApp Pre-filled Message" value={form.whatsappMessage} onChange={(v) => set('whatsappMessage', v)} rows={3} />
        {waPreview && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Preview:</p>
            <a href={waPreview} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#1ebe5a] text-sm font-medium">
              <FaWhatsapp /> Test WhatsApp link <FaExternalLinkAlt className="text-xs" />
            </a>
          </div>
        )}
      </Card>

      {/* Google Maps */}
      <Card title="Google Maps">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Google Maps Embed URL</label>
          <input type="url" value={form.mapEmbedUrl || ''} onChange={(e) => set('mapEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." className={icls} />
          <p className="text-xs text-gray-400 mt-1">
            To get this URL: Go to Google Maps → find your location → Share → Embed a map → Copy the <code>src="..."</code> value from the iframe code.
          </p>
        </div>
        <Field label="Google Maps Link URL (for 'Open in Maps' button)" value={form.mapLinkUrl} onChange={(v) => set('mapLinkUrl', v)} placeholder="https://maps.google.com/?q=Gaindakot+Nawalpur+Nepal" />
      </Card>

      {/* Social links */}
      <Card title="Social Media Links">
        <div className="space-y-3">
          {(form.socialLinks || []).map((s, i) => (
            <div key={s.id} className="flex gap-3 items-center">
              <div className="w-1/4"><label className="text-xs text-gray-500 mb-1 block">Platform</label><input type="text" value={s.platform} onChange={(e) => { const arr=[...form.socialLinks]; arr[i]={...arr[i],platform:e.target.value}; set('socialLinks',arr); }} className={icls} placeholder="Facebook" /></div>
              <div className="w-1/4"><label className="text-xs text-gray-500 mb-1 block">Icon Key</label><input type="text" value={s.icon} onChange={(e) => { const arr=[...form.socialLinks]; arr[i]={...arr[i],icon:e.target.value}; set('socialLinks',arr); }} className={icls} placeholder="facebook" /></div>
              <div className="flex-1"><label className="text-xs text-gray-500 mb-1 block">URL</label><input type="url" value={s.url} onChange={(e) => { const arr=[...form.socialLinks]; arr[i]={...arr[i],url:e.target.value}; set('socialLinks',arr); }} className={icls} placeholder="https://facebook.com/..." /></div>
              <button type="button" onClick={() => set('socialLinks', form.socialLinks.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 mt-5"><FaTrash /></button>
            </div>
          ))}
          <button type="button" onClick={() => set('socialLinks', [...(form.socialLinks||[]), { id: uid(), platform: '', icon: '', url: '' }])} className="flex items-center gap-2 text-forest-600 hover:text-forest-800 text-sm font-medium"><FaPlus /> Add Social Link</button>
        </div>
        <p className="text-xs text-gray-400">Icon keys: <code>facebook</code>, <code>instagram</code>, <code>whatsapp</code></p>
      </Card>

      <button type="submit" disabled={saving} className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60">
        {saving ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : <><FaSave /> Save Contact Page</>}
      </button>
    </form>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="font-heading font-bold text-forest-800 text-lg border-b border-gray-100 pb-3">{title}</h2>
      {children}
    </div>
  );
}
function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={icls} />
    </div>
  );
}
function TextArea({ label, value, onChange, rows = 4, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <textarea rows={rows} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${icls} resize-none`} />
    </div>
  );
}
