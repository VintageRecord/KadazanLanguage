require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const adminRoute   = require('./routes/admin');
const phrasesRoute = require('./routes/phrases');
const quizzesRoute = require('./routes/quizzes');
const ttsRoute     = require('./routes/tts');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/admin',   adminRoute);
app.use('/api/phrases', phrasesRoute);
app.use('/api/quizzes', quizzesRoute);
app.use('/api/tts',     ttsRoute);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Kadazan API running on http://localhost:${PORT}`));
