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
  // Greetings
  { id:1,  english:'Good morning',           malay:'Selamat pagi',          kadazan:'Kopivosian',          romanization:'Ko-pi-vo-si-an',      difficulty:'beginner',     category_name:'Greetings & Courtesy' },
  { id:2,  english:'Good evening/night',     malay:'Selamat malam',         kadazan:'Kopivuhan',           romanization:'Ko-pi-vu-han',        difficulty:'beginner',     category_name:'Greetings & Courtesy' },
  { id:3,  english:'Thank you',              malay:'Terima kasih',          kadazan:'Kopio',               romanization:'Ko-pi-o',             difficulty:'beginner',     category_name:'Greetings & Courtesy' },
  { id:4,  english:'How are you?',           malay:'Apa khabar?',           kadazan:'Mongihai kuh dika?',  romanization:'Mon-gi-hai ku di-ka', difficulty:'beginner',     category_name:'Greetings & Courtesy' },
  { id:5,  english:'I am fine',              malay:'Saya sihat',            kadazan:'Osonong ku',          romanization:'O-so-nong ku',        difficulty:'beginner',     category_name:'Greetings & Courtesy' },
  { id:6,  english:'Sorry / Excuse me',      malay:'Maaf',                  kadazan:'Korikot',             romanization:'Ko-ri-kot',           difficulty:'beginner',     category_name:'Greetings & Courtesy' },
  { id:7,  english:'Congratulations',        malay:'Tahniah',               kadazan:'Kinorohingan',        romanization:'Ki-no-ro-hing-an',    difficulty:'intermediate', category_name:'Greetings & Courtesy' },
  { id:8,  english:'See you again',          malay:'Jumpa lagi',            kadazan:'Kotunud doid',        romanization:'Ko-tu-nud doid',      difficulty:'intermediate', category_name:'Greetings & Courtesy' },
  { id:9,  english:'Happy birthday',         malay:'Selamat hari jadi',     kadazan:'Kopivosian tadau nopo',romanization:'Ko-pi-vo-si-an ta-dau no-po',difficulty:'intermediate',category_name:'Greetings & Courtesy' },
  // Numbers
  { id:10, english:'One',    malay:'Satu',    kadazan:'Iso',   romanization:'I-so',   difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:11, english:'Two',    malay:'Dua',     kadazan:'Duvo',  romanization:'Du-vo',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:12, english:'Three',  malay:'Tiga',    kadazan:'Tolu',  romanization:'To-lu',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:13, english:'Four',   malay:'Empat',   kadazan:'Apat',  romanization:'A-pat',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:14, english:'Five',   malay:'Lima',    kadazan:'Limo',  romanization:'Li-mo',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:15, english:'Six',    malay:'Enam',    kadazan:'Onom',  romanization:'O-nom',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:16, english:'Seven',  malay:'Tujuh',   kadazan:'Pitu',  romanization:'Pi-tu',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:17, english:'Eight',  malay:'Lapan',   kadazan:'Walu',  romanization:'Wa-lu',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:18, english:'Nine',   malay:'Sembilan',kadazan:'Siam',  romanization:'Si-am',  difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:19, english:'Ten',    malay:'Sepuluh', kadazan:'Hopod', romanization:'Ho-pod', difficulty:'beginner', category_name:'Numbers & Counting' },
  { id:20, english:'Twenty', malay:'Dua puluh',kadazan:'Duvo hopod',romanization:'Du-vo ho-pod',difficulty:'intermediate',category_name:'Numbers & Counting' },
  // Family
  { id:21, english:'Mother',         malay:'Ibu',          kadazan:'Tina',      romanization:'Ti-na',       difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:22, english:'Father',         malay:'Bapa',         kadazan:'Tama',      romanization:'Ta-ma',       difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:23, english:'Older brother',  malay:'Abang',        kadazan:'Odu',       romanization:'O-du',        difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:24, english:'Older sister',   malay:'Kakak',        kadazan:'Adi',       romanization:'A-di',        difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:25, english:'Younger sibling',malay:'Adik',         kadazan:'Andi',      romanization:'An-di',       difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:26, english:'Grandfather',    malay:'Datuk',        kadazan:'Apu Laaki', romanization:'A-pu Laa-ki', difficulty:'intermediate', category_name:'Family & Relationships' },
  { id:27, english:'Grandmother',    malay:'Nenek',        kadazan:'Apu Vavine',romanization:'A-pu Va-vi-ne',difficulty:'intermediate',category_name:'Family & Relationships' },
  { id:28, english:'Uncle',          malay:'Bapa saudara', kadazan:'Mama',      romanization:'Ma-ma',       difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:29, english:'Aunt',           malay:'Ibu saudara',  kadazan:'Inaon',     romanization:'I-na-on',     difficulty:'beginner',     category_name:'Family & Relationships' },
  { id:30, english:'Son',            malay:'Anak lelaki',  kadazan:'Anak Laaki',romanization:'A-nak Laa-ki',difficulty:'beginner',     category_name:'Family & Relationships' },
  // Food & Drink
  { id:31, english:'Rice (cooked)',  malay:'Nasi',    kadazan:'Ninom',   romanization:'Ni-nom',  difficulty:'beginner', category_name:'Food & Drink' },
  { id:32, english:'Water',          malay:'Air',     kadazan:'Wodom',   romanization:'Wo-dom',  difficulty:'beginner', category_name:'Food & Drink' },
  { id:33, english:'Fish',           malay:'Ikan',    kadazan:'Sada',    romanization:'Sa-da',   difficulty:'beginner', category_name:'Food & Drink' },
  { id:34, english:'Chicken',        malay:'Ayam',    kadazan:'Manuk',   romanization:'Ma-nuk',  difficulty:'beginner', category_name:'Food & Drink' },
  { id:35, english:'Salt',           malay:'Garam',   kadazan:'Gadom',   romanization:'Ga-dom',  difficulty:'beginner', category_name:'Food & Drink' },
  { id:36, english:'Sugar',          malay:'Gula',    kadazan:'Tamu',    romanization:'Ta-mu',   difficulty:'beginner', category_name:'Food & Drink' },
  { id:37, english:'Banana',         malay:'Pisang',  kadazan:'Saging',  romanization:'Sa-ging', difficulty:'beginner', category_name:'Food & Drink' },
  { id:38, english:'Delicious',      malay:'Sedap',   kadazan:'Minomis', romanization:'Mi-no-mis',difficulty:'beginner',category_name:'Food & Drink' },
  { id:39, english:'Spicy',          malay:'Pedas',   kadazan:'Mahaang', romanization:'Ma-ha-ang',difficulty:'beginner',category_name:'Food & Drink' },
  { id:40, english:'I am hungry',    malay:'Saya lapar',kadazan:'Narapi oku',romanization:'Na-ra-pi o-ku',difficulty:'intermediate',category_name:'Food & Drink' },
  // Nature
  { id:41, english:'Mountain',  malay:'Gunung',  kadazan:'Gayo',   romanization:'Ga-yo',  difficulty:'beginner', category_name:'Nature & Environment' },
  { id:42, english:'River',     malay:'Sungai',  kadazan:'Suvou',  romanization:'Su-vou', difficulty:'beginner', category_name:'Nature & Environment' },
  { id:43, english:'Tree',      malay:'Pokok',   kadazan:'Kahoy',  romanization:'Ka-hoy', difficulty:'beginner', category_name:'Nature & Environment' },
  { id:44, english:'Rain',      malay:'Hujan',   kadazan:'Uran',   romanization:'U-ran',  difficulty:'beginner', category_name:'Nature & Environment' },
  { id:45, english:'Sun',       malay:'Matahari',kadazan:'Sada',   romanization:'Sa-da',  difficulty:'beginner', category_name:'Nature & Environment' },
  { id:46, english:'Moon',      malay:'Bulan',   kadazan:'Bulan',  romanization:'Bu-lan', difficulty:'beginner', category_name:'Nature & Environment' },
  { id:47, english:'Star',      malay:'Bintang', kadazan:'Bituon', romanization:'Bi-tu-on',difficulty:'beginner',category_name:'Nature & Environment' },
  { id:48, english:'Sky',       malay:'Langit',  kadazan:'Langit', romanization:'La-ngit',difficulty:'beginner', category_name:'Nature & Environment' },
  { id:49, english:'Rainbow',   malay:'Pelangi', kadazan:'Tanahau',romanization:'Ta-na-hau',difficulty:'intermediate',category_name:'Nature & Environment' },
  // Culture
  { id:50, english:'Harvest festival',   malay:'Pesta menuai',         kadazan:'Kaamatan',  romanization:'Ka-a-ma-tan',   difficulty:'beginner',     category_name:'Culture & Tradition' },
  { id:51, english:'Traditional dance',  malay:'Tarian tradisional',   kadazan:'Sumazau',   romanization:'Su-ma-zau',     difficulty:'beginner',     category_name:'Culture & Tradition' },
  { id:52, english:'Traditional rice wine',malay:'Tapai / Tuak',       kadazan:'Lihing',    romanization:'Li-hing',       difficulty:'beginner',     category_name:'Culture & Tradition' },
  { id:53, english:'Ceremonial elder',   malay:'Pembesar adat',        kadazan:'Bobolian',  romanization:'Bo-bo-li-an',   difficulty:'intermediate', category_name:'Culture & Tradition' },
  { id:54, english:'Spirit / Soul',      malay:'Semangat / Roh',       kadazan:'Rogon',     romanization:'Ro-gon',        difficulty:'advanced',     category_name:'Culture & Tradition' },
  { id:55, english:'Unity / Together',   malay:'Bersatu',              kadazan:'Koposikou', romanization:'Ko-po-si-kou',  difficulty:'intermediate', category_name:'Culture & Tradition' },
  // Body & Health
  { id:56, english:'Head',       malay:'Kepala',   kadazan:'Ulu',      romanization:'U-lu',       difficulty:'beginner',     category_name:'Body & Health' },
  { id:57, english:'Eye',        malay:'Mata',     kadazan:'Mato',     romanization:'Ma-to',      difficulty:'beginner',     category_name:'Body & Health' },
  { id:58, english:'Ear',        malay:'Telinga',  kadazan:'Talingo',  romanization:'Ta-li-ngo',  difficulty:'beginner',     category_name:'Body & Health' },
  { id:59, english:'Nose',       malay:'Hidung',   kadazan:'Urong',    romanization:'U-rong',     difficulty:'beginner',     category_name:'Body & Health' },
  { id:60, english:'Mouth',      malay:'Mulut',    kadazan:'Baba',     romanization:'Ba-ba',      difficulty:'beginner',     category_name:'Body & Health' },
  { id:61, english:'Hand',       malay:'Tangan',   kadazan:'Tangan',   romanization:'Ta-ngan',    difficulty:'beginner',     category_name:'Body & Health' },
  { id:62, english:'Foot / Leg', malay:'Kaki',     kadazan:'Witi',     romanization:'Wi-ti',      difficulty:'beginner',     category_name:'Body & Health' },
  { id:63, english:'I am sick',  malay:'Saya sakit',kadazan:'Nohubag oku',romanization:'No-hu-bag o-ku',difficulty:'intermediate',category_name:'Body & Health' },
  { id:64, english:'I am tired', malay:'Saya penat',kadazan:'Nopizo oku',romanization:'No-pi-zo o-ku',difficulty:'intermediate',category_name:'Body & Health' },
  // Colours
  { id:65, english:'Red',    malay:'Merah',  kadazan:'Moiog',     romanization:'Mo-iog',     difficulty:'beginner', category_name:'Colours' },
  { id:66, english:'Blue',   malay:'Biru',   kadazan:'Moihing',   romanization:'Mo-i-hing',  difficulty:'beginner', category_name:'Colours' },
  { id:67, english:'Green',  malay:'Hijau',  kadazan:'Moirup',    romanization:'Mo-i-rup',   difficulty:'beginner', category_name:'Colours' },
  { id:68, english:'Yellow', malay:'Kuning', kadazan:'Moiringan', romanization:'Mo-i-ri-ngan',difficulty:'beginner',category_name:'Colours' },
  { id:69, english:'White',  malay:'Putih',  kadazan:'Moputih',   romanization:'Mo-pu-tih',  difficulty:'beginner', category_name:'Colours' },
  { id:70, english:'Black',  malay:'Hitam',  kadazan:'Mohitom',   romanization:'Mo-hi-tom',  difficulty:'beginner', category_name:'Colours' },
  { id:71, english:'Brown',  malay:'Coklat', kadazan:'Moiritong', romanization:'Mo-i-ri-tong',difficulty:'beginner',category_name:'Colours' },
  { id:72, english:'Orange', malay:'Oren',   kadazan:'Moransi',   romanization:'Mo-ran-si',  difficulty:'beginner', category_name:'Colours' },
  // Time & Days
  { id:73, english:'Today',     malay:'Hari ini',   kadazan:'Tadau toi',    romanization:'Ta-dau toi',     difficulty:'beginner', category_name:'Time & Days' },
  { id:74, english:'Tomorrow',  malay:'Esok',       kadazan:'Tadau amu',    romanization:'Ta-dau a-mu',    difficulty:'beginner', category_name:'Time & Days' },
  { id:75, english:'Yesterday', malay:'Semalam',    kadazan:'Tadau nabalu', romanization:'Ta-dau na-ba-lu',difficulty:'beginner', category_name:'Time & Days' },
  { id:76, english:'Morning',   malay:'Pagi',       kadazan:'Kuvosian',     romanization:'Ku-vo-si-an',    difficulty:'beginner', category_name:'Time & Days' },
  { id:77, english:'Night',     malay:'Malam',      kadazan:'Huvuhan',      romanization:'Hu-vu-han',      difficulty:'beginner', category_name:'Time & Days' },
  { id:78, english:'Week',      malay:'Minggu',     kadazan:'Minggu',       romanization:'Ming-gu',        difficulty:'beginner', category_name:'Time & Days' },
  { id:79, english:'Month',     malay:'Bulan',      kadazan:'Bulan',        romanization:'Bu-lan',         difficulty:'beginner', category_name:'Time & Days' },
  { id:80, english:'Year',      malay:'Tahun',      kadazan:'Taun',         romanization:'Ta-un',          difficulty:'beginner', category_name:'Time & Days' },
  // Weather
  { id:81, english:'Hot',    malay:'Panas',    kadazan:'Mohinopot', romanization:'Mo-hi-no-pot', difficulty:'beginner', category_name:'Weather' },
  { id:82, english:'Cold',   malay:'Sejuk',    kadazan:'Moisohit',  romanization:'Mo-i-so-hit',  difficulty:'beginner', category_name:'Weather' },
  { id:83, english:'Rainy',  malay:'Hujan',    kadazan:'Mouran',    romanization:'Mo-u-ran',     difficulty:'beginner', category_name:'Weather' },
  { id:84, english:'Sunny',  malay:'Cerah',    kadazan:'Mosilag',   romanization:'Mo-si-lag',    difficulty:'beginner', category_name:'Weather' },
  { id:85, english:'Windy',  malay:'Berangin', kadazan:'Moriup',    romanization:'Mo-ri-up',     difficulty:'beginner', category_name:'Weather' },
  { id:86, english:'Cloudy', malay:'Berawan',  kadazan:'Mogubang',  romanization:'Mo-gu-bang',   difficulty:'beginner', category_name:'Weather' },
  { id:87, english:'Storm',  malay:'Ribut',    kadazan:'Ribut',     romanization:'Ri-but',       difficulty:'intermediate',category_name:'Weather' },
  // Feelings & Emotions
  { id:88, english:'Happy',    malay:'Gembira',  kadazan:'Mogisuang', romanization:'Mo-gi-su-ang', difficulty:'beginner',     category_name:'Feelings & Emotions' },
  { id:89, english:'Sad',      malay:'Sedih',    kadazan:'Moisorob',  romanization:'Mo-i-so-rob',  difficulty:'beginner',     category_name:'Feelings & Emotions' },
  { id:90, english:'Angry',    malay:'Marah',    kadazan:'Mogihab',   romanization:'Mo-gi-hab',    difficulty:'beginner',     category_name:'Feelings & Emotions' },
  { id:91, english:'Scared',   malay:'Takut',    kadazan:'Mongoingon',romanization:'Mo-ngoi-ngon', difficulty:'beginner',     category_name:'Feelings & Emotions' },
  { id:92, english:'Proud',    malay:'Bangga',   kadazan:'Mokuung',   romanization:'Mo-ku-ung',    difficulty:'intermediate', category_name:'Feelings & Emotions' },
  { id:93, english:'I love you',malay:'Saya sayang kamu',kadazan:'Koubasanan toko dika',romanization:'Kou-ba-sa-nan to-ko di-ka',difficulty:'advanced',category_name:'Feelings & Emotions' },
  // Transport
  { id:94, english:'Car',    malay:'Kereta',  kadazan:'Kereta',  romanization:'Ke-re-ta',  difficulty:'beginner', category_name:'Transport & Travel' },
  { id:95, english:'Boat',   malay:'Bot',     kadazan:'Parao',   romanization:'Pa-ra-o',   difficulty:'beginner', category_name:'Transport & Travel' },
  { id:96, english:'Walk',   malay:'Berjalan',kadazan:'Monong',  romanization:'Mo-nong',   difficulty:'beginner', category_name:'Transport & Travel' },
  { id:97, english:'Left',   malay:'Kiri',    kadazan:'Kawang',  romanization:'Ka-wang',   difficulty:'beginner', category_name:'Transport & Travel' },
  { id:98, english:'Right',  malay:'Kanan',   kadazan:'Komoyon', romanization:'Ko-mo-yon', difficulty:'beginner', category_name:'Transport & Travel' },
  { id:99, english:'Far',    malay:'Jauh',    kadazan:'Monowog', romanization:'Mo-no-wog', difficulty:'beginner', category_name:'Transport & Travel' },
  { id:100,english:'Near',   malay:'Dekat',   kadazan:'Mononou', romanization:'Mo-no-nou', difficulty:'beginner', category_name:'Transport & Travel' },
  { id:101,english:'Stop',   malay:'Berhenti',kadazan:'Montok',  romanization:'Mon-tok',   difficulty:'beginner', category_name:'Transport & Travel' },
  // School & Learning
  { id:102,english:'School',   malay:'Sekolah', kadazan:'Sikul',    romanization:'Si-kul',    difficulty:'beginner', category_name:'School & Learning' },
  { id:103,english:'Teacher',  malay:'Guru',    kadazan:'Guru',     romanization:'Gu-ru',     difficulty:'beginner', category_name:'School & Learning' },
  { id:104,english:'Book',     malay:'Buku',    kadazan:'Buku',     romanization:'Bu-ku',     difficulty:'beginner', category_name:'School & Learning' },
  { id:105,english:'Read',     malay:'Baca',    kadazan:'Moginum',  romanization:'Mo-gi-num', difficulty:'beginner', category_name:'School & Learning' },
  { id:106,english:'Write',    malay:'Tulis',   kadazan:'Monsulat', romanization:'Mon-su-lat',difficulty:'beginner', category_name:'School & Learning' },
  { id:107,english:'Study',    malay:'Belajar', kadazan:'Monginum', romanization:'Mo-ngi-num',difficulty:'beginner', category_name:'School & Learning' },
  // Market & Shopping
  { id:108,english:'Market',        malay:'Pasar',    kadazan:'Tamu',       romanization:'Ta-mu',       difficulty:'beginner', category_name:'Market & Shopping' },
  { id:109,english:'Buy',           malay:'Beli',     kadazan:'Mongoli',    romanization:'Mo-ngo-li',   difficulty:'beginner', category_name:'Market & Shopping' },
  { id:110,english:'Expensive',     malay:'Mahal',    kadazan:'Mohaat',     romanization:'Mo-ha-at',    difficulty:'beginner', category_name:'Market & Shopping' },
  { id:111,english:'Cheap',         malay:'Murah',    kadazan:'Mohinuang',  romanization:'Mo-hi-nu-ang',difficulty:'beginner', category_name:'Market & Shopping' },
  { id:112,english:'Money',         malay:'Wang',     kadazan:'Siling',     romanization:'Si-ling',     difficulty:'beginner', category_name:'Market & Shopping' },
  { id:113,english:'How much?',     malay:'Berapa?',  kadazan:'Piga?',      romanization:'Pi-ga',       difficulty:'beginner', category_name:'Market & Shopping' },
  { id:114,english:'Discount',      malay:'Diskaun',  kadazan:'Kaluasan',   romanization:'Ka-lu-a-san', difficulty:'intermediate',category_name:'Market & Shopping' },
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
    <main className="min-h-screen bg-cream pt-24">
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
