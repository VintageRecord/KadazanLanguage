const express = require('express');
const router  = express.Router();
const https   = require('https');

// POST /api/tts
// Body: { text: "Kopivosian", languageCode: "ms-MY" }
// Returns: { audioContent: "<base64 mp3>" }
router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'TTS API key not configured' });
  }

  const payload = JSON.stringify({
    input:       { text: text.trim() },
    voice:       { languageCode: 'ms-MY', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85, pitch: 0 },
  });

  const options = {
    hostname: 'texttospeech.googleapis.com',
    path:     `/v1/text:synthesize?key=${apiKey}`,
    method:   'POST',
    headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: 'Google TTS error', detail: data });
      }
      try {
        const parsed = JSON.parse(data);
        res.json({ audioContent: parsed.audioContent });
      } catch {
        res.status(500).json({ error: 'Failed to parse TTS response' });
      }
    });
  });

  request.on('error', (err) => res.status(500).json({ error: err.message }));
  request.write(payload);
  request.end();
});

module.exports = router;
