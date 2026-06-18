import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz, getQuizQuestions, validateQuiz } from '../api';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, ChevronLeft, Volume2, AlertCircle } from 'lucide-react';
import useTTS from '../hooks/useTTS';

const DIFF_LABEL = { beginner:'Asas', intermediate:'Pertengahan', advanced:'Lanjutan' };
const DIFF_COLOR = {
  beginner:'bg-green-100 text-green-700',
  intermediate:'bg-yellow-100 text-yellow-700',
  advanced:'bg-red-100 text-red-700',
};

export default function QuizPage() {
  const { id } = useParams();
  const [quiz,      setQuiz]      = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState({});
  const [result,    setResult]    = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const sessionId = useState(() => crypto.randomUUID())[0];
  const { speak } = useTTS();

  const shuffleOptions = (qs) =>
    qs.map(q => ({ ...q, options: [...q.options].sort(() => Math.random() - 0.5) }));

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getQuiz(id), getQuizQuestions(id)])
      .then(([q, qs]) => { setQuiz(q); setQuestions(shuffleOptions(qs)); })
      .catch(() => setError('Tidak dapat menyambung ke pelayan. Pastikan backend berjalan.'))
      .finally(() => setLoading(false));
  }, [id]);

  const selectOption = (questionId, option) => {
    if (submitted) return;
    setSelected(s => ({ ...s, [questionId]: option }));
  };

  const handleSubmit = useCallback(async () => {
    const answers = questions.map(q => ({ question_id: q.id, selected: selected[q.id] ?? '' }));
    try {
      const res = await validateQuiz(id, answers, sessionId);
      setResult(res);
    } catch {
      setError('Tidak dapat menghantar jawapan. Sila cuba lagi.');
      return;
    }
    setSubmitted(true);
    setCurrent(0);
  }, [questions, selected, id, sessionId]);

  const handleReset = () => {
    setSelected({});
    setResult(null);
    setSubmitted(false);
    setCurrent(0);
  };

  if (loading) return (
    <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
      <div className="text-forest-600 animate-pulse">Memuatkan kuiz...</div>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-cream pt-24">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/quizzes" className="text-forest-600 hover:text-forest-800 text-sm flex items-center gap-1 mb-6">
          <ChevronLeft size={15} /> Semua Kuiz
        </Link>
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700
                        rounded-2xl px-5 py-4">
          <AlertCircle size={18} className="shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    </main>
  );

  if (submitted && result) return <ResultScreen quiz={quiz} result={result} onReset={handleReset} />;

  const q    = questions[current];
  const prog = Math.round(((current + 1) / questions.length) * 100);

  return (
    <main className="min-h-screen bg-cream pt-24">
      <div className="bg-forest-900 py-10">
        <div className="max-w-3xl mx-auto px-6">
          <Link to="/quizzes" className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-4">
            <ChevronLeft size={15} /> Semua Kuiz
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{quiz?.title}</h1>
              <p className="text-white/60 text-sm mt-1">{quiz?.description}</p>
            </div>
            <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${DIFF_COLOR[quiz?.difficulty]}`}>
              {DIFF_LABEL[quiz?.difficulty]}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 bg-parchment rounded-full h-2">
            <div className="bg-earth-600 h-2 rounded-full transition-all duration-300" style={{ width: `${prog}%` }} />
          </div>
          <span className="text-sm text-forest-500 font-medium shrink-0">
            {current + 1} / {questions.length}
          </span>
        </div>

        {/* Question cards nav */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {questions.map((qq, i) => (
            <button key={qq.id} onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all
                ${i === current
                  ? 'bg-forest-700 text-white'
                  : selected[qq.id]
                    ? 'bg-earth-200 text-earth-800'
                    : 'bg-parchment text-forest-500 hover:bg-forest-100'}`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question */}
        {q && (
          <div className="bg-white rounded-2xl shadow-card border border-parchment p-8">
            <p className="text-xs text-forest-400 uppercase tracking-wide font-semibold mb-2">
              {q.prompt_lang === 'en' ? 'English' : 'Bahasa Malaysia'} → Kadazan
            </p>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold text-forest-900">{q.prompt}</h2>
              <button onClick={() => speak(q.prompt)}
                title="Dengar sebutan"
                className="w-9 h-9 rounded-full bg-forest-100 hover:bg-earth-600 hover:text-white
                           text-forest-600 flex items-center justify-center transition-all shrink-0">
                <Volume2 size={16} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {q.options.map(opt => (
                <button key={opt}
                  onClick={() => selectOption(q.id, opt)}
                  className={`quiz-option ${selected[q.id] === opt ? 'selected' : ''}`}>
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-parchment">
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                className="text-sm text-forest-500 hover:text-forest-700 disabled:opacity-30 transition-colors">
                ← Sebelumnya
              </button>

              {current < questions.length - 1 ? (
                <button onClick={() => setCurrent(c => c + 1)}
                  className="btn-primary text-sm py-2">
                  Seterusnya <ArrowRight size={15} />
                </button>
              ) : (
                <button onClick={handleSubmit}
                  disabled={Object.keys(selected).length < questions.length}
                  className="btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Hantar Jawapan <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* answered count */}
        <p className="text-center text-forest-400 text-sm mt-5">
          {Object.keys(selected).length} daripada {questions.length} soalan dijawab
        </p>
      </div>
    </main>
  );
}

function ResultScreen({ quiz, result, onReset }) {
  const pct      = Math.round((result.score / result.total) * 100);
  const { speak } = useTTS();

  return (
    <main className="min-h-screen bg-cream pt-24">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Score card */}
        <div className={`rounded-3xl p-8 text-center mb-8 shadow-card
          ${pct >= 80 ? 'bg-green-50 border-2 border-green-200'
          : pct >= 50 ? 'bg-yellow-50 border-2 border-yellow-200'
          : 'bg-red-50 border-2 border-red-200'}`}>
          <p className="text-5xl font-display font-bold mb-2
            ${pct >= 80 ? 'text-green-700' : pct >= 50 ? 'text-yellow-700' : 'text-red-700'}">
            {result.score}/{result.total}
          </p>
          <p className="text-2xl font-bold mb-1">
            {pct >= 80 ? '🎉 Cemerlang!' : pct >= 50 ? '👍 Bagus!' : '💪 Cuba Lagi!'}
          </p>
          <p className="text-forest-600">
            {pct >= 80 ? 'Anda sangat menguasai bahasa Kadazan!'
            : pct >= 50 ? 'Teruskan latihan untuk lebih baik.'
            : 'Jangan berputus asa, terus belajar!'}
          </p>
        </div>

        {/* Answer breakdown */}
        <div className="space-y-3 mb-8">
          {result.results.map((r, i) => (
            <div key={r.question_id}
              className={`bg-white rounded-xl px-5 py-4 border flex items-center gap-4
                ${r.is_correct ? 'border-green-200' : 'border-red-200'}`}>
              <span className="text-lg">{r.is_correct ? '✅' : '❌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-forest-400 mb-0.5">Soalan {i + 1}</p>
                <p className="font-medium text-forest-900 truncate">{r.selected || '(tiada jawapan)'}</p>
                {!r.is_correct && (
                  <p className="text-xs text-green-700 mt-0.5">
                    Jawapan betul: <strong>{r.correct_answer}</strong>
                  </p>
                )}
              </div>
              <button onClick={() => speak(r.correct_answer)}
                title="Dengar sebutan"
                className="w-8 h-8 rounded-full bg-forest-100 hover:bg-earth-600 hover:text-white
                           text-forest-600 flex items-center justify-center transition-all shrink-0">
                <Volume2 size={14} />
              </button>
              {r.is_correct
                ? <CheckCircle size={20} className="text-green-500 shrink-0" />
                : <XCircle    size={20} className="text-red-400 shrink-0" />}
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={onReset} className="btn-primary">
            <RotateCcw size={16} /> Cuba Semula
          </button>
          <Link to="/quizzes" className="btn-outline bg-forest-700 hover:bg-forest-600">
            Kuiz Lain
          </Link>
        </div>
      </div>
    </main>
  );
}
