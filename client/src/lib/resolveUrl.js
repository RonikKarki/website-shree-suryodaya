// In production, VITE_API_URL points to the Render backend.
// Uploaded images are served from there, not from Vercel.
const API = import.meta.env.VITE_API_URL || '';

export default function resolveUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;          // already absolute
  if (path.startsWith('/uploads/') && API) return `${API}${path}`;
  return path;
}
