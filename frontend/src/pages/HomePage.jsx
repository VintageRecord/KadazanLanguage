import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Globe, Award, ChevronRight } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';

const FEATURES = [
  { icon: <BookOpen size={22} />, title: 'Frasa Harian', desc: 'Pelajari lebih 70 frasa asas dalam bahasa Kadazan Penampang dengan panduan sebutan.' },
  { icon: <Award    size={22} />, title: 'Kuiz Interaktif', desc: 'Uji penguasaan anda melalui kuiz padanan kata yang menyeronokkan dan mencabar.' },
  { icon: <Users    size={22} />, title: 'Budaya & Tradisi', desc: 'Kenali istilah budaya Kadazan termasuk Kaamatan, Sumazau, dan Lihing.' },
  { icon: <Globe    size={22} />, title: '8 Kategori', desc: 'Pembelajaran terstruktur merangkumi salam, nombor, keluarga, alam, dan lain-lain.' },
];

const STATS = [
  { value: '70+', label: 'Frasa Asas' },
  { value: '8',   label: 'Kategori Pelajaran' },
  { value: '8',   label: 'Kuiz Tersedia' },
  { value: '100%', label: 'Percuma' },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-forest-900">

        {/* YouTube background video */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/IozLmk2vUc0?autoplay=1&mute=1&loop=1&playlist=IozLmk2vUc0&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&playsinline=1&start=60"
            title="Sabah background"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 'max(100vw, 177.78vh)', height: 'max(56.25vw, 100vh)', border: 'none' }}
          />
        </div>

        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/70 to-forest-900/40" />

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div>
              <span className="inline-block bg-earth-600/30 border border-earth-500/40 text-earth-300
                               text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
                Platform Pembelajaran Bahasa
              </span>

              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Ketahui &amp; Pelihara<br />
                <span className="text-earth-400">Bahasa Kadazan</span>
              </h1>

              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
                Bahasa Kadazan Penampang adalah warisan budaya yang perlu dipelihara bersama.
                Mulakan perjalanan pembelajaran anda hari ini melalui frasa harian dan kuiz interaktif.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/learn" className="btn-primary text-base">
                  Mula Belajar <ArrowRight size={18} />
                </Link>
                <Link to="/quizzes" className="btn-outline text-base">
                  Maklumat Lanjut
                </Link>
              </div>

              {/* Icon row */}
              <div className="flex gap-6 mt-12">
                {[
                  { icon: <Award size={20} />, label: 'Kuiz' },
                  { icon: <Users size={20} />, label: 'Komuniti' },
                  { icon: <Globe size={20} />, label: 'Warisan' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5">
                    <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center
                                    justify-center text-white/80 border border-white/10">
                      {item.icon}
                    </div>
                    <span className="text-white/50 text-xs">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: carousel */}
            <div className="hidden lg:block">
              <HeroCarousel />
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 20C480 40 240 10 0 30Z" fill="#f9f5ee" />
          </svg>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-bold text-earth-600">{s.value}</p>
                <p className="text-forest-600 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-parchment py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest-900 mb-3">
              Cara Pembelajaran Anda
            </h2>
            <p className="text-forest-600 max-w-xl mx-auto">
              Platform kami direka untuk memudahkan pembelajaran bahasa Kadazan Penampang
              secara sistematik dan menyeronokkan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title}
                className="bg-white rounded-2xl p-6 shadow-glass border border-parchment
                           hover:shadow-card transition-all duration-200 hover:-translate-y-1">
                <div className="w-11 h-11 bg-forest-50 text-forest-600 rounded-xl flex items-center
                                justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-forest-900 mb-2">{f.title}</h3>
                <p className="text-forest-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="bg-forest-800 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Sedia untuk mulakan?
            </h2>
            <p className="text-white/70">Pelajari frasa pertama anda dalam bahasa Kadazan Penampang sekarang.</p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link to="/learn"   className="btn-primary">Frasa Harian <ChevronRight size={16} /></Link>
            <Link to="/quizzes" className="btn-outline">Cuba Kuiz</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
