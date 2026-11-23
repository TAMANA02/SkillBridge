import Modal from './Modal';
import { voiceCommands } from '../data/mockData';

export default function VoiceHelpModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} eyebrow="Voice Commands" title="Voice Commands">
      <div className="voice-commands-grid">
        {voiceCommands.map((command) => (
          <div key={command} className="voice-command-card">{command}</div>
        ))}
      </div>
    </Modal>
  );
}
