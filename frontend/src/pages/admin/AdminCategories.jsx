import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { adminGetCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from '../../api';
import AdminModal from '../../components/admin/AdminModal';

const EMPTY = { slug: '', name_en: '', name_ms: '', description: '', icon: '', sort_order: 0 };

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-forest-500 uppercase tracking-wide mb-1.5 block">{label}</label>
    {children}
  </div>
);

const input = "w-full px-4 py-2.5 border border-forest-200 rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-forest-400";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY);

  const load = () => {
    setLoading(true);
    adminGetCategories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setShowModal(true); setError(''); };
  const openEdit   = (c) => { setForm({ ...c }); setEditTarget(c); setShowModal(true); setError(''); };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editTarget) await adminUpdateCategory(editTarget.id, form);
      else            await adminCreateCategory(form);
      closeModal();
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Ralat berlaku.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Padam kategori "${c.name_en}"?`)) return;
    try {
      await adminDeleteCategory(c.id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memadam.');
    }
  };

  return (
    <>
      <div className="bg-forest-900 py-10 px-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Kategori</h1>
          <p className="text-white/60 text-sm">Urus semua kategori frasa.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-parchment rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-glass border border-parchment overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-forest-50 border-b border-parchment">
                <tr>
                  {['ID', 'Slug', 'English', 'Malay', 'Icon', 'Sort', 'Tindakan'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-forest-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment">
                {categories.map(c => (
                  <tr key={c.id} className="hover:bg-forest-50 transition-colors">
                    <td className="px-4 py-3 text-forest-400">{c.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-forest-700">{c.slug}</td>
                    <td className="px-4 py-3 font-medium text-forest-900">{c.name_en}</td>
                    <td className="px-4 py-3 text-forest-600">{c.name_ms}</td>
                    <td className="px-4 py-3 text-xl">{c.icon}</td>
                    <td className="px-4 py-3 text-forest-500">{c.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(c)}
                          className="text-earth-600 hover:text-earth-800 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(c)}
                          className="text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AdminModal
          title={editTarget ? 'Edit Kategori' : 'Tambah Kategori'}
          onClose={closeModal}
          onSubmit={handleSubmit}
          loading={saving}>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <Field label="Slug"><input className={input} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required /></Field>
          <Field label="Nama (English)"><input className={input} value={form.name_en} onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))} required /></Field>
          <Field label="Nama (Malay)"><input className={input} value={form.name_ms || ''} onChange={e => setForm(f => ({ ...f, name_ms: e.target.value }))} /></Field>
          <Field label="Deskripsi"><input className={input} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Icon (emoji)"><input className={input} value={form.icon || ''} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} /></Field>
            <Field label="Sort Order"><input type="number" className={input} value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /></Field>
          </div>
        </AdminModal>
      )}
    </>
  );
}
