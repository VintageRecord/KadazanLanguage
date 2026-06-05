import { useState, useEffect } from 'react';
import { getCategories, getPhrases } from '../api';
import PhraseCard from '../components/PhraseCard';
import { Search, Filter } from 'lucide-react';

const DIFFICULTIES = [
  { value: '',             label: 'Semua Tahap' },
  { value: 'beginner',     label: 'Asas' },
  { value: 'intermediate', label: 'Pertengahan' },
  { value: 'advanced',     label: 'Lanjutan' },
];

const MOCK_PHRASES = [
  { id:1, english:'Good morning', malay:'Selamat pagi', kadazan:'Kopivosian', romanization:'Ko-pi-vo-si-an', difficulty:'beginner', category_name:'Greetings & Courtesy' },
  { id:2, english:'Good evening / Good night', malay:'Selamat malam', kadazan:'Kopivuhan', romanization:'Ko-pi-vu-han', difficulty:'beginner', category_name:'Greetings & Courtesy' },
  { id:3, english:'Thank you', malay:'Terima kasih', kadazan:'Kopio', romanization:'Ko-pi-o', difficulty:'beginner', category_name:'Greetings & Courtesy' },
  { id:4, english:'How are you?', malay:'Apa khabar?', kadazan:'Mongihai kuh dika?', romanization:'Mon-gi-hai ku di-ka', difficulty:'beginner', category_name:'Greetings & Courtesy' },
  { id:5, english:'One', malay:'Satu', kadazan:'Iso', romanization:'I-so', difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:6, english:'Two', malay:'Dua', kadazan:'Duvo', romanization:'Du-vo', difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:7, english:'Three', malay:'Tiga', kadazan:'Tolu', romanization:'To-lu', difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:8, english:'Mother', malay:'Ibu', kadazan:'Tina', romanization:'Ti-na', difficulty:'beginner', category_name:'Family & Relationships' },
  { id:9, english:'Father', malay:'Bapa', kadazan:'Tama', romanization:'Ta-ma', difficulty:'beginner', category_name:'Family & Relationships' },
  { id:10, english:'House / Home', malay:'Rumah', kadazan:'Hamin', romanization:'Ha-min', difficulty:'beginner', category_name:'Daily Life' },
  { id:11, english:'Water', malay:'Air', kadazan:'Wodom', romanization:'Wo-dom', difficulty:'beginner', category_name:'Food & Drink' },
  { id:12, english:'Rice (cooked)', malay:'Nasi', kadazan:'Ninom', romanization:'Ni-nom', difficulty:'beginner', category_name:'Food & Drink' },
  { id:13, english:'Mountain', malay:'Gunung', kadazan:'Gayo', romanization:'Ga-yo', difficulty:'beginner', category_name:'Nature & Environment' },
  { id:14, english:'Harvest festival', malay:'Pesta menuai', kadazan:'Kaamatan', romanization:'Ka-a-ma-tan', difficulty:'beginner', category_name:'Culture & Tradition' },
  { id:15, english:'Traditional dance', malay:'Tarian tradisional', kadazan:'Sumazau', romanization:'Su-ma-zau', difficulty:'beginner', category_name:'Culture & Tradition' },
  { id:16, english:'Grandfather', malay:'Datuk', kadazan:'Apu Laaki', romanization:'A-pu Laa-ki', difficulty:'intermediate', category_name:'Family & Relationships' },
  { id:17, english:'I am hungry', malay:'Saya lapar', kadazan:'Narapi oku', romanization:'Na-ra-pi o-ku', difficulty:'intermediate', category_name:'Food & Drink' },
  { id:18, english:'Ceremonial elder', malay:'Pembesar adat', kadazan:'Bobolian', romanization:'Bo-bo-li-an', difficulty:'intermediate', category_name:'Culture & Tradition' },
  { id:19, english:'Spirit / Soul', malay:'Semangat / Roh', kadazan:'Rogon', romanization:'Ro-gon', difficulty:'advanced', category_name:'Culture & Tradition' },
  { id:20, english:'Please repeat', malay:'Tolong ulang', kadazan:'Agarai poh', romanization:'A-ga-rai poh', difficulty:'advanced', category_name:'Daily Life' },
];

export default function LearnPage() {
  const [categories, setCategories] = useState([]);
  const [phrases,    setPhrases]    = useState([]);
  const [loading,    setLoading]    = useState(true);
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
    getPhrases({ category: category || undefined, difficulty: difficulty || undefined, limit: 100 })
      .then(res => setPhrases(res.data))
      .catch(() => setPhrases(MOCK_PHRASES))
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
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
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
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
            <input
              type="text" placeholder="Cari frasa..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-forest-400 bg-cream" />
          </div>

          {/* Category filter */}
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="border border-forest-200 rounded-xl px-4 py-2.5 text-sm bg-cream
                       focus:outline-none focus:ring-2 focus:ring-forest-400 min-w-[180px]">
            <option value="">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name_en}</option>
            ))}
          </select>

          {/* Difficulty filter */}
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="border border-forest-200 rounded-xl px-4 py-2.5 text-sm bg-cream
                       focus:outline-none focus:ring-2 focus:ring-forest-400 min-w-[150px]">
            {DIFFICULTIES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <p className="text-forest-500 text-sm mb-5 flex items-center gap-1.5">
          <Filter size={14} />
          {loading ? 'Memuatkan...' : `${filtered.length} frasa dijumpai`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-parchment" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => <PhraseCard key={p.id} phrase={p} />)}
          </div>
        )}

        {!loading && filtered.length === 0 && (
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
