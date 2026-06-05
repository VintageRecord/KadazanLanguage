import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getQuiz, getQuizQuestions, validateQuiz } from '../api';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, ChevronLeft, Volume2 } from 'lucide-react';
import useTTS from '../hooks/useTTS';

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
  3: {
    quiz: { id:3, title:'Family Members Quiz', description:'Identify Kadazan words for family members', difficulty:'intermediate' },
    questions: [
      { id:16, prompt:'Mother',          prompt_lang:'en', options:['Tina','Tama','Andi','Odu'] },
      { id:17, prompt:'Father',          prompt_lang:'en', options:['Tama','Tina','Apu Laaki','Inaon'] },
      { id:18, prompt:'Older brother',   prompt_lang:'en', options:['Odu','Adi','Andi','Mama'] },
      { id:19, prompt:'Older sister',    prompt_lang:'en', options:['Adi','Odu','Andi','Inaon'] },
      { id:20, prompt:'Grandfather',     prompt_lang:'en', options:['Apu Laaki','Apu Vavine','Tama','Mama'] },
    ],
    answers: {16:'Tina',17:'Tama',18:'Odu',19:'Adi',20:'Apu Laaki'},
  },
  4: {
    quiz: { id:4, title:'Food & Drink Matching', description:'Match common food and drink phrases', difficulty:'beginner' },
    questions: [
      { id:21, prompt:'Water',        prompt_lang:'en', options:['Wodom','Ninom','Sada','Manuk'] },
      { id:22, prompt:'Rice (cooked)',prompt_lang:'en', options:['Ninom','Wodom','Parai','Sada'] },
      { id:23, prompt:'Fish',         prompt_lang:'en', options:['Sada','Manuk','Ninom','Gadom'] },
      { id:24, prompt:'Chicken',      prompt_lang:'en', options:['Manuk','Sada','Ninom','Tamu'] },
      { id:25, prompt:'Delicious',    prompt_lang:'en', options:['Minomis','Mahaang','Mosom','Gadom'] },
    ],
    answers: {21:'Wodom',22:'Ninom',23:'Sada',24:'Manuk',25:'Minomis'},
  },
  9: {
    quiz: { id:9, title:'Body Parts Quiz', description:'Match body part names to their Kadazan translations', difficulty:'beginner' },
    questions: [
      { id:30, prompt:'Head',      prompt_lang:'en', options:['Ulu','Mato','Talingo','Baba'] },
      { id:31, prompt:'Eye',       prompt_lang:'en', options:['Mato','Ulu','Urong','Tangan'] },
      { id:32, prompt:'Ear',       prompt_lang:'en', options:['Talingo','Mato','Baba','Witi'] },
      { id:33, prompt:'Nose',      prompt_lang:'en', options:['Urong','Ulu','Talingo','Mato'] },
      { id:34, prompt:'Mouth',     prompt_lang:'en', options:['Baba','Urong','Ulu','Tangan'] },
      { id:35, prompt:'Hand',      prompt_lang:'en', options:['Tangan','Witi','Baba','Mato'] },
      { id:36, prompt:'Foot / Leg',prompt_lang:'en', options:['Witi','Tangan','Ulu','Urong'] },
      { id:37, prompt:'I am sick', prompt_lang:'en', options:['Nohubag oku','Nopizo oku','Narapi oku','Nohutom oku'] },
    ],
    answers: {30:'Ulu',31:'Mato',32:'Talingo',33:'Urong',34:'Baba',35:'Tangan',36:'Witi',37:'Nohubag oku'},
  },
  10: {
    quiz: { id:10, title:'Colours Challenge', description:'Can you name colours in Kadazan?', difficulty:'beginner' },
    questions: [
      { id:40, prompt:'Red',    prompt_lang:'en', options:['Moiog','Moihing','Moirup','Moputih'] },
      { id:41, prompt:'Blue',   prompt_lang:'en', options:['Moihing','Moiog','Moirup','Mohitom'] },
      { id:42, prompt:'Green',  prompt_lang:'en', options:['Moirup','Moiog','Moihing','Moransi'] },
      { id:43, prompt:'Yellow', prompt_lang:'en', options:['Moiringan','Moirup','Moiog','Moputih'] },
      { id:44, prompt:'White',  prompt_lang:'en', options:['Moputih','Mohitom','Moiog','Moirup'] },
      { id:45, prompt:'Black',  prompt_lang:'en', options:['Mohitom','Moputih','Moihing','Moransi'] },
      { id:46, prompt:'Brown',  prompt_lang:'en', options:['Moiritong','Moiog','Mohitom','Moirup'] },
      { id:47, prompt:'Orange', prompt_lang:'en', options:['Moransi','Moiog','Moiringan','Moiritong'] },
    ],
    answers: {40:'Moiog',41:'Moihing',42:'Moirup',43:'Moiringan',44:'Moputih',45:'Mohitom',46:'Moiritong',47:'Moransi'},
  },
  11: {
    quiz: { id:11, title:'Time & Days Quiz', description:'Match time expressions and days of the week', difficulty:'intermediate' },
    questions: [
      { id:50, prompt:'Today',     prompt_lang:'en', options:['Tadau toi','Tadau amu','Tadau nabalu','Minggu'] },
      { id:51, prompt:'Tomorrow',  prompt_lang:'en', options:['Tadau amu','Tadau toi','Tadau nabalu','Taun'] },
      { id:52, prompt:'Yesterday', prompt_lang:'en', options:['Tadau nabalu','Tadau toi','Tadau amu','Bulan'] },
      { id:53, prompt:'Morning',   prompt_lang:'en', options:['Kuvosian','Huvuhan','Zopizan','Tadau toi'] },
      { id:54, prompt:'Night',     prompt_lang:'en', options:['Huvuhan','Kuvosian','Zopizan','Tadau amu'] },
      { id:55, prompt:'Week',      prompt_lang:'en', options:['Minggu','Bulan','Taun','Kuvosian'] },
      { id:56, prompt:'Month',     prompt_lang:'en', options:['Bulan','Taun','Minggu','Tadau toi'] },
      { id:57, prompt:'Year',      prompt_lang:'en', options:['Taun','Bulan','Minggu','Huvuhan'] },
    ],
    answers: {50:'Tadau toi',51:'Tadau amu',52:'Tadau nabalu',53:'Kuvosian',54:'Huvuhan',55:'Minggu',56:'Bulan',57:'Taun'},
  },
  12: {
    quiz: { id:12, title:'Weather Words Quiz', description:'Match weather conditions in Kadazan', difficulty:'beginner' },
    questions: [
      { id:60, prompt:'Hot',    prompt_lang:'en', options:['Mohinopot','Moisohit','Moriup','Mosilag'] },
      { id:61, prompt:'Cold',   prompt_lang:'en', options:['Moisohit','Mohinopot','Mouran','Mogubang'] },
      { id:62, prompt:'Rainy',  prompt_lang:'en', options:['Mouran','Mosilag','Moriup','Moisohit'] },
      { id:63, prompt:'Sunny',  prompt_lang:'en', options:['Mosilag','Mouran','Mogubang','Moriup'] },
      { id:64, prompt:'Windy',  prompt_lang:'en', options:['Moriup','Mosilag','Mouran','Mohinopot'] },
      { id:65, prompt:'Cloudy', prompt_lang:'en', options:['Mogubang','Moriup','Mouran','Moisohit'] },
    ],
    answers: {60:'Mohinopot',61:'Moisohit',62:'Mouran',63:'Mosilag',64:'Moriup',65:'Mogubang'},
  },
  13: {
    quiz: { id:13, title:'Feelings & Emotions Quiz', description:'Express your emotions in Kadazan', difficulty:'intermediate' },
    questions: [
      { id:70, prompt:'Happy',    prompt_lang:'en', options:['Mogisuang','Moisorob','Mogihab','Mongoingon'] },
      { id:71, prompt:'Sad',      prompt_lang:'en', options:['Moisorob','Mogisuang','Mogihab','Mokuung'] },
      { id:72, prompt:'Angry',    prompt_lang:'en', options:['Mogihab','Mogisuang','Moisorob','Mongoingon'] },
      { id:73, prompt:'Scared',   prompt_lang:'en', options:['Mongoingon','Mogihab','Moisorob','Mokuung'] },
      { id:74, prompt:'Proud',    prompt_lang:'en', options:['Mokuung','Mogisuang','Moisorob','Mogihab'] },
    ],
    answers: {70:'Mogisuang',71:'Moisorob',72:'Mogihab',73:'Mongoingon',74:'Mokuung'},
  },
  14: {
    quiz: { id:14, title:'Transport & Directions', description:'Navigate and get around using Kadazan', difficulty:'beginner' },
    questions: [
      { id:80, prompt:'Car',   prompt_lang:'en', options:['Kereta','Parao','Bas','Basikal'] },
      { id:81, prompt:'Boat',  prompt_lang:'en', options:['Parao','Kereta','Monong','Montok'] },
      { id:82, prompt:'Walk',  prompt_lang:'en', options:['Monong','Montok','Kawang','Kereta'] },
      { id:83, prompt:'Left',  prompt_lang:'en', options:['Kawang','Komoyon','Monowog','Mononou'] },
      { id:84, prompt:'Right', prompt_lang:'en', options:['Komoyon','Kawang','Montok','Monong'] },
      { id:85, prompt:'Far',   prompt_lang:'en', options:['Monowog','Mononou','Kawang','Komoyon'] },
      { id:86, prompt:'Near',  prompt_lang:'en', options:['Mononou','Monowog','Montok','Parao'] },
      { id:87, prompt:'Stop',  prompt_lang:'en', options:['Montok','Monong','Kawang','Mononou'] },
    ],
    answers: {80:'Kereta',81:'Parao',82:'Monong',83:'Kawang',84:'Komoyon',85:'Monowog',86:'Mononou',87:'Montok'},
  },
  15: {
    quiz: { id:15, title:'School Vocabulary Quiz', description:'Classroom and academic terms in Kadazan', difficulty:'beginner' },
    questions: [
      { id:90, prompt:'School',  prompt_lang:'en', options:['Sikul','Guru','Buku','Moginum'] },
      { id:91, prompt:'Teacher', prompt_lang:'en', options:['Guru','Sikul','Moginum','Pensil'] },
      { id:92, prompt:'Book',    prompt_lang:'en', options:['Buku','Guru','Sikul','Monsulat'] },
      { id:93, prompt:'Read',    prompt_lang:'en', options:['Moginum','Monsulat','Buku','Sikul'] },
      { id:94, prompt:'Write',   prompt_lang:'en', options:['Monsulat','Moginum','Buku','Guru'] },
      { id:95, prompt:'Study',   prompt_lang:'en', options:['Monginum','Moginum','Monsulat','Sikul'] },
    ],
    answers: {90:'Sikul',91:'Guru',92:'Buku',93:'Moginum',94:'Monsulat',95:'Monginum'},
  },
  16: {
    quiz: { id:16, title:'Market & Shopping Quiz', description:'Bargain and shop at the Tamu market in Kadazan', difficulty:'beginner' },
    questions: [
      { id:100, prompt:'Market',    prompt_lang:'en', options:['Tamu','Siling','Mongoli','Mohaat'] },
      { id:101, prompt:'Buy',       prompt_lang:'en', options:['Mongoli','Tamu','Siling','Mohinuang'] },
      { id:102, prompt:'Expensive', prompt_lang:'en', options:['Mohaat','Mohinuang','Tamu','Siling'] },
      { id:103, prompt:'Cheap',     prompt_lang:'en', options:['Mohinuang','Mohaat','Mongoli','Tamu'] },
      { id:104, prompt:'Money',     prompt_lang:'en', options:['Siling','Tamu','Mohaat','Baki'] },
      { id:105, prompt:'How much?', prompt_lang:'en', options:['Piga?','Nunu?','Tokou?','Nokot?'] },
      { id:106, prompt:'Discount',  prompt_lang:'en', options:['Kaluasan','Mohaat','Siling','Tamu'] },
    ],
    answers: {100:'Tamu',101:'Mongoli',102:'Mohaat',103:'Mohinuang',104:'Siling',105:'Piga?',106:'Kaluasan'},
  },
  17: {
    quiz: { id:17, title:'Advanced Culture Quiz', description:'Deep-dive into Kadazan cultural and ceremonial vocabulary', difficulty:'advanced' },
    questions: [
      { id:110, prompt:'Harvest festival',     prompt_lang:'en', options:['Kaamatan','Sumazau','Lihing','Bobolian'] },
      { id:111, prompt:'Traditional dance',    prompt_lang:'en', options:['Sumazau','Kaamatan','Lihing','Rogon'] },
      { id:112, prompt:'Traditional rice wine',prompt_lang:'en', options:['Lihing','Kaamatan','Sumazau','Bobolian'] },
      { id:113, prompt:'Ceremonial elder',     prompt_lang:'en', options:['Bobolian','Lihing','Rogon','Kaamatan'] },
      { id:114, prompt:'Spirit / Soul',        prompt_lang:'en', options:['Rogon','Bobolian','Sumazau','Koposikou'] },
      { id:115, prompt:'Unity / Together',     prompt_lang:'en', options:['Koposikou','Rogon','Bobolian','Kaamatan'] },
    ],
    answers: {110:'Kaamatan',111:'Sumazau',112:'Lihing',113:'Bobolian',114:'Rogon',115:'Koposikou'},
  },
  18: {
    quiz: { id:18, title:'Grand Mixed Challenge', description:'A comprehensive 16-question test spanning all categories', difficulty:'intermediate' },
    questions: [
      { id:120, prompt:'Good morning',  prompt_lang:'en', options:['Kopivosian','Kopivuhan','Kopio','Korikot'] },
      { id:121, prompt:'Thank you',     prompt_lang:'en', options:['Kopio','Kopivosian','Osonong ku','Korikot'] },
      { id:122, prompt:'One',           prompt_lang:'en', options:['Iso','Duvo','Tolu','Apat'] },
      { id:123, prompt:'Five',          prompt_lang:'en', options:['Limo','Onom','Pitu','Walu'] },
      { id:124, prompt:'Mother',        prompt_lang:'en', options:['Tina','Tama','Andi','Odu'] },
      { id:125, prompt:'Father',        prompt_lang:'en', options:['Tama','Tina','Mama','Inaon'] },
      { id:126, prompt:'Water',         prompt_lang:'en', options:['Wodom','Ninom','Sada','Gadom'] },
      { id:127, prompt:'Rice (cooked)', prompt_lang:'en', options:['Ninom','Wodom','Parai','Manuk'] },
      { id:128, prompt:'Head',          prompt_lang:'en', options:['Ulu','Mato','Talingo','Baba'] },
      { id:129, prompt:'Hand',          prompt_lang:'en', options:['Tangan','Witi','Ulu','Mato'] },
      { id:130, prompt:'Red',           prompt_lang:'en', options:['Moiog','Moihing','Moirup','Mohitom'] },
      { id:131, prompt:'Blue',          prompt_lang:'en', options:['Moihing','Moiog','Moputih','Moransi'] },
      { id:132, prompt:'Happy',         prompt_lang:'en', options:['Mogisuang','Moisorob','Mogihab','Mokuung'] },
      { id:133, prompt:'Sad',           prompt_lang:'en', options:['Moisorob','Mogisuang','Mogihab','Mongoingon'] },
      { id:134, prompt:'Car',           prompt_lang:'en', options:['Kereta','Parao','Bas','Monong'] },
      { id:135, prompt:'Stop',          prompt_lang:'en', options:['Montok','Kawang','Komoyon','Monong'] },
    ],
    answers: {120:'Kopivosian',121:'Kopio',122:'Iso',123:'Limo',124:'Tina',125:'Tama',126:'Wodom',127:'Ninom',128:'Ulu',129:'Tangan',130:'Moiog',131:'Moihing',132:'Mogisuang',133:'Moisorob',134:'Kereta',135:'Montok'},
  },
};

function getMock(id) {
  const m = MOCK[id];
  if (m) return m;
  return MOCK[1]; // fallback to greetings quiz
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
  const { speak } = useTTS();

  const shuffleOptions = (qs) =>
    qs.map(q => ({ ...q, options: [...q.options].sort(() => Math.random() - 0.5) }));

  useEffect(() => {
    Promise.all([getQuiz(id), getQuizQuestions(id)])
      .then(([q, qs]) => { setQuiz(q); setQuestions(shuffleOptions(qs)); })
      .catch(() => {
        const m = getMock(+id);
        setQuiz(m.quiz);
        setQuestions(shuffleOptions(m.questions));
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
    <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
      <div className="text-forest-600 animate-pulse">Memuatkan kuiz...</div>
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
  const resultMap = Object.fromEntries(result.results.map(r => [r.question_id, r]));
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
