import VoiceInput from './VoiceInput';

export default function VoiceSearchButton({ onResult }) {
  return <VoiceInput onResult={onResult} label="Describe your project by voice" />;
}
