import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-white/70 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-earth-600 rounded-lg flex items-center justify-center">
                <BookOpen size={15} className="text-white" />
              </div>
              <span className="text-white font-bold">Bahasa Kadazan</span>
            </div>
            <p className="text-sm leading-relaxed">
              Platform pembelajaran bahasa Kadazan (Penampang) untuk memelihara dan
              mempromosikan warisan budaya masyarakat peribumi Sabah.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Pautan Pantas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/"        className="hover:text-white transition-colors">Utama</Link></li>
              <li><Link to="/learn"   className="hover:text-white transition-colors">Belajar Frasa</Link></li>
              <li><Link to="/quizzes" className="hover:text-white transition-colors">Kuiz Interaktif</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Mengenai</h4>
            <p className="text-sm leading-relaxed">
              Bahasa Kadazan Penampang adalah bahasa ibunda masyarakat Kadazan di daerah
              Penampang, Sabah, Malaysia.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
          <p>© {new Date().getFullYear()} Platform Bahasa Kadazan Penampang. Hak cipta terpelihara.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart size={12} className="text-earth-400 fill-earth-400" /> untuk memelihara bahasa
          </p>
        </div>
      </div>
    </footer>
  );
}
