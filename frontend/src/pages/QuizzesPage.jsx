import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../api';
import { ChevronRight, BookOpen, AlertCircle } from 'lucide-react';

const DIFF_COLOR = {
  beginner:     'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced:     'bg-red-100 text-red-700',
};
const DIFF_LABEL = {
  beginner:     'Asas',
  intermediate: 'Pertengahan',
  advanced:     'Lanjutan',
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getQuizzes()
      .then(setQuizzes)
      .catch(() => setError('Tidak dapat menyambung ke pelayan. Pastikan backend berjalan.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-cream pt-24">
      <div className="bg-forest-900 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Kuiz Interaktif</h1>
          <p className="text-white/60">Uji penguasaan bahasa Kadazan anda melalui kuiz padanan kata</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700
                          rounded-2xl px-5 py-4 mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-parchment" />
            ))}
          </div>
        ) : !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(q => (
              <Link key={q.id} to={`/quizzes/${q.id}`}
                className="bg-white rounded-2xl p-6 shadow-glass border border-parchment
                           hover:shadow-card transition-all duration-200 hover:-translate-y-1 group block">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 bg-forest-50 text-forest-600 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFF_COLOR[q.difficulty]}`}>
                    {DIFF_LABEL[q.difficulty]}
                  </span>
                </div>
                <h3 className="font-bold text-forest-900 mb-1 group-hover:text-earth-700 transition-colors">
                  {q.title}
                </h3>
                <p className="text-forest-600 text-sm mb-4 leading-relaxed">{q.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-forest-400">{q.question_count} soalan · {q.category_name}</span>
                  <ChevronRight size={16} className="text-earth-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && !error && quizzes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-forest-400 text-lg">Tiada kuiz dijumpai.</p>
          </div>
        )}
      </div>
    </main>
  );
}
