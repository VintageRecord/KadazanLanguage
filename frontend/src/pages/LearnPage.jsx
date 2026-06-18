import { useState, useEffect } from 'react';
import { getCategories, getPhrases } from '../api';
import PhraseCard from '../components/PhraseCard';
import { Search, Filter, AlertCircle } from 'lucide-react';

const DIFFICULTIES = [
  { value: '',             label: 'Semua Tahap' },
  { value: 'beginner',     label: 'Asas' },
  { value: 'intermediate', label: 'Pertengahan' },
  { value: 'advanced',     label: 'Lanjutan' },
];

export default function LearnPage() {
  const [categories, setCategories] = useState([]);
  const [phrases,    setPhrases]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPhrases({ category: category || undefined, difficulty: difficulty || undefined, limit: 200 })
      .then(res => setPhrases(res.data))
      .catch(() => setError('Tidak dapat menyambung ke pelayan. Pastikan backend berjalan.'))
      .finally(() => setLoading(false));
  }, [category, difficulty]);

  const filtered = phrases.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.english.toLowerCase().includes(q) ||
           p.malay.toLowerCase().includes(q) ||
           p.kadazan.toLowerCase().includes(q);
  });

  return (
    <main className="min-h-screen bg-cream pt-24">
      <div className="bg-forest-900 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Frasa Harian</h1>
          <p className="text-white/60">Pelajari frasa-frasa asas dalam bahasa Kadazan Penampang</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-glass border border-parchment mb-8
                        flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text" placeholder="Cari frasa..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-forest-400 bg-cream" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border border-forest-200 rounded-xl px-4 py-2.5 text-sm bg-cream
                       focus:outline-none focus:ring-2 focus:ring-forest-400 min-w-[180px]">
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name_en}</option>
            ))}
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="border border-forest-200 rounded-xl px-4 py-2.5 text-sm bg-cream
                       focus:outline-none focus:ring-2 focus:ring-forest-400 min-w-[150px]">
            {DIFFICULTIES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700
                          rounded-2xl px-5 py-4 mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results count */}
        {!error && (
          <p className="text-forest-500 text-sm mb-5 flex items-center gap-1.5">
            <Filter size={14} />
            {loading ? 'Memuatkan...' : `${filtered.length} frasa dijumpai`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-parchment" />
            ))}
          </div>
        ) : !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => <PhraseCard key={p.id} phrase={p} />)}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-forest-400 text-lg">Tiada frasa dijumpai.</p>
            <button onClick={() => { setSearch(''); setCategory(''); setDifficulty(''); }}
              className="mt-4 text-earth-600 hover:underline text-sm">
              Padam semua penapis
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
