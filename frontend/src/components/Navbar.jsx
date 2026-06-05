import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { pathname }              = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = !transparent || scrolled;

  const links = [
    { to: '/',        label: 'Utama' },
    { to: '/learn',   label: 'Belajar' },
    { to: '/quizzes', label: 'Kuiz' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${solid ? 'bg-forest-900/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-earth-600 rounded-lg flex items-center justify-center
                          group-hover:bg-earth-500 transition-colors">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-white font-bold text-sm">Bahasa Kadazan</p>
            <p className="text-white/60 text-xs">Penampang</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav-link text-sm ${pathname === l.to ? 'text-white font-semibold' : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/learn" className="btn-primary text-sm py-2 px-5">
            Mula Belajar
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-forest-900/98 px-6 pb-5 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
              className="nav-link py-2 border-b border-white/10 text-sm">
              {l.label}
            </Link>
          ))}
          <Link to="/learn" onClick={() => setMenuOpen(false)} className="btn-primary mt-2 justify-center text-sm">
            Mula Belajar
          </Link>
        </div>
      )}
    </nav>
  );
}
