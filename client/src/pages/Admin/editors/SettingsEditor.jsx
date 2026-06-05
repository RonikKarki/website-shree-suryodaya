import { useState, useEffect } from 'react';
import { FaSave, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

export default function SettingsEditor() {
  const { loadSettings, saveSettings, saving } = useAdmin();
  const [form, setForm] = useState({
    whatsappNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    whatsappDefaultMessage: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings()
      .then((data) => { if (data) setForm(data); })
      .finally(() => setLoading(false));
  }, []);

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    await saveSettings(form);
  };

  // Build preview WhatsApp URL
  const previewUrl = form.whatsappNumber
    ? `https://wa.me/${form.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(form.whatsappDefaultMessage || 'Hello!')}`
    : null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400">Loading settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* WhatsApp — most important */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center">
            <FaWhatsapp className="text-white text-xl" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-forest-800 text-lg">WhatsApp Settings</h2>
            <p className="text-gray-400 text-xs">Used for the "Inquire on WhatsApp" button on every product</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.whatsappNumber}
              onChange={(e) => set('whatsappNumber', e.target.value)}
              placeholder="977XXXXXXXXXX (country code + number, no + or spaces)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Format: <code className="bg-gray-100 px-1 rounded">977XXXXXXXXXX</code> — Nepal country code (977) followed by the 10-digit mobile number. No +, spaces, or dashes.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Default WhatsApp Message</label>
            <textarea
              rows={3}
              value={form.whatsappDefaultMessage}
              onChange={(e) => set('whatsappDefaultMessage', e.target.value)}
              placeholder="Hello! I am interested in your rice products. Please provide more information."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              This message pre-fills the WhatsApp chat when a customer clicks the inquiry button. Individual products can override this with their own message.
            </p>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="bg-[#f0fdf4] border border-[#25D366]/30 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview WhatsApp Link:</p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#25D366] hover:text-[#1ebe5a] text-sm font-medium"
              >
                <FaWhatsapp />
                Test this WhatsApp link
                <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Contact Information</h2>
        <div className="space-y-4">
          <FieldWithIcon icon={FaPhone} label="Phone Number" value={form.phoneNumber} onChange={(v) => set('phoneNumber', v)} placeholder="+977-XX-XXXXXXX" />
          <FieldWithIcon icon={FaEnvelope} label="Email Address" value={form.email} onChange={(v) => set('email', v)} placeholder="info@shreesuryodaya.com.np" />
          <FieldWithIcon icon={FaMapMarkerAlt} label="Address" value={form.address} onChange={(v) => set('address', v)} placeholder="Gaindakot, Nawalpur, Gandaki Province, Nepal" />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-heading font-bold text-forest-800 text-lg mb-5">Social Media Links</h2>
        <div className="space-y-4">
          <FieldWithIcon icon={FaFacebook} label="Facebook Page URL" value={form.facebookUrl} onChange={(v) => set('facebookUrl', v)} placeholder="https://facebook.com/yourpage" />
          <FieldWithIcon icon={FaInstagram} label="Instagram Profile URL" value={form.instagramUrl} onChange={(v) => set('instagramUrl', v)} placeholder="https://instagram.com/yourprofile" />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60"
      >
        {saving ? (
          <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
        ) : (
          <><FaSave /> Save Settings</>
        )}
      </button>
    </form>
  );
}

function FieldWithIcon({ icon: Icon, label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
        />
      </div>
    </div>
  );
}
