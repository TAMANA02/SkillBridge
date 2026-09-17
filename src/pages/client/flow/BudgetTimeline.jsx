import { useNavigate } from 'react-router-dom';
import FlowStepper from '../../../components/flow/FlowStepper';
import VoiceInput from '../../../components/flow/VoiceInput';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { BUDGET_TIERS, TIMELINE_OPTIONS } from '../../../data/flowTemplates';

const STEPS = ['Describe', 'Clarify', 'Requirements', 'Budget', 'Review'];

export default function BudgetTimeline() {
  const { draft, updateDraft } = useProjectFlow();
  const navigate = useNavigate();
  const { budget, timeline, extra } = draft;

  const setBudget = (patch) => updateDraft({ budget: { ...budget, ...patch } });
  const setTimeline = (patch) => updateDraft({ timeline: { ...timeline, ...patch } });
  const setExtra = (patch) => updateDraft({ extra: { ...extra, ...patch } });

  const onFiles = (e) => {
    const names = Array.from(e.target.files || []).map((f) => f.name);
    setExtra({ attachments: [...extra.attachments, ...names] });
  };

  const canContinue = budget.tier && timeline.option;

  return (
    <div className="flow-shell">
      <FlowStepper steps={STEPS} currentIndex={3} />

      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Budget & timeline</span>
          <h2>What's your budget and deadline?</h2>
          <p>This locks in early so it can't shift once a developer is agreed and working.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="step-panel-title">Budget</h3>
        <div className="chip-row" style={{ marginBottom: budget.tier === 'custom' ? '0.9rem' : 0 }}>
          {BUDGET_TIERS.map((tier) => (
            <button key={tier.id} type="button" className={`chip ${budget.tier === tier.id ? 'active' : ''}`} onClick={() => setBudget({ tier: tier.id })}>
              {tier.label}
            </button>
          ))}
        </div>
        {budget.tier === 'custom' && (
          <div className="field-group" style={{ maxWidth: 280 }}>
            <label>Custom amount</label>
            <input value={budget.custom} onChange={(e) => setBudget({ custom: e.target.value })} placeholder="\u20b935,000" />
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h3 className="step-panel-title">Expected delivery</h3>
        <div className="chip-row" style={{ marginBottom: timeline.option === 'custom' ? '0.9rem' : 0 }}>
          {TIMELINE_OPTIONS.map((opt) => (
            <button key={opt.id} type="button" className={`chip ${timeline.option === opt.id ? 'active' : ''}`} onClick={() => setTimeline({ option: opt.id })}>
              {opt.label}
            </button>
          ))}
        </div>
        {timeline.option === 'custom' && (
          <div className="field-group" style={{ maxWidth: 280 }}>
            <label>Delivery date</label>
            <input type="date" value={timeline.customDate} onChange={(e) => setTimeline({ customDate: e.target.value })} />
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="step-panel-title">Additional preferences</h3>
        <div className="field-grid">
          <div className="field-group">
            <label>Communication preference</label>
            <select value={extra.communicationPref} onChange={(e) => setExtra({ communicationPref: e.target.value })}>
              <option value="chat">In-app chat</option>
              <option value="email">Email</option>
              <option value="calls">Scheduled calls</option>
            </select>
          </div>
          <div className="field-group">
            <label>Priority</label>
            <select value={extra.priority} onChange={(e) => setExtra({ priority: e.target.value })}>
              <option value="standard">Standard</option>
              <option value="urgent">Urgent</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="field-group">
            <label>Expected quality level</label>
            <select value={extra.quality} onChange={(e) => setExtra({ quality: e.target.value })}>
              <option value="production-ready">Production-ready</option>
              <option value="prototype">Prototype / MVP</option>
              <option value="polished">Polished, portfolio-grade</option>
            </select>
          </div>
          <div className="field-group full">
            <label>Additional instructions</label>
            <div className="voice-field-input">
              <textarea rows={2} value={extra.instructions} onChange={(e) => setExtra({ instructions: e.target.value })} placeholder="Anything else the developer should know" aria-label="Additional instructions" />
              <VoiceInput onResult={(transcript) => setExtra({ instructions: extra.instructions ? `${extra.instructions} ${transcript}` : transcript })} label="Speak additional instructions" />
            </div>
          </div>
          <div className="field-group full">
            <label>Attachments / reference files</label>
            <input type="file" multiple onChange={onFiles} />
            {extra.attachments.length > 0 && (
              <div className="chip-row" style={{ marginTop: '0.6rem' }}>
                {extra.attachments.map((name) => <span key={name} className="chip">{name}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-muted" onClick={() => navigate('/client/new-project/requirements')}>Back</button>
        <button type="button" className="btn btn-primary" disabled={!canContinue} onClick={() => navigate('/client/new-project/review')}>
          Review requirement packet
        </button>
      </div>
    </div>
  );
}
