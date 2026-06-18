import { useState } from 'react';

export default function useTTS() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const speak = (text) => {
    if (!text || !('speechSynthesis' in window)) {
      setError('TTS tidak tersedia pada pelayar ini');
      return;
    }

    window.speechSynthesis.cancel();
    setLoading(true);
    setError(null);

    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = 0.82;
    utt.pitch = 1;

    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const malay  = voices.find(v => v.lang.startsWith('ms'));
      if (malay) utt.voice = malay;
      window.speechSynthesis.speak(utt);
    };

    // voices may not be loaded yet on first call
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        applyVoice();
      };
    } else {
      applyVoice();
    }

    utt.onend   = () => setLoading(false);
    utt.onerror = () => { setLoading(false); setError('TTS gagal'); };
  };

  return { speak, loading, error };
}
