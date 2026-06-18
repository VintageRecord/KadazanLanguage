import { useState, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function useTTS() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const audioRef  = useRef(null);

  const speakFallback = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate  = 0.82;
    utt.pitch = 1;
    const applyVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const malay  = voices.find(v => v.lang.startsWith('ms'));
      if (malay) utt.voice = malay;
      window.speechSynthesis.speak(utt);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        applyVoice();
      };
    } else {
      applyVoice();
    }
  };

  const speak = async (text) => {
    if (!text) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API}/tts`, { text });
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => { audioRef.current = null; setLoading(false); };
      audio.onerror = () => { audioRef.current = null; setLoading(false); };
    } catch {
      speakFallback(text);
      setLoading(false);
    }
  };

  return { speak, loading, error };
}
