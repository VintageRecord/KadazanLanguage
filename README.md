# Bahasa Kadazan Penampang — Language Learning Platform

A full-stack web platform for learning and preserving the Kadazan (Penampang) language of Sabah, Malaysia.

## Project Structure

```
├── schema.sql          # MySQL schema + seed data
├── backend/            # Node.js / Express REST API
│   ├── src/
│   │   ├── index.js
│   │   ├── db/pool.js
│   │   ├── routes/phrases.js
│   │   ├── routes/quizzes.js
│   │   └── middleware/errorHandler.js
│   ├── .env.example
│   └── package.json
└── frontend/           # React + Vite + Tailwind CSS
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── PhraseCard.jsx
    │   │   └── HeroCarousel.jsx
    │   └── pages/
    │       ├── HomePage.jsx
    │       ├── LearnPage.jsx
    │       ├── QuizzesPage.jsx
    │       └── QuizPage.jsx
    └── package.json
```

## Quick Start

### 1. Database

```bash
mysql -u root -p < schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # fill in DB credentials
npm install
npm run dev            # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev            # http://localhost:5173
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/phrases` | List phrases (filters: `category`, `difficulty`, `page`, `limit`) |
| GET | `/api/phrases/categories` | List all categories |
| GET | `/api/phrases/:id` | Single phrase |
| GET | `/api/quizzes` | List all quizzes |
| GET | `/api/quizzes/:id` | Quiz metadata |
| GET | `/api/quizzes/:id/questions` | Questions with shuffled options |
| POST | `/api/quizzes/:id/validate` | Submit answers, get score |

## Features

- **70+ phrases** across 8 categories (greetings, numbers, family, food, nature, daily life, culture, questions)
- **8 interactive matching quizzes** with instant scoring and answer review
- Responsive design matching the Sabah cultural aesthetic (deep greens, earth tones)
- Floating navbar with transparent hero mode
- Hero carousel with cultural imagery
- Offline-friendly: frontend falls back to mock data if the API is unavailable
- Phrase cards with Kadazan text, Malay translation, and phonetic romanization
