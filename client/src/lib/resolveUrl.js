const API = import.meta.env.VITE_API_URL || '';

export default function resolveUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/uploads/') && API) return `${API}${path}`;
  return path;
}
