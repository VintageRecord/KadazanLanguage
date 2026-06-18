import { X } from 'lucide-react';

export default function AdminModal({ title, onClose, onSubmit, loading, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-parchment">
          <h2 className="font-semibold text-forest-900 text-lg">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-forest-100 flex items-center justify-center text-forest-500">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="px-6 py-5 space-y-4">
            {children}
          </div>
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-parchment">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm text-forest-600 hover:text-forest-800 border border-forest-200
                         rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
