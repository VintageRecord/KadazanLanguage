const express   = require('express');
const router    = express.Router();
const pool      = require('../db/pool');
const adminAuth = require('../middleware/adminAuth');

router.use(adminAuth);

// GET /api/admin/counts
router.get('/counts', async (_req, res) => {
  const [[counts]] = await pool.query(
    `SELECT
       (SELECT COUNT(*) FROM categories) AS categories,
       (SELECT COUNT(*) FROM phrases)    AS phrases,
       (SELECT COUNT(*) FROM quizzes)    AS quizzes`
  );
  res.json(counts);
});

// ── Categories ────────────────────────────────────────────────────────────────

router.get('/categories', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, slug, name_en, name_ms, description, icon, sort_order FROM categories ORDER BY sort_order'
  );
  res.json(rows);
});

router.post('/categories', async (req, res) => {
  const { slug, name_en, name_ms, description, icon, sort_order } = req.body;
  if (!slug || !name_en) return res.status(400).json({ error: 'slug and name_en are required' });

  let order = sort_order;
  if (order === undefined || order === null || order === '') {
    const [[{ maxOrder }]] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS maxOrder FROM categories');
    order = maxOrder + 1;
  }

  const [result] = await pool.query(
    'INSERT INTO categories (slug, name_en, name_ms, description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
    [slug, name_en, name_ms || null, description || null, icon || null, order]
  );
  res.status(201).json({ id: result.insertId });
});

router.put('/categories/:id', async (req, res) => {
  const { slug, name_en, name_ms, description, icon, sort_order } = req.body;
  await pool.query(
    'UPDATE categories SET slug=?, name_en=?, name_ms=?, description=?, icon=?, sort_order=? WHERE id=?',
    [slug, name_en, name_ms || null, description || null, icon || null, sort_order || 0, req.params.id]
  );
  res.json({ success: true });
});

router.delete('/categories/:id', async (req, res) => {
  const [[{ count }]] = await pool.query(
    'SELECT COUNT(*) AS count FROM phrases WHERE category_id = ?', [req.params.id]
  );
  if (count > 0) {
    return res.status(409).json({ error: `Cannot delete — ${count} phrase(s) still use this category.` });
  }
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Phrases ───────────────────────────────────────────────────────────────────

router.get('/phrases', async (req, res) => {
  const { search, category, difficulty } = req.query;
  let where  = [];
  let params = [];

  if (search) {
    where.push('(p.english LIKE ? OR p.kadazan LIKE ? OR p.malay LIKE ?)');
    const q = `%${search}%`;
    params.push(q, q, q);
  }
  if (category) { where.push('c.slug = ?'); params.push(category); }
  if (difficulty) { where.push('p.difficulty = ?'); params.push(difficulty); }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT p.id, p.english, p.malay, p.kadazan, p.romanization,
            p.audio_url, p.difficulty, p.notes, p.category_id,
            c.slug AS category_slug, c.name_en AS category_name
     FROM phrases p JOIN categories c ON c.id = p.category_id
     ${whereClause}
     ORDER BY c.sort_order, p.id`,
    params
  );
  res.json(rows);
});

router.post('/phrases', async (req, res) => {
  const { english, malay, kadazan, romanization, audio_url, difficulty, notes, category_id } = req.body;
  if (!english || !kadazan || !category_id) {
    return res.status(400).json({ error: 'english, kadazan and category_id are required' });
  }
  const [result] = await pool.query(
    'INSERT INTO phrases (english, malay, kadazan, romanization, audio_url, difficulty, notes, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [english, malay || null, kadazan, romanization || null, audio_url || null, difficulty || 'beginner', notes || null, category_id]
  );
  res.status(201).json({ id: result.insertId });
});

router.put('/phrases/:id', async (req, res) => {
  const { english, malay, kadazan, romanization, audio_url, difficulty, notes, category_id } = req.body;
  await pool.query(
    'UPDATE phrases SET english=?, malay=?, kadazan=?, romanization=?, audio_url=?, difficulty=?, notes=?, category_id=? WHERE id=?',
    [english, malay || null, kadazan, romanization || null, audio_url || null, difficulty, notes || null, category_id, req.params.id]
  );
  res.json({ success: true });
});

router.delete('/phrases/:id', async (req, res) => {
  await pool.query('DELETE FROM phrases WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

// ── Quizzes ───────────────────────────────────────────────────────────────────

router.get('/quizzes', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT q.id, q.title, q.description, q.difficulty, q.source, q.is_active,
            q.category_id, c.name_en AS category_name
     FROM quizzes q LEFT JOIN categories c ON c.id = q.category_id
     ORDER BY q.id`
  );
  res.json(rows);
});

router.post('/quizzes', async (req, res) => {
  const { title, description, difficulty, source, category_id, is_active } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  const [result] = await pool.query(
    'INSERT INTO quizzes (title, description, difficulty, source, category_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description || null, difficulty || 'beginner', source || 'phrases', category_id || null, is_active ? 1 : 0]
  );
  res.status(201).json({ id: result.insertId });
});

router.put('/quizzes/:id', async (req, res) => {
  const { title, description, difficulty, source, category_id, is_active } = req.body;
  await pool.query(
    'UPDATE quizzes SET title=?, description=?, difficulty=?, source=?, category_id=?, is_active=? WHERE id=?',
    [title, description || null, difficulty, source, category_id || null, is_active ? 1 : 0, req.params.id]
  );
  res.json({ success: true });
});

router.delete('/quizzes/:id', async (req, res) => {
  await pool.query('DELETE FROM quizzes WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
