import { useState, useRef } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function useTTS() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const audioRef = useRef(null);

  const speak = async (text) => {
    if (!text) return;

    // Stop any currently playing audio
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
      audio.onended = () => { audioRef.current = null; };
    } catch (err) {
      // Fallback to Web Speech API if backend TTS fails
      if ('speechSynthesis' in window) {
        const utt = new SpeechSynthesisUtterance(text);
        // Prefer Malay voice as phonetically closest to Kadazan
        const voices = window.speechSynthesis.getVoices();
        const malay  = voices.find(v => v.lang.startsWith('ms'));
        if (malay) utt.voice = malay;
        utt.rate  = 0.85;
        utt.pitch = 1;
        window.speechSynthesis.speak(utt);
      } else {
        setError('TTS unavailable');
      }
    } finally {
      setLoading(false);
    }
  };

  return { speak, loading, error };
}
