import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

export default function WhatsAppFloat() {
  const [settings, setSettings] = useState(null);
  const [open, setOpen]         = useState(false);
  const [visible, setVisible]   = useState(false);

  useEffect(() => {
    axios.get('/api/settings')
      .then((r) => {
        const d = r.data.data;
        if (d?.whatsappNumber) setSettings(d);
      })
      .catch(() => {});

    // Slide in after 1.5 s so it doesn't compete with the page load
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!settings?.whatsappNumber) return null;

  const number  = settings.whatsappNumber.replace(/\D/g, '');
  const message = settings.whatsappDefaultMessage ||
    'Hello! I am interested in your rice products. Please share more information about pricing and availability.';
  const waUrl   = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Chat bubble (expanded) */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl w-72 overflow-hidden border border-gray-100 animate-fade-in">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <FaWhatsapp className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">Shree Suryodaya</p>
                <p className="text-white/70 text-xs">Usually replies within minutes</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition p-1"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>

          {/* Message preview */}
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-gray-700 leading-relaxed">
              👋 Hi! Have a question about our rice products? We're happy to help with pricing, availability, or wholesale inquiries.
            </div>
          </div>

          {/* CTA */}
          <div className="p-4 pt-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <FaWhatsapp className="text-lg" />
              Start Chat on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <div className="relative">
        {/* Pulse ring — only when collapsed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 pointer-events-none" />
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Chat on WhatsApp"
          className="relative w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95"
        >
          {open
            ? <FaTimes className="text-xl" />
            : <FaWhatsapp className="text-3xl" />}
        </button>
      </div>
    </div>
  );
}
