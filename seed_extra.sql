-- ═════════════════════════════════════════════
--  ADDITIONAL SEED DATA  (run after schema.sql)
-- ═════════════════════════════════════════════
USE kadazan_language;

-- ─────────────────────────────────────────────
--  New Categories
-- ─────────────────────────────────────────────
INSERT INTO categories (slug, name_en, name_ms, description, icon, sort_order) VALUES
('body',        'Body & Health',         'Badan & Kesihatan',    'Body parts and common health phrases',           'heart',        9),
('colours',     'Colours',               'Warna',                'Common colour names in Kadazan',                 'palette',      10),
('time',        'Time & Days',           'Masa & Hari',          'Days of the week, time expressions',             'clock',        11),
('weather',     'Weather',               'Cuaca',                'Weather conditions and climate words',           'cloud',        12),
('emotions',    'Feelings & Emotions',   'Perasaan & Emosi',     'Emotional states and feelings',                  'smile',        13),
('transport',   'Transport & Travel',    'Pengangkutan & Travel','Getting around and travel phrases',              'car',          14),
('school',      'School & Learning',     'Sekolah & Pembelajaran','Academic and classroom vocabulary',             'book-open',    15),
('market',      'Market & Shopping',     'Pasar & Membeli-belah','Shopping, bargaining and market phrases',        'shopping-bag', 16);

-- ─────────────────────────────────────────────
--  Additional Phrases — Greetings (cat 1)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(1, 'Good luck',               'Semoga berjaya',       'Kopivosian tadau',    'Ko-pi-vo-si-an ta-dau',   'intermediate'),
(1, 'Congratulations',         'Tahniah',              'Kinorohingan',        'Ki-no-ro-hing-an',        'intermediate'),
(1, 'Sorry / Excuse me',       'Maaf / Maafkan saya',  'Korikot',             'Ko-ri-kot',               'beginner'),
(1, 'Never mind',              'Tidak apa-apa',        'Ando sana',           'An-do sa-na',             'beginner'),
(1, 'See you again',           'Jumpa lagi',           'Kotunud doid',        'Ko-tu-nud doid',          'intermediate'),
(1, 'Have a safe journey',     'Selamat jalan',        'Kopivosian monong',   'Ko-pi-vo-si-an mo-nong',  'intermediate'),
(1, 'Happy birthday',          'Selamat hari jadi',    'Kopivosian tadau nopo','Ko-pi-vo-si-an ta-dau no-po','intermediate'),
(1, 'Sleep well',              'Selamat tidur',        'Kopivuhan koh koilo', 'Ko-pi-vu-han ko-i-lo',    'advanced');

-- ─────────────────────────────────────────────
--  Additional Phrases — Numbers (cat 2)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(2, 'Eleven',   'Sebelas',   'Hopod iso',   'Ho-pod i-so',   'intermediate'),
(2, 'Twenty',   'Dua puluh', 'Duvo hopod',  'Du-vo ho-pod',  'intermediate'),
(2, 'One hundred','Seratus', 'Iso ngatus',  'I-so nga-tus',  'intermediate'),
(2, 'First',    'Pertama',   'Poinso',      'Po-in-so',      'advanced'),
(2, 'Half',     'Setengah',  'Tongohon',    'To-ngo-hon',    'advanced');

-- ─────────────────────────────────────────────
--  Additional Phrases — Family (cat 3)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(3, 'Uncle (father\'s brother)', 'Bapa saudara', 'Mama',       'Ma-ma',         'beginner'),
(3, 'Aunt (mother\'s sister)',   'Ibu saudara',  'Inaon',      'I-na-on',       'beginner'),
(3, 'Cousin',                    'Sepupu',       'Otuud',      'O-tu-ud',       'intermediate'),
(3, 'Son',                       'Anak lelaki',  'Anak Laaki', 'A-nak Laa-ki',  'beginner'),
(3, 'Daughter',                  'Anak perempuan','Anak Vavine','A-nak Va-vi-ne','beginner'),
(3, 'Brother-in-law',            'Abang ipar',   'Mando',      'Man-do',        'advanced'),
(3, 'Sister-in-law',             'Kakak ipar',   'Vavak',      'Va-vak',        'advanced');

-- ─────────────────────────────────────────────
--  Additional Phrases — Food (cat 4)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(4, 'Salt',        'Garam',     'Gadom',      'Ga-dom',      'beginner'),
(4, 'Sugar',       'Gula',      'Tamu',       'Ta-mu',       'beginner'),
(4, 'Egg',         'Telur',     'Hontoluon',  'Hon-to-lu-on','beginner'),
(4, 'Banana',      'Pisang',    'Saging',     'Sa-ging',     'beginner'),
(4, 'Coconut',     'Kelapa',    'Niyog',      'Ni-yog',      'beginner'),
(4, 'Durian',      'Durian',    'Durian',     'Du-ri-an',    'beginner'),
(4, 'I am full',   'Saya kenyang','Nohutom oku','No-hu-tom o-ku','intermediate'),
(4, 'Spicy',       'Pedas',     'Mahaang',    'Ma-ha-ang',   'beginner'),
(4, 'Sweet',       'Manis',     'Minomis',    'Mi-no-mis',   'beginner'),
(4, 'Sour',        'Masam',     'Mosom',      'Mo-som',      'beginner');

-- ─────────────────────────────────────────────
--  Additional Phrases — Nature (cat 5)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(5, 'Sky',      'Langit',   'Langit',    'La-ngit',    'beginner'),
(5, 'Cloud',    'Awan',     'Gubang',    'Gu-bang',    'beginner'),
(5, 'Moon',     'Bulan',    'Bulan',     'Bu-lan',     'beginner'),
(5, 'Star',     'Bintang',  'Bituon',    'Bi-tu-on',   'beginner'),
(5, 'Stone',    'Batu',     'Batu',      'Ba-tu',      'beginner'),
(5, 'Soil/Earth','Tanah',   'Tano',      'Ta-no',      'beginner'),
(5, 'Waterfall','Air terjun','Tanugas',  'Ta-nu-gas',  'intermediate'),
(5, 'Rainbow',  'Pelangi',  'Tanahau',   'Ta-na-hau',  'intermediate'),
(5, 'Sunset',   'Matahari terbenam','Tindangan sada','Tin-da-ngan sa-da','advanced');

-- ─────────────────────────────────────────────
--  Body & Health (cat 9)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(9, 'Head',         'Kepala',       'Ulu',          'U-lu',           'beginner'),
(9, 'Eye',          'Mata',         'Mato',         'Ma-to',          'beginner'),
(9, 'Ear',          'Telinga',      'Talingo',      'Ta-li-ngo',      'beginner'),
(9, 'Nose',         'Hidung',       'Urong',        'U-rong',         'beginner'),
(9, 'Mouth',        'Mulut',        'Baba',         'Ba-ba',          'beginner'),
(9, 'Hand',         'Tangan',       'Tangan',       'Ta-ngan',        'beginner'),
(9, 'Foot / Leg',   'Kaki',         'Witi',         'Wi-ti',          'beginner'),
(9, 'Heart',        'Jantung',      'Pusonon',      'Pu-so-non',      'intermediate'),
(9, 'I am sick',    'Saya sakit',   'Nohubag oku',  'No-hu-bag o-ku', 'intermediate'),
(9, 'I am tired',   'Saya penat',   'Nopizo oku',   'No-pi-zo o-ku',  'intermediate'),
(9, 'Doctor',       'Doktor',       'Doktor',       'Dok-tor',        'beginner'),
(9, 'Medicine',     'Ubat',         'Ubat',         'U-bat',          'beginner');

-- ─────────────────────────────────────────────
--  Colours (cat 10)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(10, 'Red',     'Merah',    'Moiog',     'Mo-iog',    'beginner'),
(10, 'Blue',    'Biru',     'Moihing',   'Mo-i-hing', 'beginner'),
(10, 'Green',   'Hijau',    'Moirup',    'Mo-i-rup',  'beginner'),
(10, 'Yellow',  'Kuning',   'Moiringan', 'Mo-i-ri-ngan','beginner'),
(10, 'White',   'Putih',    'Moputih',   'Mo-pu-tih', 'beginner'),
(10, 'Black',   'Hitam',    'Mohitom',   'Mo-hi-tom', 'beginner'),
(10, 'Brown',   'Coklat',   'Moiritong', 'Mo-i-ri-tong','beginner'),
(10, 'Orange',  'Oren',     'Moransi',   'Mo-ran-si', 'beginner');

-- ─────────────────────────────────────────────
--  Time & Days (cat 11)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(11, 'Today',      'Hari ini',    'Tadau toi',    'Ta-dau toi',    'beginner'),
(11, 'Tomorrow',   'Esok',        'Tadau amu',    'Ta-dau a-mu',   'beginner'),
(11, 'Yesterday',  'Semalam',     'Tadau nabalu', 'Ta-dau na-ba-lu','beginner'),
(11, 'Morning',    'Pagi',        'Kuvosian',     'Ku-vo-si-an',   'beginner'),
(11, 'Afternoon',  'Tengah hari', 'Zopizan',      'Zo-pi-zan',     'beginner'),
(11, 'Night',      'Malam',       'Huvuhan',      'Hu-vu-han',     'beginner'),
(11, 'Monday',     'Isnin',       'Tadau Iso',    'Ta-dau I-so',   'intermediate'),
(11, 'Friday',     'Jumaat',      'Tadau Limo',   'Ta-dau Li-mo',  'intermediate'),
(11, 'Sunday',     'Ahad',        'Tadau Pitu',   'Ta-dau Pi-tu',  'intermediate'),
(11, 'Week',       'Minggu',      'Minggu',       'Ming-gu',       'beginner'),
(11, 'Month',      'Bulan',       'Bulan',        'Bu-lan',        'beginner'),
(11, 'Year',       'Tahun',       'Taun',         'Ta-un',         'beginner');

-- ─────────────────────────────────────────────
--  Weather (cat 12)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(12, 'Hot',        'Panas',       'Mohinopot',    'Mo-hi-no-pot',  'beginner'),
(12, 'Cold',       'Sejuk',       'Moisohit',     'Mo-i-so-hit',   'beginner'),
(12, 'Windy',      'Berangin',    'Moriup',       'Mo-ri-up',      'beginner'),
(12, 'Sunny',      'Cerah',       'Mosilag',      'Mo-si-lag',     'beginner'),
(12, 'Rainy',      'Hujan',       'Mouran',       'Mo-u-ran',      'beginner'),
(12, 'Cloudy',     'Berawan',     'Mogubang',     'Mo-gu-bang',    'beginner'),
(12, 'Flood',      'Banjir',      'Bansil',       'Ban-sil',       'intermediate'),
(12, 'Storm',      'Ribut',       'Ribut',        'Ri-but',        'intermediate');

-- ─────────────────────────────────────────────
--  Feelings & Emotions (cat 13)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(13, 'Happy',      'Gembira',     'Mogisuang',    'Mo-gi-su-ang',  'beginner'),
(13, 'Sad',        'Sedih',       'Moisorob',     'Mo-i-so-rob',   'beginner'),
(13, 'Angry',      'Marah',       'Mogihab',      'Mo-gi-hab',     'beginner'),
(13, 'Scared',     'Takut',       'Mongoingon',   'Mo-ngoi-ngon',  'beginner'),
(13, 'Surprised',  'Terkejut',    'Mongohizon',   'Mo-ngo-hi-zon', 'intermediate'),
(13, 'Proud',      'Bangga',      'Mokuung',      'Mo-ku-ung',     'intermediate'),
(13, 'Lonely',     'Kesepian',    'Nokusai',      'No-ku-sai',     'intermediate'),
(13, 'Excited',    'Teruja',      'Mogisuang nopo','Mo-gi-su-ang no-po','intermediate'),
(13, 'I love you', 'Saya sayang kamu','Koubasanan toko dika','Kou-ba-sa-nan to-ko di-ka','advanced'),
(13, 'I miss you', 'Saya rindu kamu','Nokumaa toku dika','No-ku-maa to-ku di-ka','advanced');

-- ─────────────────────────────────────────────
--  Transport (cat 14)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(14, 'Car',        'Kereta',      'Kereta',       'Ke-re-ta',      'beginner'),
(14, 'Bus',        'Bas',         'Bas',          'Bas',           'beginner'),
(14, 'Boat',       'Bot / Perahu','Parao',        'Pa-ra-o',       'beginner'),
(14, 'Bicycle',    'Basikal',     'Basikal',      'Ba-si-kal',     'beginner'),
(14, 'Walk',       'Berjalan',    'Monong',       'Mo-nong',       'beginner'),
(14, 'Stop',       'Berhenti',    'Montok',       'Mon-tok',       'beginner'),
(14, 'Left',       'Kiri',        'Kawang',       'Ka-wang',       'beginner'),
(14, 'Right',      'Kanan',       'Komoyon',      'Ko-mo-yon',     'beginner'),
(14, 'Straight',   'Terus',       'Montok nopo',  'Mon-tok no-po', 'intermediate'),
(14, 'Far',        'Jauh',        'Monowog',      'Mo-no-wog',     'beginner'),
(14, 'Near / Close','Dekat',      'Mononou',      'Mo-no-nou',     'beginner');

-- ─────────────────────────────────────────────
--  School & Learning (cat 15)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(15, 'School',     'Sekolah',     'Sikul',        'Si-kul',        'beginner'),
(15, 'Teacher',    'Guru',        'Guru',         'Gu-ru',         'beginner'),
(15, 'Student',    'Murid',       'Moginum',      'Mo-gi-num',     'beginner'),
(15, 'Book',       'Buku',        'Buku',         'Bu-ku',         'beginner'),
(15, 'Pencil',     'Pensil',      'Pensil',       'Pen-sil',       'beginner'),
(15, 'Read',       'Baca',        'Moginum',      'Mo-gi-num',     'beginner'),
(15, 'Write',      'Tulis',       'Monsulat',     'Mon-su-lat',    'beginner'),
(15, 'Study',      'Belajar',     'Monginum',     'Mo-ngi-num',    'beginner'),
(15, 'Understand', 'Faham',       'Noingihi',     'No-ingi-hi',    'intermediate'),
(15, 'Question',   'Soalan',      'Tonubu',       'To-nu-bu',      'intermediate'),
(15, 'Answer',     'Jawapan',     'Sinambung',    'Si-nam-bung',   'intermediate');

-- ─────────────────────────────────────────────
--  Market & Shopping (cat 16)
-- ─────────────────────────────────────────────
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(16, 'Market',     'Pasar',       'Tamu',         'Ta-mu',         'beginner'),
(16, 'Buy',        'Beli',        'Mongoli',       'Mo-ngo-li',     'beginner'),
(16, 'Sell',       'Jual',        'Mongomudah',    'Mo-ngo-mu-dah', 'beginner'),
(16, 'Price',      'Harga',       'Patut',         'Pa-tut',        'beginner'),
(16, 'Expensive',  'Mahal',       'Mohaat',        'Mo-ha-at',      'beginner'),
(16, 'Cheap',      'Murah',       'Mohinuang',     'Mo-hi-nu-ang',  'beginner'),
(16, 'How much is this?','Berapa harga ini?','Piga patut toi?','Pi-ga pa-tut toi','beginner'),
(16, 'Money',      'Wang',        'Siling',        'Si-ling',       'beginner'),
(16, 'Change (money)','Baki/Duit baki','Baki',    'Ba-ki',         'intermediate'),
(16, 'Discount',   'Diskaun',     'Kaluasan',      'Ka-lu-a-san',   'intermediate');

-- ═════════════════════════════════════════════
--  NEW QUIZZES (IDs 9–18)
-- ═════════════════════════════════════════════
INSERT INTO quizzes (title, description, difficulty, category_id) VALUES
('Body Parts Quiz',          'Match body part names to their Kadazan translations',        'beginner',     9),
('Colours Challenge',        'Can you name colours in Kadazan?',                           'beginner',     10),
('Time & Days Quiz',         'Match time expressions and days of the week',                'intermediate', 11),
('Weather Words Quiz',       'Match weather conditions in Kadazan',                        'beginner',     12),
('Feelings & Emotions Quiz', 'Express your emotions in Kadazan',                           'intermediate', 13),
('Transport & Directions',   'Navigate and get around in Kadazan',                         'beginner',     14),
('School Vocabulary Quiz',   'Classroom and academic terms in Kadazan',                    'beginner',     15),
('Market & Shopping Quiz',   'Bargain and shop in Kadazan',                                'beginner',     16),
('Advanced Culture Quiz',    'Deep-dive into Kadazan cultural and ceremonial vocabulary',  'advanced',     7),
('Grand Mixed Challenge',    'A comprehensive test across all categories',                 'intermediate', NULL);

-- ─── Quiz 9 — Body Parts ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 9, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 9 AND difficulty = 'beginner' LIMIT 8;

-- ─── Quiz 10 — Colours ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 10, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 10 LIMIT 8;

-- ─── Quiz 11 — Time & Days ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 11, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 11 AND difficulty = 'beginner' LIMIT 8;

-- ─── Quiz 12 — Weather ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 12, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 12 LIMIT 8;

-- ─── Quiz 13 — Emotions ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 13, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 13 AND difficulty IN ('beginner','intermediate') LIMIT 8;

-- ─── Quiz 14 — Transport ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 14, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 14 LIMIT 8;

-- ─── Quiz 15 — School ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 15, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 15 AND difficulty = 'beginner' LIMIT 8;

-- ─── Quiz 16 — Market ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 16, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 16 LIMIT 8;

-- ─── Quiz 17 — Advanced Culture ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 17, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY id)
FROM phrases WHERE category_id = 7 LIMIT 8;

-- ─── Quiz 18 — Grand Mixed Challenge ───
-- Pick 2 phrases from each of 8 categories for a 16-question test
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order)
SELECT 18, id, english, 'en', kadazan, ROW_NUMBER() OVER (ORDER BY category_id, id)
FROM (
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 1  LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 2  LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 3  LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 4  LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 9  LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 10 LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 13 LIMIT 2) UNION ALL
  (SELECT id, english, kadazan, category_id FROM phrases WHERE category_id = 14 LIMIT 2)
) AS sub;

-- ─────────────────────────────────────────────
--  Auto-generate distractors for quizzes 9–18
--  (Uses random other Kadazan words as wrong options)
-- ─────────────────────────────────────────────
INSERT INTO quiz_distractors (question_id, distractor)
SELECT qq.id, p.kadazan
FROM quiz_questions qq
JOIN phrases p ON p.kadazan != qq.answer
WHERE qq.quiz_id BETWEEN 9 AND 18
  AND p.difficulty = 'beginner'
ORDER BY qq.id, RAND()
LIMIT 3
-- NOTE: For production, run a stored procedure or application-level code
-- to insert exactly 3 unique distractors per question. The above is a
-- simplified seed; the API already handles shuffling dynamically.
;

-- Simpler per-question distractor approach (run this instead if the above fails):
-- The backend /api/quizzes/:id/questions endpoint auto-shuffles answers,
-- so distractors can also be seeded manually per quiz if needed.
