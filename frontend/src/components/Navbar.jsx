import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname }            = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/',        label: 'Utama' },
    { to: '/learn',   label: 'Belajar' },
    { to: '/quizzes', label: 'Kuiz' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-4">

      {/* ── Pill navbar ── */}
      <nav className={`w-full max-w-5xl rounded-full transition-all duration-300
        bg-forest-900/50 backdrop-blur-md border border-white/10
        ${scrolled ? 'shadow-lg shadow-black/20' : ''}`}>
        <div className="px-6 h-16 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-earth-600 rounded-full flex items-center justify-center
                            group-hover:bg-earth-500 transition-colors shadow-md">
              <BookOpen size={20} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-white font-bold text-base">Bahasa Kadazan</p>
              <p className="text-white/60 text-xs">Penampang</p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`nav-link text-sm ${pathname === l.to ? 'text-white font-semibold' : ''}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/learn" className="btn-primary text-sm py-2 px-6">
              Mula Belajar
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-1.5" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — also pill-shaped */}
      {menuOpen && (
        <div className="md:hidden mt-2 w-full max-w-5xl rounded-3xl
                        bg-forest-900/90 backdrop-blur-md border border-white/10
                        px-6 py-4 flex flex-col gap-2">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="nav-link py-2.5 border-b border-white/10 text-sm">
              {l.label}
            </Link>
          ))}
          <Link to="/learn" onClick={() => setMenuOpen(false)}
            className="btn-primary mt-2 justify-center text-sm">
            Mula Belajar
          </Link>
        </div>
      )}
    </div>
  );
}
