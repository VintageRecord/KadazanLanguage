-- Kadazan (Penampang) Language Learning Platform
-- MySQL Schema

CREATE DATABASE IF NOT EXISTS kadazan_language CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kadazan_language;

-- ─────────────────────────────────────────────
--  Categories
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name_en     VARCHAR(200) NOT NULL,
  name_ms     VARCHAR(200) NOT NULL,
  description TEXT,
  icon        VARCHAR(100),
  sort_order  TINYINT UNSIGNED DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
--  Phrases
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS phrases (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id     INT UNSIGNED NOT NULL,
  english         VARCHAR(500) NOT NULL,
  malay           VARCHAR(500) NOT NULL,
  kadazan         VARCHAR(500) NOT NULL,
  romanization    VARCHAR(500),          -- phonetic guide
  audio_url       VARCHAR(500),
  difficulty      ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  notes           TEXT,                  -- cultural or usage notes
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_difficulty (difficulty),
  INDEX idx_category   (category_id)
);

-- ─────────────────────────────────────────────
--  Quizzes
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(300) NOT NULL,
  description TEXT,
  difficulty  ENUM('beginner','intermediate','advanced') NOT NULL DEFAULT 'beginner',
  category_id INT UNSIGNED,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ─────────────────────────────────────────────
--  Quiz Questions  (matching style)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_questions (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quiz_id     INT UNSIGNED NOT NULL,
  phrase_id   INT UNSIGNED,             -- optional link to phrases table
  prompt      VARCHAR(500) NOT NULL,    -- text shown to user (English or Malay)
  prompt_lang ENUM('en','ms') NOT NULL DEFAULT 'en',
  answer      VARCHAR(500) NOT NULL,    -- correct Kadazan answer
  sort_order  SMALLINT UNSIGNED DEFAULT 0,
  FOREIGN KEY (quiz_id)   REFERENCES quizzes(id)  ON DELETE CASCADE,
  FOREIGN KEY (phrase_id) REFERENCES phrases(id)  ON DELETE SET NULL,
  INDEX idx_quiz (quiz_id)
);

-- ─────────────────────────────────────────────
--  Distractors  (wrong answer options per question)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_distractors (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  question_id INT UNSIGNED NOT NULL,
  distractor  VARCHAR(500) NOT NULL,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
--  User Progress  (optional – for future auth)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_progress (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id   VARCHAR(128) NOT NULL,
  quiz_id      INT UNSIGNED NOT NULL,
  score        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  total        TINYINT UNSIGNED NOT NULL DEFAULT 0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  INDEX idx_session (session_id)
);

-- ═════════════════════════════════════════════
--  SEED DATA
-- ═════════════════════════════════════════════

INSERT INTO categories (slug, name_en, name_ms, description, icon, sort_order) VALUES
('greetings',    'Greetings & Courtesy',  'Salam & Budi Bahasa', 'Everyday greetings and polite expressions',      'hand-wave',    1),
('numbers',      'Numbers & Counting',    'Nombor & Mengira',    'Cardinal and ordinal numbers',                   'calculator',   2),
('family',       'Family & Relationships','Keluarga & Hubungan', 'Family members and relationship terms',          'users',        3),
('food',         'Food & Drink',          'Makanan & Minuman',   'Common food, drinks and dining phrases',         'utensils',     4),
('nature',       'Nature & Environment',  'Alam & Persekitaran', 'Natural world, animals, plants',                 'leaf',         5),
('daily-life',   'Daily Life',            'Kehidupan Harian',    'Common everyday phrases and activities',         'sun',          6),
('culture',      'Culture & Tradition',   'Budaya & Tradisi',    'Cultural phrases, festivals and customs',        'star',         7),
('questions',    'Questions & Responses', 'Soalan & Jawapan',    'Asking and answering common questions',          'help-circle',  8);

-- ─── Greetings ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(1, 'Good morning',                   'Selamat pagi',            'Kopivosian',              'Ko-pi-vo-si-an',         'beginner'),
(1, 'Good afternoon',                 'Selamat tengah hari',     'Kopizopizan',             'Ko-pi-zo-pi-zan',        'beginner'),
(1, 'Good evening / Good night',      'Selamat malam',           'Kopivuhan',               'Ko-pi-vu-han',           'beginner'),
(1, 'Welcome',                        'Selamat datang',          'Kopivosian om tulun nopo','Ko-pi-vo-si-an',         'beginner'),
(1, 'Thank you',                      'Terima kasih',            'Kopio',                   'Ko-pi-o',                'beginner'),
(1, 'You are welcome',                'Sama-sama',               'Kopio tadau',             'Ko-pi-o ta-dau',         'beginner'),
(1, 'How are you?',                   'Apa khabar?',             'Mongihai kuh dika?',      'Mon-gi-hai ku di-ka',    'beginner'),
(1, 'I am fine',                      'Saya sihat',              'Osonong ku',              'O-so-nong ku',           'beginner'),
(1, 'My name is …',                   'Nama saya …',             'Ngokou ngu …',            'Ngo-kou ngu',            'beginner'),
(1, 'What is your name?',             'Siapa nama kamu?',        'Iso nopo ngaran dika?',   'I-so no-po nga-ran di-ka','beginner');

-- ─── Numbers ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(2, 'One',   'Satu',   'Iso',      'I-so',       'beginner'),
(2, 'Two',   'Dua',    'Duvo',     'Du-vo',      'beginner'),
(2, 'Three', 'Tiga',   'Tolu',     'To-lu',      'beginner'),
(2, 'Four',  'Empat',  'Apat',     'A-pat',      'beginner'),
(2, 'Five',  'Lima',   'Limo',     'Li-mo',      'beginner'),
(2, 'Six',   'Enam',   'Onom',     'O-nom',      'beginner'),
(2, 'Seven', 'Tujuh',  'Pitu',     'Pi-tu',      'beginner'),
(2, 'Eight', 'Lapan',  'Walu',     'Wa-lu',      'beginner'),
(2, 'Nine',  'Sembilan','Siam',    'Si-am',      'beginner'),
(2, 'Ten',   'Sepuluh','Hopod',    'Ho-pod',     'beginner');

-- ─── Family ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(3, 'Mother',          'Ibu',          'Tina',      'Ti-na',       'beginner'),
(3, 'Father',          'Bapa',         'Tama',      'Ta-ma',       'beginner'),
(3, 'Older brother',   'Abang',        'Odu',       'O-du',        'beginner'),
(3, 'Older sister',    'Kakak',        'Adi',       'A-di',        'beginner'),
(3, 'Younger sibling', 'Adik',         'Andi',      'An-di',       'beginner'),
(3, 'Grandfather',     'Datuk',        'Apu Laaki', 'A-pu Laa-ki', 'intermediate'),
(3, 'Grandmother',     'Nenek',        'Apu Vavine','A-pu Va-vi-ne','intermediate'),
(3, 'Child',           'Anak',         'Anak',      'A-nak',       'beginner'),
(3, 'Husband',         'Suami',        'Asawa Laaki','A-sa-wa Laa-ki','intermediate'),
(3, 'Wife',            'Isteri',       'Asawa Vavine','A-sa-wa Va-vi-ne','intermediate');

-- ─── Food & Drink ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(4, 'Rice (cooked)',    'Nasi',          'Ninom',     'Ni-nom',      'beginner'),
(4, 'Rice (uncooked)', 'Beras',         'Parai',     'Pa-rai',      'beginner'),
(4, 'Water',           'Air',           'Wodom',     'Wo-dom',      'beginner'),
(4, 'Fish',            'Ikan',          'Sada',      'Sa-da',       'beginner'),
(4, 'Chicken',         'Ayam',          'Manuk',     'Ma-nuk',      'beginner'),
(4, 'Vegetable',       'Sayur',         'Tangatang', 'Tang-a-tang', 'beginner'),
(4, 'Delicious',       'Sedap / Lazat', 'Minomis',   'Mi-no-mis',   'beginner'),
(4, 'I am hungry',     'Saya lapar',    'Narapi oku','Na-ra-pi o-ku','intermediate'),
(4, 'I am thirsty',    'Saya dahaga',   'Namohok oku','Na-mo-hok o-ku','intermediate'),
(4, 'Let us eat',      'Jom makan',     'Kito mangan','Ki-to ma-ngan','intermediate');

-- ─── Nature ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(5, 'Mountain',  'Gunung',  'Gayo',    'Ga-yo',   'beginner'),
(5, 'River',     'Sungai',  'Suvou',   'Su-vou',  'beginner'),
(5, 'Sea / Ocean','Laut',   'Tasik',   'Ta-sik',  'beginner'),
(5, 'Tree',      'Pokok',   'Kahoy',   'Ka-hoy',  'beginner'),
(5, 'Rain',      'Hujan',   'Uran',    'U-ran',   'beginner'),
(5, 'Sun',       'Matahari','Sada',    'Sa-da',   'beginner'),
(5, 'Wind',      'Angin',   'Riup',    'Ri-up',   'beginner'),
(5, 'Flower',    'Bunga',   'Bunga',   'Bung-a',  'beginner'),
(5, 'Bird',      'Burung',  'Manuk',   'Ma-nuk',  'beginner'),
(5, 'Forest',    'Hutan',   'Hutan',   'Hu-tan',  'intermediate');

-- ─── Daily Life ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(6, 'House / Home',   'Rumah',       'Hamin',        'Ha-min',         'beginner'),
(6, 'Village',        'Kampung',     'Kobpinampang',  'Kob-pi-nam-pang','intermediate'),
(6, 'Road / Path',    'Jalan',       'Dalan',         'Da-lan',         'beginner'),
(6, 'I want to go',   'Saya nak pergi','Ouhait ku monong','Ou-hait ku mo-nong','intermediate'),
(6, 'Where are you going?','Hendak ke mana?','Nunu poingon dika?','Nu-nu po-ing-on di-ka','intermediate'),
(6, 'Come here',      'Ke sini',     'Kito diti',     'Ki-to di-ti',    'beginner'),
(6, 'Wait a moment',  'Tunggu sekejap','Nantad iso',  'Nan-tad i-so',   'intermediate'),
(6, 'I do not know',  'Saya tidak tahu','Ontok ku',   'On-tok ku',      'beginner'),
(6, 'I understand',   'Saya faham',  'Noingihi ku',   'No-ingi-hi ku',  'intermediate'),
(6, 'Please repeat',  'Tolong ulang','Agarai poh',    'A-ga-rai poh',   'advanced');

-- ─── Culture ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(7, 'Harvest festival','Pesta menuai','Kaamatan',  'Ka-a-ma-tan',   'beginner'),
(7, 'Traditional dance','Tarian tradisional','Sumazau','Su-ma-zau', 'beginner'),
(7, 'Traditional rice wine','Tapai / Tuak','Lihing','Li-hing',    'beginner'),
(7, 'Blessing / Ceremony','Upacara berkat','Monogit','Mo-no-git',  'intermediate'),
(7, 'Spirit / Soul',  'Semangat / Roh','Rogon',   'Ro-gon',        'advanced'),
(7, 'Ceremonial elder','Pembesar adat','Bobolian','Bo-bo-li-an',   'intermediate'),
(7, 'Traditional costume','Pakaian tradisional','Pakaian Kadazan','Pa-ka-i-an Ka-da-zan','beginner'),
(7, 'Unity / Together','Bersatu / Bersama','Koposikou','Ko-po-si-kou','intermediate');

-- ─── Questions ───
INSERT INTO phrases (category_id, english, malay, kadazan, romanization, difficulty) VALUES
(8, 'What?',   'Apa?',     'Nunu?',    'Nu-nu',   'beginner'),
(8, 'Who?',    'Siapa?',   'Iso?',     'I-so',    'beginner'),
(8, 'Where?',  'Di mana?', 'Nunu toi?','Nu-nu toi','beginner'),
(8, 'When?',   'Bila?',    'Tokou?',   'To-kou',  'beginner'),
(8, 'Why?',    'Kenapa?',  'Nokot?',   'No-kot',  'beginner'),
(8, 'How?',    'Macam mana?','Mongihai?','Mon-gi-hai','beginner'),
(8, 'How much?','Berapa?', 'Piga?',    'Pi-ga',   'beginner'),
(8, 'Yes',     'Ya',       'Oo',       'O-o',     'beginner'),
(8, 'No',      'Tidak',    'Koh',      'Ko-h',    'beginner');

-- ─────────────────────────────────────────────
--  Quizzes
-- ─────────────────────────────────────────────
INSERT INTO quizzes (title, description, difficulty, category_id) VALUES
('Greetings Matching Quiz',     'Match English greetings to their Kadazan equivalents',  'beginner',     1),
('Numbers Challenge',           'Match numbers 1–10 in Kadazan',                          'beginner',     2),
('Family Members Quiz',         'Identify Kadazan words for family members',              'intermediate', 3),
('Food & Drink Matching',       'Match common food and drink phrases',                    'beginner',     4),
('Nature & Environment Quiz',   'Match nature words to Kadazan',                          'beginner',     5),
('Daily Life Phrases',          'Everyday phrases matching quiz',                         'intermediate', 6),
('Culture & Tradition Quiz',    'Match cultural terms to their Kadazan equivalents',      'intermediate', 7),
('Mixed Beginner Challenge',    'A mix of beginner phrases from all categories',          'beginner',     NULL);

-- ─── Quiz 1 questions (Greetings) ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order) VALUES
(1,  1,  'Good morning',              'en', 'Kopivosian',    1),
(1,  3,  'Good evening / Good night', 'en', 'Kopivuhan',     2),
(1,  5,  'Thank you',                 'en', 'Kopio',         3),
(1,  7,  'How are you?',              'en', 'Mongihai kuh dika?', 4),
(1,  8,  'I am fine',                 'en', 'Osonong ku',    5);

-- Distractors for quiz 1
INSERT INTO quiz_distractors (question_id, distractor) VALUES
(1,'Kopivuhan'),(1,'Kopizopizan'),(1,'Kopio'),
(2,'Kopivosian'),(2,'Kopio'),(2,'Kopizopizan'),
(3,'Kopivosian'),(3,'Kopivuhan'),(3,'Osonong ku'),
(4,'Osonong ku'),(4,'Kopio'),(4,'Kopivosian'),
(5,'Kopio'),(5,'Mongihai kuh dika?'),(5,'Ngokou ngu');

-- ─── Quiz 2 questions (Numbers) ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order) VALUES
(2, 11, 'One',   'en', 'Iso',   1),
(2, 12, 'Two',   'en', 'Duvo',  2),
(2, 13, 'Three', 'en', 'Tolu',  3),
(2, 14, 'Four',  'en', 'Apat',  4),
(2, 15, 'Five',  'en', 'Limo',  5),
(2, 16, 'Six',   'en', 'Onom',  6),
(2, 17, 'Seven', 'en', 'Pitu',  7),
(2, 18, 'Eight', 'en', 'Walu',  8),
(2, 19, 'Nine',  'en', 'Siam',  9),
(2, 20, 'Ten',   'en', 'Hopod', 10);

-- Distractors for quiz 2
INSERT INTO quiz_distractors (question_id, distractor) VALUES
(6,'Duvo'),(6,'Tolu'),(6,'Apat'),
(7,'Iso'),(7,'Tolu'),(7,'Limo'),
(8,'Duvo'),(8,'Apat'),(8,'Onom'),
(9,'Tolu'),(9,'Limo'),(9,'Pitu'),
(10,'Apat'),(10,'Onom'),(10,'Walu'),
(11,'Limo'),(11,'Pitu'),(11,'Siam'),
(12,'Onom'),(12,'Walu'),(12,'Hopod'),
(13,'Pitu'),(13,'Siam'),(13,'Iso'),
(14,'Walu'),(14,'Hopod'),(14,'Duvo'),
(15,'Siam'),(15,'Iso'),(15,'Tolu');

-- ─── Quiz 8 (Mixed Beginner) ───
INSERT INTO quiz_questions (quiz_id, phrase_id, prompt, prompt_lang, answer, sort_order) VALUES
(8,  1,  'Good morning',          'en', 'Kopivosian',   1),
(8,  5,  'Thank you',             'en', 'Kopio',        2),
(8, 11,  'One',                   'en', 'Iso',          3),
(8, 21,  'Mother',                'en', 'Tina',         4),
(8, 22,  'Father',                'en', 'Tama',         5),
(8, 31,  'Rice (cooked)',         'en', 'Ninom',        6),
(8, 33,  'Water',                 'en', 'Wodom',        7),
(8, 51,  'House / Home',          'en', 'Hamin',        8),
(8, 59,  'Harvest festival',      'en', 'Kaamatan',     9),
(8, 68,  'Yes',                   'en', 'Oo',           10);

-- Distractors for quiz 8
INSERT INTO quiz_distractors (question_id, distractor) VALUES
(16,'Kopio'),(16,'Kopivuhan'),(16,'Osonong ku'),
(17,'Kopivosian'),(17,'Kopivuhan'),(17,'Ngokou ngu'),
(18,'Duvo'),(18,'Tolu'),(18,'Apat'),
(19,'Tama'),(19,'Andu'),(19,'Odi'),
(20,'Tina'),(20,'Apu Laaki'),(20,'Andi'),
(21,'Wodom'),(21,'Sada'),(21,'Parai'),
(22,'Ninom'),(22,'Parai'),(22,'Sada'),
(23,'Kobpinampang'),(23,'Dalan'),(23,'Kahoy'),
(24,'Sumazau'),(24,'Lihing'),(24,'Bobolian'),
(25,'Koh'),(25,'Nunu?'),(25,'Kopio');
