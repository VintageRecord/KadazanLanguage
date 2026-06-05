const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/quizzes  — list all active quizzes
router.get('/', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT q.id, q.title, q.description, q.difficulty,
            c.slug AS category_slug, c.name_en AS category_name,
            (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.quiz_id = q.id) AS question_count
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

  const [questions] = await pool.query(
    `SELECT id, prompt, prompt_lang, sort_order FROM quiz_questions
     WHERE quiz_id = ? ORDER BY sort_order`,
    [quizId]
  );

  if (!questions.length) return res.status(404).json({ error: 'No questions found' });

  // For each question, fetch its correct answer + distractors, then shuffle
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

  const ids = answers.map(a => a.question_id);
  const [rows] = await pool.query(
    'SELECT id, answer FROM quiz_questions WHERE id IN (?)',
    [ids]
  );

  const correctMap = Object.fromEntries(rows.map(r => [r.id, r.answer]));

  const results = answers.map(({ question_id, selected }) => ({
    question_id,
    selected,
    correct_answer: correctMap[question_id] ?? null,
    is_correct: correctMap[question_id] === selected,
  }));

  const score = results.filter(r => r.is_correct).length;

  // Persist progress (session-based)
  const sessionId = req.headers['x-session-id'] || 'anonymous';
  await pool.query(
    'INSERT INTO user_progress (session_id, quiz_id, score, total) VALUES (?, ?, ?, ?)',
    [sessionId, req.params.id, score, answers.length]
  );

  res.json({ score, total: answers.length, results });
});

module.exports = router;
