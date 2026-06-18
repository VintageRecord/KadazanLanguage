const express = require('express');
const router  = express.Router();
const https   = require('https');
const { GoogleAuth } = require('google-auth-library');

const auth = new GoogleAuth({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// POST /api/tts
// Body: { text: "Kopivosian" }
// Returns: { audioContent: "<base64 mp3>" }
router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }

  try {
    const client      = await auth.getClient();
    const tokenResult = await client.getAccessToken();
    const token       = tokenResult.token;

    const payload = JSON.stringify({
      input:       { text: text.trim() },
      voice:       { languageCode: 'fil-PH', name: 'fil-PH-Wavenet-A', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.82, pitch: 0 },
    });

    const options = {
      hostname: 'texttospeech.googleapis.com',
      path:     '/v1/text:synthesize',
      method:   'POST',
      headers:  {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(payload),
      },
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

  } catch (err) {
    res.status(500).json({ error: 'Auth failed', detail: err.message });
  }
});

module.exports = router;
