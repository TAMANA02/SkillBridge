import { AlertTriangle } from 'lucide-react';

export default function ErrorState({ title = 'Something went wrong', description = 'Please try again.', onRetry }) {
  return (
    <div className="state-block error">
      <div className="state-icon"><AlertTriangle size={20} /></div>
      <h4>{title}</h4>
      <p>{description}</p>
      {onRetry && (
        <button type="button" className="btn btn-outline btn-sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
