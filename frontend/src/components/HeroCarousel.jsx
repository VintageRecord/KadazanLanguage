import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const SLIDES = [
  {
    title: 'Keindahan Alam Sabah',
    subtitle: 'Gunung-ganang yang menakjubkan',
    img: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80',
  },
  {
    title: 'Sawah Padi Sabah',
    subtitle: 'Kesuburan bumi Kadazan',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
  },
  {
    title: 'Hutan Tropika Borneo',
    subtitle: 'Alam semula jadi yang kaya',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
  {
    title: 'Pesta Kaamatan',
    subtitle: 'Perayaan menuai yang meriah',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    title: 'Kampung Halaman',
    subtitle: 'Akar budaya Penampang',
    img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent]   = useState(0);
  const [paused,  setPaused]    = useState(false);
  const [loaded,  setLoaded]    = useState({});
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % SLIDES.length);
    }, 4500);
  };

  useEffect(() => {
    if (!paused) startTimer();
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const go = (idx) => {
    setCurrent(idx);
    if (!paused) startTimer(); // reset timer on manual nav
  };
  const prev = () => go((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => go((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card w-full aspect-[4/3] bg-forest-900 group">

      {/* Preload all images; show current */}
      {SLIDES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt={s.title}
          onLoad={() => setLoaded(l => ({ ...l, [i]: true }))}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
                      ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Loading shimmer */}
      {!loaded[current] && (
        <div className="absolute inset-0 bg-forest-800 animate-pulse" />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-white font-bold text-xl leading-tight drop-shadow">
          {slide.title}
        </h3>
        <p className="text-white/75 text-sm mt-1">{slide.subtitle}</p>
      </div>

      {/* Chevrons — visible on hover */}
      <button onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                   bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center
                   text-white transition-all opacity-0 group-hover:opacity-100">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                   bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center
                   text-white transition-all opacity-0 group-hover:opacity-100">
        <ChevronRight size={18} />
      </button>

      {/* Play / pause */}
      <button onClick={() => setPaused(p => !p)}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50
                   backdrop-blur-sm flex items-center justify-center text-white/80
                   opacity-0 group-hover:opacity-100 transition-all">
        {paused ? <Play size={13} fill="white" /> : <Pause size={13} fill="white" />}
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 right-5 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>
    </div>
  );
}
