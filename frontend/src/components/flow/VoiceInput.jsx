import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function VoiceInput({ onResult, label = 'Use microphone' }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(onResult);
  const { showToast } = useToast();

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => onResultRef.current(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      showToast(event.error === 'not-allowed' ? 'Microphone permission was denied.' : 'Voice input could not hear that. Try again.');
    };
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, [showToast]);

  const toggle = () => {
    if (!recognitionRef.current) {
      showToast('Voice input is not supported in this browser.');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      showToast('Voice input is already active.');
    }
  };

  return (
    <button
      type="button"
      className={`icon-button voice-input-button ${listening ? 'voice-active' : ''}`}
      onClick={toggle}
      aria-label={listening ? 'Stop microphone' : label}
      title={listening ? 'Listening... click to stop' : label}
    >
      {listening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
}