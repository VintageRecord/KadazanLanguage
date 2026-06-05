const express = require('express');
const router  = express.Router();
const pool    = require('../db/pool');

// GET /api/phrases  ?category=greetings&difficulty=beginner&page=1&limit=10
router.get('/', async (req, res) => {
  const { category, difficulty, page = 1, limit = 20 } = req.query;
  const offset = (Math.max(1, +page) - 1) * +limit;

  let where   = [];
  let params  = [];

  if (category) {
    where.push('c.slug = ?');
    params.push(category);
  }
  if (difficulty) {
    where.push('p.difficulty = ?');
    params.push(difficulty);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT p.id, p.english, p.malay, p.kadazan, p.romanization,
            p.audio_url, p.difficulty, p.notes,
            c.slug AS category_slug, c.name_en AS category_name
     FROM phrases p
     JOIN categories c ON c.id = p.category_id
     ${whereClause}
     ORDER BY c.sort_order, p.id
     LIMIT ? OFFSET ?`,
    [...params, +limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM phrases p
     JOIN categories c ON c.id = p.category_id ${whereClause}`,
    params
  );

  res.json({ data: rows, total, page: +page, limit: +limit });
});

// GET /api/phrases/categories
router.get('/categories', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT id, slug, name_en, name_ms, description, icon FROM categories ORDER BY sort_order'
  );
  res.json(rows);
});

// GET /api/phrases/:id
router.get('/:id', async (req, res) => {
  const [[row]] = await pool.query(
    `SELECT p.*, c.slug AS category_slug, c.name_en AS category_name
     FROM phrases p JOIN categories c ON c.id = p.category_id
     WHERE p.id = ?`,
    [req.params.id]
  );
  if (!row) return res.status(404).json({ error: 'Phrase not found' });
  res.json(row);
});

module.exports = router;
