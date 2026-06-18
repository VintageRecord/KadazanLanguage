import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import {
  adminGetPhrases, adminCreatePhrase, adminUpdatePhrase, adminDeletePhrase,
  adminGetCategories,
} from '../../api';
import AdminModal from '../../components/admin/AdminModal';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const DIFF_LABEL   = { beginner: 'Asas', intermediate: 'Pertengahan', advanced: 'Lanjutan' };
const DIFF_COLOR   = { beginner: 'bg-green-100 text-green-700', intermediate: 'bg-yellow-100 text-yellow-700', advanced: 'bg-red-100 text-red-700' };

const EMPTY = { english: '', malay: '', kadazan: '', romanization: '', audio_url: '', difficulty: 'beginner', notes: '', category_id: '' };

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-forest-500 uppercase tracking-wide mb-1.5 block">{label}</label>
    {children}
  </div>
);
const input = "w-full px-4 py-2.5 border border-forest-200 rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-forest-400";

export default function AdminPhrases() {
  const [phrases,    setPhrases]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [catFilter,  setCatFilter]  = useState('');
  const [diffFilter, setDiffFilter] = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY);

  const load = () => {
    setLoading(true);
    adminGetPhrases({ search: search || undefined, category: catFilter || undefined, difficulty: diffFilter || undefined })
      .then(setPhrases)
      .finally(() => setLoading(false));
  };

  useEffect(() => { adminGetCategories().then(setCategories); }, []);
  useEffect(load, [search, catFilter, diffFilter]);

  const openCreate = () => {
    setForm({ ...EMPTY, category_id: categories[0]?.id || '' });
    setEditTarget(null); setShowModal(true); setError('');
  };
  const openEdit = (p) => {
    setForm({ english: p.english, malay: p.malay || '', kadazan: p.kadazan, romanization: p.romanization || '',
              audio_url: p.audio_url || '', difficulty: p.difficulty, notes: p.notes || '', category_id: p.category_id });
    setEditTarget(p); setShowModal(true); setError('');
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editTarget) await adminUpdatePhrase(editTarget.id, form);
      else            await adminCreatePhrase(form);
      closeModal(); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Ralat berlaku.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Padam frasa "${p.english}"?`)) return;
    try { await adminDeletePhrase(p.id); load(); }
    catch { alert('Gagal memadam.'); }
  };

  return (
    <>
      <div className="bg-forest-900 py-10 px-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Frasa</h1>
          <p className="text-white/60 text-sm">{loading ? '...' : `${phrases.length} frasa`}</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Tambah Frasa
        </button>
      </div>

      <div className="p-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-glass border border-parchment mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input type="text" placeholder="Cari frasa..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-forest-400" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="border border-forest-200 rounded-xl px-4 py-2.5 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-forest-400">
            <option value="">Semua Kategori</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name_en}</option>)}
          </select>
          <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
            className="border border-forest-200 rounded-xl px-4 py-2.5 text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-forest-400">
            <option value="">Semua Tahap</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-12 bg-parchment rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-glass border border-parchment overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-forest-50 border-b border-parchment">
                <tr>
                  {['ID', 'English', 'Kadazan', 'Romanization', 'Kategori', 'Tahap', 'Tindakan'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-forest-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment">
                {phrases.map(p => (
                  <tr key={p.id} className="hover:bg-forest-50 transition-colors">
                    <td className="px-4 py-3 text-forest-400">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-forest-900 max-w-[160px] truncate">{p.english}</td>
                    <td className="px-4 py-3 text-forest-800 max-w-[160px] truncate">{p.kadazan}</td>
                    <td className="px-4 py-3 text-forest-500 italic text-xs max-w-[120px] truncate">{p.romanization}</td>
                    <td className="px-4 py-3 text-forest-500 text-xs">{p.category_name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLOR[p.difficulty]}`}>
                        {DIFF_LABEL[p.difficulty]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(p)} className="text-earth-600 hover:text-earth-800 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(p)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {phrases.length === 0 && (
              <p className="text-center text-forest-400 py-10">Tiada frasa dijumpai.</p>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <AdminModal
          title={editTarget ? 'Edit Frasa' : 'Tambah Frasa'}
          onClose={closeModal} onSubmit={handleSubmit} loading={saving}>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="English"><input className={input} value={form.english} onChange={e => setForm(f => ({ ...f, english: e.target.value }))} required /></Field>
            <Field label="Malay"><input className={input} value={form.malay} onChange={e => setForm(f => ({ ...f, malay: e.target.value }))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kadazan"><input className={input} value={form.kadazan} onChange={e => setForm(f => ({ ...f, kadazan: e.target.value }))} required /></Field>
            <Field label="Romanization"><input className={input} value={form.romanization} onChange={e => setForm(f => ({ ...f, romanization: e.target.value }))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori">
              <select className={input} value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} required>
                <option value="">Pilih kategori...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </Field>
            <Field label="Tahap">
              <select className={input} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Nota"><input className={input} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></Field>
        </AdminModal>
      )}
    </>
  );
}
