import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    title: 'Keindahan Alam Sabah',
    subtitle: 'Gunung-ganang yang menakjubkan',
    gradient: 'from-forest-800/60 to-forest-600/40',
    emoji: '🏔️',
    bg: 'bg-gradient-to-br from-forest-700 to-forest-500',
  },
  {
    title: 'Pesta Kaamatan',
    subtitle: 'Perayaan menuai yang meriah',
    gradient: 'from-earth-700/60 to-earth-500/40',
    emoji: '🌾',
    bg: 'bg-gradient-to-br from-earth-700 to-earth-500',
  },
  {
    title: 'Tarian Sumazau',
    subtitle: 'Warisan budaya yang kaya',
    gradient: 'from-forest-700/60 to-earth-600/40',
    emoji: '🦅',
    bg: 'bg-gradient-to-br from-forest-600 to-earth-600',
  },
  {
    title: 'Bahasa yang Hidup',
    subtitle: 'Pelihara bersama-sama',
    gradient: 'from-earth-800/60 to-forest-600/40',
    emoji: '📖',
    bg: 'bg-gradient-to-br from-earth-800 to-forest-600',
  },
  {
    title: 'Kampung Halaman',
    subtitle: 'Akar budaya Penampang',
    gradient: 'from-forest-900/60 to-earth-700/40',
    emoji: '🏡',
    bg: 'bg-gradient-to-br from-forest-900 to-earth-600',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent(c => (c + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className={`relative rounded-3xl overflow-hidden shadow-card ${slide.bg} w-full aspect-[4/3]
                     transition-colors duration-700`}>
      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="text-6xl mb-3 drop-shadow">{slide.emoji}</div>
        <h3 className="text-white font-bold text-xl leading-tight drop-shadow">{slide.title}</h3>
        <p className="text-white/80 text-sm mt-1">{slide.subtitle}</p>
      </div>

      {/* Chevrons */}
      <button onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                   bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center
                   text-white transition-colors">
        <ChevronLeft size={16} />
      </button>
      <button onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
                   bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center
                   text-white transition-colors">
        <ChevronRight size={16} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`} />
        ))}
      </div>
    </div>
  );
}
