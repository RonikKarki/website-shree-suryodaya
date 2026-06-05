import { createContext, useContext, useState, useCallback, useRef } from 'react';
import axios from 'axios';

const AdminContext = createContext(null);

const api = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export function AdminProvider({ children }) {
  const [token, setToken]       = useState(() => localStorage.getItem('admin_token') || null);
  const [tokenExpiry, setTokenExpiry] = useState(() => Number(localStorage.getItem('admin_token_expiry')) || null);
  const [content, setContent]   = useState(null);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const toastTimer = useRef(null);

  const showToast = useCallback((type, msg) => {
    clearTimeout(toastTimer.current);
    setToast({ type, msg });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const isSessionExpired = useCallback(() => {
    if (!tokenExpiry) return false;
    return Date.now() > tokenExpiry * 1000;
  }, [tokenExpiry]);

  // ─── Auth ──────────────────────────────────────────────────────────────────
  const login = async (password) => {
    const res = await axios.post('/api/admin/login', { password });
    const { token: t, expiresIn } = res.data;
    const expiry = Math.floor(Date.now() / 1000) + (expiresIn || 43200);
    setToken(t);
    setTokenExpiry(expiry);
    localStorage.setItem('admin_token', t);
    localStorage.setItem('admin_token_expiry', String(expiry));
  };

  const logout = useCallback(() => {
    setToken(null);
    setContent(null);
    setTokenExpiry(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setSaving(true);
    try {
      const res = await axios.post('/api/admin/change-password',
        { currentPassword, newPassword },
        api(token)
      );
      // Update stored token if a new one was issued
      if (res.data.token) {
        const expiry = Math.floor(Date.now() / 1000) + 43200;
        setToken(res.data.token);
        setTokenExpiry(expiry);
        localStorage.setItem('admin_token', res.data.token);
        localStorage.setItem('admin_token_expiry', String(expiry));
      }
      showToast('success', 'Password changed successfully!');
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to change password.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [token, showToast]);

  // ─── Brands ──────────────────────────────────────────────────────────────────
  const loadBrands      = useCallback(async () => (await axios.get('/api/admin/brands', api(token))).data.data, [token]);
  const createBrand     = useCallback(async (data) => { setSaving(true); try { const r = await axios.post('/api/admin/brands', data, api(token)); showToast('success', 'Brand added!'); return r.data.data; } catch (e) { showToast('error', e.response?.data?.message || 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const updateBrand     = useCallback(async (id, data) => { setSaving(true); try { const r = await axios.put(`/api/admin/brands/${id}`, data, api(token)); showToast('success', 'Brand updated!'); return r.data.data; } catch (e) { showToast('error', 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const deleteBrand     = useCallback(async (id) => { setSaving(true); try { await axios.delete(`/api/admin/brands/${id}`, api(token)); showToast('success', 'Brand deleted.'); } catch (e) { showToast('error', 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const toggleBrand     = useCallback(async (id) => (await axios.patch(`/api/admin/brands/${id}/toggle`, {}, api(token))).data.data, [token]);
  const reorderBrands   = useCallback(async (order) => (await axios.post('/api/admin/brands/reorder', { order }, api(token))).data.data, [token]);

  // ─── Factory content ────────────────────────────────────────────────────────
  const loadFactory = useCallback(async () => {
    const res = await axios.get('/api/admin/factory', api(token));
    return res.data.data;
  }, [token]);

  const saveFactory = useCallback(async (data) => {
    setSaving(true);
    try {
      const res = await axios.put('/api/admin/factory', data, api(token));
      showToast('success', 'Factory content saved!');
      return res.data.data;
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save factory content.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [token, showToast]);

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    const res = await axios.get('/api/admin/dashboard', api(token));
    if (res.data.data?.messages?.unread !== undefined) {
      setUnreadCount(res.data.data.messages.unread);
    }
    return res.data.data;
  }, [token]);

  // ─── Homepage content ───────────────────────────────────────────────────────
  const loadContent = useCallback(async () => {
    const res = await axios.get('/api/admin/homepage', api(token));
    setContent(res.data.data);
    return res.data.data;
  }, [token]);

  const saveSection = useCallback(async (section, data) => {
    setSaving(true);
    try {
      const res = await axios.put('/api/admin/homepage', { section, data }, api(token));
      setContent(res.data.data);
      showToast('success', `${section} saved successfully!`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Save failed.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [token, showToast]);

  // ─── Image upload ────────────────────────────────────────────────────────────
  const uploadImage = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post('/api/admin/upload', formData, {
      headers: { ...api(token).headers, 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url;
  }, [token]);

  // ─── Settings ────────────────────────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    const res = await axios.get('/api/admin/settings', api(token));
    return res.data.data;
  }, [token]);

  const saveSettings = useCallback(async (data) => {
    setSaving(true);
    try {
      const res = await axios.put('/api/admin/settings', data, api(token));
      showToast('success', 'Settings saved!');
      return res.data.data;
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save settings.');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [token, showToast]);

  // ─── Products ────────────────────────────────────────────────────────────────
  const loadProducts    = useCallback(async () => (await axios.get('/api/admin/products', api(token))).data.data, [token]);
  const createProduct   = useCallback(async (data) => { setSaving(true); try { const r = await axios.post('/api/admin/products', data, api(token)); showToast('success', 'Product created!'); return r.data.data; } catch (e) { showToast('error', e.response?.data?.message || 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const updateProduct   = useCallback(async (id, data) => { setSaving(true); try { const r = await axios.put(`/api/admin/products/${id}`, data, api(token)); showToast('success', 'Product updated!'); return r.data.data; } catch (e) { showToast('error', e.response?.data?.message || 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const deleteProduct   = useCallback(async (id) => { setSaving(true); try { await axios.delete(`/api/admin/products/${id}`, api(token)); showToast('success', 'Product deleted.'); } catch (e) { showToast('error', 'Failed to delete.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const toggleProduct   = useCallback(async (id) => (await axios.patch(`/api/admin/products/${id}/toggle`, {}, api(token))).data.data, [token]);
  const reorderProducts = useCallback(async (order) => (await axios.post('/api/admin/products/reorder', { order }, api(token))).data.data, [token]);

  // ─── Testimonials ─────────────────────────────────────────────────────────────
  const loadTestimonials    = useCallback(async () => (await axios.get('/api/admin/testimonials', api(token))).data.data, [token]);
  const createTestimonial   = useCallback(async (data) => { setSaving(true); try { const r = await axios.post('/api/admin/testimonials', data, api(token)); showToast('success', 'Testimonial added!'); return r.data.data; } catch (e) { showToast('error', 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const updateTestimonial   = useCallback(async (id, data) => { setSaving(true); try { const r = await axios.put(`/api/admin/testimonials/${id}`, data, api(token)); showToast('success', 'Testimonial updated!'); return r.data.data; } catch (e) { showToast('error', 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const deleteTestimonial   = useCallback(async (id) => { setSaving(true); try { await axios.delete(`/api/admin/testimonials/${id}`, api(token)); showToast('success', 'Testimonial deleted.'); } catch (e) { showToast('error', 'Failed.'); throw e; } finally { setSaving(false); } }, [token, showToast]);
  const toggleTestimonial   = useCallback(async (id) => (await axios.patch(`/api/admin/testimonials/${id}/toggle`, {}, api(token))).data.data, [token]);
  const reorderTestimonials = useCallback(async (order) => (await axios.post('/api/admin/testimonials/reorder', { order }, api(token))).data.data, [token]);

  // ─── Messages ─────────────────────────────────────────────────────────────────
  const loadMessages = useCallback(async (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const res = await axios.get(`/api/admin/contacts?${qs}`, api(token));
    setUnreadCount(res.data.unread || 0);
    return res.data;
  }, [token]);

  const markMessageRead = useCallback(async (id) => {
    const res = await axios.patch(`/api/admin/contacts/${id}/read`, {}, api(token));
    setUnreadCount((c) => Math.max(0, c - 1));
    return res.data.data;
  }, [token]);

  const markAllMessagesRead = useCallback(async () => {
    await axios.patch('/api/admin/contacts/mark-all-read', {}, api(token));
    setUnreadCount(0);
  }, [token]);

  const deleteMessage = useCallback(async (id) => {
    await axios.delete(`/api/admin/contacts/${id}`, api(token));
    showToast('success', 'Message deleted.');
  }, [token, showToast]);

  return (
    <AdminContext.Provider value={{
      // Auth
      token, login, logout, changePassword, isSessionExpired,
      // Brands
      loadBrands, createBrand, updateBrand, deleteBrand, toggleBrand, reorderBrands,
      // Factory
      loadFactory, saveFactory,
      // Homepage
      content, loadContent, saveSection,
      // Image
      uploadImage,
      // Settings
      loadSettings, saveSettings,
      // Products
      loadProducts, createProduct, updateProduct, deleteProduct, toggleProduct, reorderProducts,
      // Testimonials
      loadTestimonials, createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonial, reorderTestimonials,
      // Messages
      loadMessages, markMessageRead, markAllMessagesRead, deleteMessage, unreadCount,
      // Dashboard
      loadDashboard,
      // UI
      saving, toast, showToast,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
