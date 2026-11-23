import { useState } from 'react';
import { Check, Pencil, RefreshCw, Sparkles } from 'lucide-react';

export default function RecommendationControl({ kind, context, onUse, label = 'Recommend for me', getRecommendation }) {
  const [state, setState] = useState('idle');
  const [suggestion, setSuggestion] = useState('');

  const recommend = () => {
    setState('loading');
    window.setTimeout(() => {
      setSuggestion(getRecommendation(kind, context));
      setState('ready');
    }, 250);
  };

  if (state === 'idle') {
    return <button type="button" className="recommend-button" onClick={recommend}><Sparkles size={14} /> {label}</button>;
  }

  if (state === 'loading') return <span className="recommend-loading">Analyzing your requirements...</span>;

  return state === 'editing' ? (
    <div className="recommendation-card" role="status">
      <textarea value={suggestion} onChange={(event) => setSuggestion(event.target.value)} aria-label="Edit recommendation" rows={3} />
      <div className="recommendation-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => { onUse(suggestion); setState('idle'); }}><Check size={14} /> Use edited recommendation</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setState('ready')}>Cancel</button>
      </div>
    </div>
  ) : (
    <div className="recommendation-card" role="status">
      <p>{suggestion}</p>
      <div className="recommendation-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => { onUse(suggestion); setState('idle'); }}><Check size={14} /> Use recommendation</button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setState('editing')}><Pencil size={14} /> Edit</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={recommend}><RefreshCw size={14} /> Choose another</button>
      </div>
    </div>
  );
}