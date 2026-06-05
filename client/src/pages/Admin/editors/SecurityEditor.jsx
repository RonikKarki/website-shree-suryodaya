import { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaSave, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

function PasswordInput({ label, value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field pr-10"
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}

export default function SecurityEditor() {
  const { changePassword, saving } = useAdmin();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState(false);

  const set = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.current) { setError('Current password is required.'); return; }
    if (!form.next)    { setError('New password is required.'); return; }
    if (form.next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (form.next !== form.confirm) { setError('New passwords do not match.'); return; }
    if (form.next === form.current) { setError('New password must be different from the current one.'); return; }

    try {
      await changePassword(form.current, form.next);
      setForm({ current: '', next: '', confirm: '' });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to change password. Check your current password.');
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      {/* Change password card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-forest-700 rounded-xl flex items-center justify-center">
            <FaLock className="text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-forest-800 text-lg">Change Admin Password</h2>
            <p className="text-gray-400 text-xs">Password is hashed with bcrypt and stored securely</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={form.current}
            onChange={(v) => set('current', v)}
            placeholder="Enter your current password"
          />
          <PasswordInput
            label="New Password"
            value={form.next}
            onChange={(v) => set('next', v)}
            placeholder="Minimum 8 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            value={form.confirm}
            onChange={(v) => set('confirm', v)}
            placeholder="Re-enter new password"
          />

          {/* Strength hint */}
          {form.next.length > 0 && (
            <div className="flex gap-1">
              {[4, 8, 12].map((threshold, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    form.next.length >= threshold
                      ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-amber-400' : 'bg-forest-500'
                      : 'bg-gray-100'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-2">
                {form.next.length < 8 ? 'Too short' : form.next.length < 12 ? 'Fair' : 'Strong'}
              </span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-red-600 text-sm">
              <FaInfoCircle className="flex-shrink-0" /> {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-forest-50 border border-forest-100 rounded-xl p-3 text-forest-700 text-sm">
              <FaShieldAlt className="flex-shrink-0" /> Password changed successfully. A new session token was issued.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-forest-700 text-white py-2.5 rounded-xl hover:bg-forest-600 transition text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            <FaSave /> {saving ? 'Saving...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Security info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <FaShieldAlt className="text-blue-500" />
          </div>
          <h2 className="font-heading font-bold text-forest-800 text-lg">Security Info</h2>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-forest-500 font-bold mt-0.5">✓</span>
            Admin password is stored as a bcrypt hash (12 rounds) — never in plain text.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-forest-500 font-bold mt-0.5">✓</span>
            Login is protected by rate limiting: 10 attempts per 15 minutes per IP.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-forest-500 font-bold mt-0.5">✓</span>
            All admin API routes require a valid JWT Bearer token (12-hour expiry).
          </li>
          <li className="flex items-start gap-2">
            <span className="text-forest-500 font-bold mt-0.5">✓</span>
            HTTP headers are secured with Helmet (X-Frame-Options, X-Content-Type, etc.).
          </li>
          <li className="flex items-start gap-2">
            <span className="text-forest-500 font-bold mt-0.5">✓</span>
            CORS is restricted to allowed origins only.
          </li>
        </ul>
      </div>
    </div>
  );
}
