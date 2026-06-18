import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { adminGetQuizzes, adminCreateQuiz, adminUpdateQuiz, adminDeleteQuiz, adminGetCategories } from '../../api';
import AdminModal from '../../components/admin/AdminModal';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const DIFF_LABEL   = { beginner: 'Asas', intermediate: 'Pertengahan', advanced: 'Lanjutan' };
const DIFF_COLOR   = { beginner: 'bg-green-100 text-green-700', intermediate: 'bg-yellow-100 text-yellow-700', advanced: 'bg-red-100 text-red-700' };

const EMPTY = { title: '', description: '', difficulty: 'beginner', source: 'phrases', category_id: '', is_active: true };

const Field = ({ label, children }) => (
  <div>
    <label className="text-xs font-semibold text-forest-500 uppercase tracking-wide mb-1.5 block">{label}</label>
    {children}
  </div>
);
const input = "w-full px-4 py-2.5 border border-forest-200 rounded-xl text-sm bg-cream focus:outline-none focus:ring-2 focus:ring-forest-400";

export default function AdminQuizzes() {
  const [quizzes,    setQuizzes]    = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form,       setForm]       = useState(EMPTY);

  const load = () => {
    setLoading(true);
    adminGetQuizzes().then(setQuizzes).finally(() => setLoading(false));
  };

  useEffect(() => { adminGetCategories().then(setCategories); }, []);
  useEffect(load, []);

  const openCreate = () => { setForm(EMPTY); setEditTarget(null); setShowModal(true); setError(''); };
  const openEdit   = (q) => {
    setForm({ title: q.title, description: q.description || '', difficulty: q.difficulty,
              source: q.source, category_id: q.category_id || '', is_active: !!q.is_active });
    setEditTarget(q); setShowModal(true); setError('');
  };
  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const payload = { ...form, category_id: form.category_id || null };
      if (editTarget) await adminUpdateQuiz(editTarget.id, payload);
      else            await adminCreateQuiz(payload);
      closeModal(); load();
    } catch (err) {
      setError(err.response?.data?.error || 'Ralat berlaku.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (q) => {
    if (!window.confirm(`Padam kuiz "${q.title}"?`)) return;
    try { await adminDeleteQuiz(q.id); load(); }
    catch { alert('Gagal memadam.'); }
  };

  return (
    <>
      <div className="bg-forest-900 py-10 px-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Kuiz</h1>
          <p className="text-white/60 text-sm">{loading ? '...' : `${quizzes.length} kuiz`}</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Tambah Kuiz
        </button>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 bg-parchment rounded-xl animate-pulse" />)}</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-glass border border-parchment overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-forest-50 border-b border-parchment">
                <tr>
                  {['ID', 'Tajuk', 'Tahap', 'Kategori', 'Sumber', 'Aktif', 'Tindakan'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-forest-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-parchment">
                {quizzes.map(q => (
                  <tr key={q.id} className="hover:bg-forest-50 transition-colors">
                    <td className="px-4 py-3 text-forest-400">{q.id}</td>
                    <td className="px-4 py-3 font-medium text-forest-900 max-w-[200px] truncate">{q.title}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_COLOR[q.difficulty]}`}>
                        {DIFF_LABEL[q.difficulty]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-forest-500 text-xs">{q.category_name || '— Semua —'}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-forest-100 text-forest-700 px-2 py-0.5 rounded-lg">{q.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${q.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {q.is_active ? 'Ya' : 'Tidak'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(q)} className="text-earth-600 hover:text-earth-800 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => handleDelete(q)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quizzes.length === 0 && <p className="text-center text-forest-400 py-10">Tiada kuiz dijumpai.</p>}
          </div>
        )}
      </div>

      {showModal && (
        <AdminModal
          title={editTarget ? 'Edit Kuiz' : 'Tambah Kuiz'}
          onClose={closeModal} onSubmit={handleSubmit} loading={saving}>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <Field label="Tajuk"><input className={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></Field>
          <Field label="Deskripsi">
            <textarea className={`${input} resize-none`} rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tahap">
              <select className={input} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{DIFF_LABEL[d]}</option>)}
              </select>
            </Field>
            <Field label="Sumber">
              <select className={input} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}>
                <option value="phrases">phrases</option>
                <option value="mix">mix</option>
                <option value="manual">manual</option>
              </select>
            </Field>
          </div>
          <Field label="Kategori (kosongkan untuk semua)">
            <select className={input} value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
              <option value="">— Semua Kategori —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
              className="w-4 h-4 rounded accent-earth-600" />
            <span className="text-sm text-forest-700 font-medium">Aktifkan kuiz ini</span>
          </label>
        </AdminModal>
      )}
    </>
  );
}
