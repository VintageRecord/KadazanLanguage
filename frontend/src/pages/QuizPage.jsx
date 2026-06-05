import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz, getQuizQuestions, validateQuiz } from '../api';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, ChevronLeft } from 'lucide-react';

/* ── Fallback data (offline / no API) ── */
const MOCK = {
  1: {
    quiz: { id:1, title:'Greetings Matching Quiz', description:'Match English greetings to their Kadazan equivalents', difficulty:'beginner' },
    questions: [
      { id:1, prompt:'Good morning',              prompt_lang:'en', options:['Kopivosian','Kopivuhan','Kopizopizan','Kopio'] },
      { id:2, prompt:'Good evening / Good night', prompt_lang:'en', options:['Kopivuhan','Kopivosian','Kopio','Kopizopizan'] },
      { id:3, prompt:'Thank you',                 prompt_lang:'en', options:['Kopio','Kopivosian','Kopivuhan','Osonong ku'] },
      { id:4, prompt:'How are you?',              prompt_lang:'en', options:['Mongihai kuh dika?','Osonong ku','Kopio','Kopivosian'] },
      { id:5, prompt:'I am fine',                 prompt_lang:'en', options:['Osonong ku','Kopio','Mongihai kuh dika?','Ngokou ngu'] },
    ],
    answers: { 1:'Kopivosian', 2:'Kopivuhan', 3:'Kopio', 4:'Mongihai kuh dika?', 5:'Osonong ku' },
  },
  2: {
    quiz: { id:2, title:'Numbers Challenge', description:'Match numbers 1–10 in Kadazan', difficulty:'beginner' },
    questions: [
      { id:6,  prompt:'One',   prompt_lang:'en', options:['Iso','Duvo','Tolu','Apat'] },
      { id:7,  prompt:'Two',   prompt_lang:'en', options:['Duvo','Iso','Tolu','Limo'] },
      { id:8,  prompt:'Three', prompt_lang:'en', options:['Tolu','Duvo','Apat','Onom'] },
      { id:9,  prompt:'Four',  prompt_lang:'en', options:['Apat','Tolu','Limo','Pitu'] },
      { id:10, prompt:'Five',  prompt_lang:'en', options:['Limo','Apat','Onom','Walu'] },
      { id:11, prompt:'Six',   prompt_lang:'en', options:['Onom','Limo','Pitu','Siam'] },
      { id:12, prompt:'Seven', prompt_lang:'en', options:['Pitu','Onom','Walu','Hopod'] },
      { id:13, prompt:'Eight', prompt_lang:'en', options:['Walu','Pitu','Siam','Iso'] },
      { id:14, prompt:'Nine',  prompt_lang:'en', options:['Siam','Walu','Hopod','Duvo'] },
      { id:15, prompt:'Ten',   prompt_lang:'en', options:['Hopod','Siam','Iso','Tolu'] },
    ],
    answers: {6:'Iso',7:'Duvo',8:'Tolu',9:'Apat',10:'Limo',11:'Onom',12:'Pitu',13:'Walu',14:'Siam',15:'Hopod'},
  },
};

function getMock(id) {
  const m = MOCK[id];
  if (m) return m;
  // Generic fallback
  return {
    quiz: { id, title:'Kuiz Bahasa Kadazan', description:'Padankan frasa dengan betul', difficulty:'beginner' },
    questions: [
      { id:16, prompt:'Good morning', prompt_lang:'en', options:['Kopivosian','Kopio','Kopivuhan','Tina'] },
      { id:17, prompt:'Thank you',    prompt_lang:'en', options:['Kopio','Kopivosian','Osonong ku','Tama'] },
      { id:18, prompt:'Mother',       prompt_lang:'en', options:['Tina','Tama','Andi','Odu'] },
      { id:19, prompt:'Father',       prompt_lang:'en', options:['Tama','Tina','Apu Laaki','Andi'] },
      { id:20, prompt:'Water',        prompt_lang:'en', options:['Wodom','Ninom','Sada','Manuk'] },
    ],
    answers: {16:'Kopivosian',17:'Kopio',18:'Tina',19:'Tama',20:'Wodom'},
  };
}

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
  const [selected,  setSelected]  = useState({});   // { questionId: answer }
  const [result,    setResult]    = useState(null);  // validation response
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [offline,   setOffline]   = useState(false);
  const sessionId = useState(() => crypto.randomUUID())[0];

  useEffect(() => {
    Promise.all([getQuiz(id), getQuizQuestions(id)])
      .then(([q, qs]) => { setQuiz(q); setQuestions(qs); })
      .catch(() => {
        const m = getMock(+id);
        setQuiz(m.quiz);
        setQuestions(m.questions);
        setOffline(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const selectOption = (questionId, option) => {
    if (submitted) return;
    setSelected(s => ({ ...s, [questionId]: option }));
  };

  const handleSubmit = useCallback(async () => {
    const answers = questions.map(q => ({ question_id: q.id, selected: selected[q.id] ?? '' }));

    if (!offline) {
      try {
        const res = await validateQuiz(id, answers, sessionId);
        setResult(res);
      } catch {
        // Offline scoring
        const m = getMock(+id);
        const results = answers.map(a => ({
          question_id: a.question_id,
          selected:    a.selected,
          correct_answer: m.answers[a.question_id] ?? '',
          is_correct: m.answers[a.question_id] === a.selected,
        }));
        setResult({ score: results.filter(r => r.is_correct).length, total: answers.length, results });
      }
    } else {
      const m = getMock(+id);
      const results = answers.map(a => ({
        question_id: a.question_id,
        selected:    a.selected,
        correct_answer: m.answers[a.question_id] ?? '',
        is_correct: m.answers[a.question_id] === a.selected,
      }));
      setResult({ score: results.filter(r => r.is_correct).length, total: answers.length, results });
    }
    setSubmitted(true);
    setCurrent(0);
  }, [questions, selected, offline, id, sessionId]);

  const handleReset = () => {
    setSelected({});
    setResult(null);
    setSubmitted(false);
    setCurrent(0);
  };

  if (loading) return (
    <main className="min-h-screen bg-cream pt-20 flex items-center justify-center">
      <div className="text-forest-600 animate-pulse">Memuatkan kuiz...</div>
    </main>
  );

  if (submitted && result) return <ResultScreen quiz={quiz} result={result} onReset={handleReset} />;

  const q    = questions[current];
  const prog = Math.round(((current + 1) / questions.length) * 100);

  return (
    <main className="min-h-screen bg-cream pt-20">
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
            <h2 className="font-display text-2xl font-bold text-forest-900 mb-8">{q.prompt}</h2>

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
  const resultMap = Object.fromEntries(result.results.map(r => [r.question_id, r]));

  return (
    <main className="min-h-screen bg-cream pt-20">
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
