import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const SpeechRecognitionImpl =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * Recreates the original site's voice-navigation feature as a React hook.
 * Commands now drive React Router navigation instead of anchor scrolling,
 * since each former in-page section is now its own route.
 */
export function useVoiceNavigation() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const goToSection = useCallback((path, hash) => {
    navigate(path);
    if (hash) {
      window.setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  }, [navigate]);

  const handleCommand = useCallback((transcript) => {
    const command = transcript.toLowerCase();

    if (/open home|go home/.test(command)) { goToSection('/'); showToast('Opening home'); return; }
    if (/open services|services/.test(command)) { goToSection('/services'); showToast('Opening services'); return; }
    if (/open about|about/.test(command)) { goToSection('/', '#about'); showToast('Opening about'); return; }
    if (/open contact|contact/.test(command)) { goToSection('/', '#contact'); showToast('Opening contact'); return; }
    if (/open login|login/.test(command)) { goToSection('/login'); showToast('Opening login'); return; }
    if (/open student registration/.test(command)) { goToSection('/signup?role=student'); showToast('Opening student registration'); return; }
    if (/open client registration/.test(command)) { goToSection('/signup?role=client'); showToast('Opening client registration'); return; }
    if (/open student dashboard/.test(command)) { goToSection('/student/dashboard'); showToast('Opening student dashboard'); return; }
    if (/open client dashboard/.test(command)) { goToSection('/client/dashboard'); showToast('Opening client dashboard'); return; }
    if (/open project showcase|project showcase|showcase/.test(command)) { goToSection('/', '#showcase'); showToast('Opening project showcase'); return; }
    if (/open smart search/.test(command)) { goToSection('/', '#search'); showToast('Opening smart search'); return; }
    if (/open hall of fame/.test(command)) { goToSection('/', '#leaderboard'); showToast('Opening hall of fame'); return; }
    if (/open ai project completion/.test(command)) { goToSection('/ai-project-completion'); showToast('Opening AI project controls'); return; }
    if (/open profile/.test(command)) { goToSection('/student/profile'); showToast('Opening profile'); return; }
    if (/open settings/.test(command)) { goToSection('/client/dashboard'); showToast('Opening settings'); return; }
    if (/go back/.test(command)) { navigate(-1); showToast('Going back'); return; }
    if (/scroll down/.test(command)) { window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }); showToast('Scrolling down'); return; }
    if (/scroll up/.test(command)) { window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' }); showToast('Scrolling up'); return; }
    if (/refresh page/.test(command)) { showToast('Refreshing page'); window.location.reload(); return; }

    showToast(`Heard: "${transcript}". Command not recognized.`, 3200);
  }, [goToSection, navigate, showToast]);

  const toggleListening = useCallback(() => {
    if (!SpeechRecognitionImpl) {
      showToast('Speech recognition is not supported in this browser.', 2600);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      showToast('Voice navigation stopped.');
      return;
    }

    const recognition = new SpeechRecognitionImpl();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join(' ');
      handleCommand(transcript);
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      showToast('Voice recognition failed.');
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    showToast('Voice navigation started.');
  }, [listening, handleCommand, showToast]);

  const supported = useMemo(() => Boolean(SpeechRecognitionImpl), []);

  return { listening, toggleListening, supported };
}
