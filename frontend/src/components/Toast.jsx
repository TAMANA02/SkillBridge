import { Mic } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Toast() {
  const { message, visible } = useToast();

  return (
    <div className={`toast ${visible ? 'toast-visible' : ''}`}>
      <div className="toast-content">
        <Mic size={16} />
        <span>{message}</span>
      </div>
    </div>
  );
}
