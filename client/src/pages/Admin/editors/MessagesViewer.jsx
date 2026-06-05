import { useState, useEffect, useCallback } from 'react';
import {
  FaEnvelope, FaEnvelopeOpen, FaTrash, FaCheckDouble,
  FaChevronLeft, FaChevronRight, FaFilter, FaPhone, FaUser,
} from 'react-icons/fa';
import { useAdmin } from '../../../context/AdminContext';

function MessageDetail({ msg, onClose, onRead, onDelete }) {
  const date = new Date(msg.createdAt).toLocaleString('en-NP', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-forest-800">Message Detail</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 p-6 space-y-5">
          {/* Sender info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-800">
              <FaUser className="text-gray-400 text-sm" />
              <span className="font-semibold">{msg.name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <FaEnvelope className="text-gray-400 text-sm" />
              <a href={`mailto:${msg.email}`} className="hover:text-forest-600 transition">{msg.email}</a>
            </div>
            {msg.phone && (
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <FaPhone className="text-gray-400 text-sm" />
                <a href={`tel:${msg.phone}`} className="hover:text-forest-600 transition">{msg.phone}</a>
              </div>
            )}
            {msg.subject && (
              <p className="text-sm text-gray-500 pt-1 border-t border-gray-200">
                <span className="font-medium">Subject:</span> {msg.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <p className="text-xs text-gray-400 mb-2">{date}</p>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 sticky bottom-0 bg-white flex gap-3">
          {!msg.isRead && (
            <button
              onClick={() => { onRead(msg._id); onClose(); }}
              className="flex-1 bg-forest-700 text-white px-4 py-2.5 rounded-xl hover:bg-forest-600 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <FaEnvelopeOpen /> Mark as Read
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Delete this message?')) { onDelete(msg._id); onClose(); }
            }}
            className="flex-1 bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2.5 rounded-xl transition text-sm font-medium flex items-center justify-center gap-2 border border-red-100"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MessagesViewer() {
  const { loadMessages, markMessageRead, markAllMessagesRead, deleteMessage } = useAdmin();
  const [data, setData]         = useState({ data: [], total: 0, unread: 0 });
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const limit = 20;

  const reload = useCallback(() => {
    setLoading(true);
    const params = { page, limit };
    if (unreadOnly) params.unread = 'true';
    loadMessages(params).then(setData).finally(() => setLoading(false));
  }, [page, unreadOnly]);

  useEffect(() => { reload(); }, [reload]);

  const handleRead = async (id) => {
    await markMessageRead(id);
    setData((d) => ({
      ...d,
      unread: Math.max(0, d.unread - 1),
      data: d.data.map((m) => m._id === id ? { ...m, isRead: true } : m),
    }));
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
    setData((d) => ({
      ...d,
      total: d.total - 1,
      data: d.data.filter((m) => m._id !== id),
    }));
  };

  const handleMarkAll = async () => {
    await markAllMessagesRead();
    setData((d) => ({
      ...d,
      unread: 0,
      data: d.data.map((m) => ({ ...m, isRead: true })),
    }));
  };

  const totalPages = Math.ceil(data.total / limit);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      {selected && (
        <MessageDetail
          msg={selected}
          onClose={() => setSelected(null)}
          onRead={handleRead}
          onDelete={handleDelete}
        />
      )}

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setUnreadOnly((v) => !v); setPage(1); }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition ${unreadOnly ? 'bg-forest-700 text-white border-forest-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              <FaFilter className="text-xs" />
              {unreadOnly ? 'All messages' : 'Unread only'}
            </button>
            {data.unread > 0 && (
              <span className="text-sm text-red-500 font-medium">{data.unread} unread</span>
            )}
          </div>
          {data.unread > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm text-forest-600 hover:bg-forest-50 border border-forest-200 font-medium transition"
            >
              <FaCheckDouble /> Mark all read
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-10 h-10 border-2 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : data.data.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
            <FaEnvelope className="text-4xl mx-auto mb-3 opacity-20" />
            <p>{unreadOnly ? 'No unread messages.' : 'No messages yet.'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {data.data.map((msg, i) => (
              <div
                key={msg._id}
                onClick={() => { setSelected(msg); if (!msg.isRead) handleRead(msg._id); }}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition border-b border-gray-50 last:border-b-0 ${!msg.isRead ? 'bg-forest-50' : ''}`}
              >
                <div className="flex-shrink-0 pt-0.5">
                  {msg.isRead
                    ? <FaEnvelopeOpen className="text-gray-300 text-base" />
                    : <FaEnvelope className="text-forest-500 text-base" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${msg.isRead ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                  {msg.subject && <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">{msg.subject}</p>}
                  <p className="text-sm text-gray-500 truncate mt-0.5">{msg.message}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                  className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
            >
              <FaChevronLeft />
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
