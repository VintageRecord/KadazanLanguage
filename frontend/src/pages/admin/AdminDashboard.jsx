import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { adminGetCounts } from '../../api';

export default function AdminDashboard() {
  const [counts,  setCounts]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetCounts()
      .then(setCounts)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Kategori',  key: 'categories', icon: <Tag size={22} />,      to: '/admin/categories' },
    { label: 'Frasa',     key: 'phrases',    icon: <FileText size={22} />,  to: '/admin/phrases'    },
    { label: 'Kuiz',      key: 'quizzes',    icon: <HelpCircle size={22} />, to: '/admin/quizzes'   },
  ];

  return (
    <>
      <div className="bg-forest-900 py-10 px-8">
        <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-white/60 text-sm">Selamat datang ke panel admin Kadazan Language.</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map(card => (
            <Link key={card.key} to={card.to}
              className="bg-white rounded-2xl p-6 shadow-glass border border-parchment
                         hover:shadow-card transition-all duration-200 hover:-translate-y-1 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 bg-forest-50 text-forest-600 rounded-xl flex items-center justify-center">
                  {card.icon}
                </div>
                <ChevronRight size={16} className="text-earth-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="font-display text-4xl font-bold text-forest-900 mb-1">
                {loading ? '...' : counts?.[card.key] ?? 0}
              </p>
              <p className="text-forest-500 text-sm">{card.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
