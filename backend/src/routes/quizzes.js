const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/quizzes  — list all active quizzes
router.get('/', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT q.id, q.title, q.description, q.difficulty, q.source,
            c.slug AS category_slug, c.name_en AS category_name,
            CASE
              WHEN q.source = 'phrases' THEN (
                SELECT COUNT(*) FROM phrases p WHERE p.category_id = q.category_id
              )
              WHEN q.source = 'mix' THEN 16
              ELSE (
                SELECT COUNT(*) FROM quiz_questions qq WHERE qq.quiz_id = q.id
              )
            END AS question_count
     FROM quizzes q
     LEFT JOIN categories c ON c.id = q.category_id
     WHERE q.is_active = 1
     ORDER BY q.id`
  );
  res.json(rows);
});

// GET /api/quizzes/:id  — quiz metadata
router.get('/:id', async (req, res) => {
  const [[quiz]] = await pool.query(
    `SELECT q.*, c.slug AS category_slug, c.name_en AS category_name
     FROM quizzes q LEFT JOIN categories c ON c.id = q.category_id
     WHERE q.id = ? AND q.is_active = 1`,
    [req.params.id]
  );
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

// GET /api/quizzes/:id/questions  — questions + shuffled options
router.get('/:id/questions', async (req, res) => {
  const quizId = req.params.id;

  const [[quiz]] = await pool.query(
    `SELECT q.id, q.source, q.category_id, q.difficulty
     FROM quizzes q WHERE q.id = ? AND q.is_active = 1`,
    [quizId]
  );
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  // ── Mix mode (random phrases from all categories) ────────────────────────
  if (quiz.source === 'mix') {
    const [phrases] = await pool.query(
      `SELECT id, english, kadazan, category_id FROM phrases
       WHERE kadazan IS NOT NULL
       ORDER BY RAND()
       LIMIT 16`
    );
    if (!phrases.length) return res.status(404).json({ error: 'No phrases found' });

    const allKadazan = phrases.map(p => p.kadazan);

    const result = phrases.map((p, i) => {
      const distractors = allKadazan
        .filter(w => w !== p.kadazan)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [p.kadazan, ...distractors].sort(() => Math.random() - 0.5);

      return {
        id:          `p_${p.id}`,
        prompt:      p.english,
        prompt_lang: 'en',
        options,
        sort_order:  i + 1,
      };
    });

    return res.json(result);
  }

  // ── Phrase-generated mode ─────────────────────────────────────────────────
  if (quiz.source === 'phrases') {
    // Fetch all phrases for this quiz's category as questions
    const [phrases] = await pool.query(
      `SELECT id, english, kadazan FROM phrases
       WHERE category_id = ? ORDER BY id`,
      [quiz.category_id]
    );
    if (!phrases.length) return res.status(404).json({ error: 'No phrases found for this quiz' });

    // Pull a pool of distractor Kadazan words from OTHER categories
    const [distractorPool] = await pool.query(
      `SELECT kadazan FROM phrases
       WHERE category_id != ? AND kadazan IS NOT NULL
       ORDER BY RAND()
       LIMIT 60`,
      [quiz.category_id]
    );
    const distractorWords = distractorPool.map(d => d.kadazan);

    const result = phrases.map((p, i) => {
      // Pick 3 random distractors that aren't the correct answer
      const pool3 = distractorWords
        .filter(w => w !== p.kadazan)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [p.kadazan, ...pool3].sort(() => Math.random() - 0.5);

      return {
        id:          `p_${p.id}`,   // prefix to distinguish from manual question ids
        prompt:      p.english,
        prompt_lang: 'en',
        options,
        sort_order:  i + 1,
      };
    });

    return res.json(result);
  }

  // ── Manual mode (quiz_questions + quiz_distractors) ───────────────────────
  const [questions] = await pool.query(
    `SELECT id, prompt, prompt_lang, sort_order FROM quiz_questions
     WHERE quiz_id = ? ORDER BY sort_order`,
    [quizId]
  );
  if (!questions.length) return res.status(404).json({ error: 'No questions found' });

  const result = await Promise.all(questions.map(async (q) => {
    const [[answerRow]] = await pool.query(
      'SELECT answer FROM quiz_questions WHERE id = ?', [q.id]
    );
    const [distractors] = await pool.query(
      'SELECT distractor FROM quiz_distractors WHERE question_id = ?', [q.id]
    );

    const options = [
      answerRow.answer,
      ...distractors.map(d => d.distractor),
    ].sort(() => Math.random() - 0.5);

    return { ...q, options };
  }));

  res.json(result);
});

// POST /api/quizzes/:id/validate  — check answers
// Body: { answers: [ { question_id, selected } ] }
router.post('/:id/validate', async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers) || !answers.length) {
    return res.status(400).json({ error: 'answers array required' });
  }

  const [[quiz]] = await pool.query(
    'SELECT source FROM quizzes WHERE id = ?', [req.params.id]
  );

  let correctMap = {};

  if (quiz?.source === 'phrases' || quiz?.source === 'mix') {
    // question ids are like "p_123" — extract the phrase id
    const phraseIds = answers
      .map(a => String(a.question_id).replace('p_', ''))
      .filter(id => /^\d+$/.test(id));

    if (phraseIds.length) {
      const [rows] = await pool.query(
        'SELECT id, kadazan FROM phrases WHERE id IN (?)',
        [phraseIds]
      );
      correctMap = Object.fromEntries(rows.map(r => [`p_${r.id}`, r.kadazan]));
    }
  } else {
    const ids = answers.map(a => a.question_id);
    const [rows] = await pool.query(
      'SELECT id, answer FROM quiz_questions WHERE id IN (?)', [ids]
    );
    correctMap = Object.fromEntries(rows.map(r => [r.id, r.answer]));
  }

  const results = answers.map(({ question_id, selected }) => ({
    question_id,
    selected,
    correct_answer: correctMap[question_id] ?? null,
    is_correct: correctMap[question_id] === selected,
  }));

  const score = results.filter(r => r.is_correct).length;

  const sessionId = req.headers['x-session-id'] || 'anonymous';
  await pool.query(
    'INSERT INTO user_progress (session_id, quiz_id, score, total) VALUES (?, ?, ?, ?)',
    [sessionId, req.params.id, score, answers.length]
  );

  res.json({ score, total: answers.length, results });
});

module.exports = router;
