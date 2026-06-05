import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 via-forest-800 to-earth-800 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <FaLeaf className="text-forest-900 text-2xl" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">Shree Suryodaya Khadya Udhyog Limited</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <FaLock className="text-forest-600" />
            <h2 className="font-heading font-bold text-forest-800 text-lg">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter admin password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            Default password is set in <code className="bg-gray-100 px-1 rounded">server/.env</code>
          </p>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          © {new Date().getFullYear()} Shree Suryodaya Khadya Udhyog Limited
        </p>
      </div>
    </div>
  );
}
