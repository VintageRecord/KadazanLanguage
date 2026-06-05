import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes } from '../api';
import { ChevronRight, BookOpen } from 'lucide-react';

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

const MOCK_QUIZZES = [
  { id:1, title:'Greetings Matching Quiz',   description:'Match English greetings to their Kadazan equivalents', difficulty:'beginner',     category_name:'Greetings & Courtesy',  question_count:5  },
  { id:2, title:'Numbers Challenge',          description:'Match numbers 1–10 in Kadazan',                        difficulty:'beginner',     category_name:'Numbers & Counting',    question_count:10 },
  { id:3, title:'Family Members Quiz',        description:'Identify Kadazan words for family members',            difficulty:'intermediate', category_name:'Family & Relationships', question_count:5  },
  { id:4, title:'Food & Drink Matching',      description:'Match common food and drink phrases',                  difficulty:'beginner',     category_name:'Food & Drink',           question_count:5  },
  { id:5, title:'Nature & Environment Quiz',  description:'Match nature words to Kadazan',                       difficulty:'beginner',     category_name:'Nature & Environment',   question_count:5  },
  { id:6, title:'Daily Life Phrases',         description:'Everyday phrases matching quiz',                       difficulty:'intermediate', category_name:'Daily Life',             question_count:5  },
  { id:7, title:'Culture & Tradition Quiz',   description:'Match cultural terms to Kadazan equivalents',         difficulty:'intermediate', category_name:'Culture & Tradition',    question_count:5  },
  { id:8, title:'Mixed Beginner Challenge',   description:'A mix of beginner phrases from all categories',       difficulty:'beginner',     category_name:'All Categories',         question_count:10 },
];

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getQuizzes()
      .then(setQuizzes)
      .catch(() => setQuizzes(MOCK_QUIZZES))
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
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-44 animate-pulse border border-parchment" />
            ))}
          </div>
        ) : (
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
      </div>
    </main>
  );
}
