import { useRef, useState } from 'react';
import { FaUpload, FaTrash, FaLink } from 'react-icons/fa';
import { useAdmin } from '../../context/AdminContext';
import resolveUrl from '../../lib/resolveUrl';

export default function ImageUpload({ value, onChange, label = 'Image', height = 'h-40' }) {
  const { uploadImage } = useAdmin();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      onChange(url);
      setUrlInput(url);
    } catch {
      setError('Upload failed. Check file size (max 5 MB) and type.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlSave = () => {
    onChange(urlInput);
    setUrlMode(false);
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div>
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}

      <div className={`relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden ${height} bg-gray-50 flex items-center justify-center`}>
        {value ? (
          <>
            <img src={resolveUrl(value)} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="bg-white text-gray-700 rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1 hover:bg-gray-100"
              >
                <FaUpload className="text-xs" /> Replace
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white rounded-lg px-3 py-2 text-xs font-medium flex items-center gap-1 hover:bg-red-600"
              >
                <FaTrash className="text-xs" /> Remove
              </button>
            </div>
          </>
        ) : (
          <div className="text-center px-4">
            {uploading ? (
              <>
                <div className="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Uploading...</p>
              </>
            ) : (
              <>
                <FaUpload className="text-gray-300 text-3xl mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No image selected</p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="bg-forest-700 text-white rounded-lg px-3 py-2 text-xs font-medium hover:bg-forest-800 flex items-center gap-1"
                  >
                    <FaUpload className="text-xs" /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrlMode((m) => !m)}
                    className="bg-gray-200 text-gray-700 rounded-lg px-3 py-2 text-xs font-medium hover:bg-gray-300 flex items-center gap-1"
                  >
                    <FaLink className="text-xs" /> Paste URL
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL input mode */}
      {urlMode && !value && (
        <div className="mt-2 flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <button
            type="button"
            onClick={handleUrlSave}
            className="bg-forest-700 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-forest-800"
          >
            Use URL
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
