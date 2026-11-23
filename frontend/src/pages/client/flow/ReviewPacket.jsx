import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import FlowStepper from '../../../components/flow/FlowStepper';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { BUDGET_TIERS, TIMELINE_OPTIONS } from '../../../data/flowTemplates';

const STEPS = ['Describe', 'Clarify', 'Requirements', 'Budget', 'Review'];

const PACKET_STAGES = ['Original requirement', 'AI clarification', 'Confirmed requirements', 'Design preferences', 'Budget', 'Timeline', 'Structured project packet'];

export default function ReviewPacket() {
  const { draft, submitPacket } = useProjectFlow();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const confirmedFeatures = Object.entries(draft.clarification.answers)
    .filter(([, v]) => v === true)
    .map(([id]) => draft.clarification.plan.find((p) => p.id === id)?.tag)
    .filter(Boolean);

  const budgetLabel = draft.budget.tier === 'custom' ? draft.budget.custom : BUDGET_TIERS.find((t) => t.id === draft.budget.tier)?.label;
  const timelineLabel = draft.timeline.option === 'custom' ? draft.timeline.customDate : TIMELINE_OPTIONS.find((t) => t.id === draft.timeline.option)?.label;

  const handleSubmit = async () => {
    setSubmitting(true);
    const id = await submitPacket();
    navigate(`/client/projects/${id}/matches`);
  };

  return (
    <div className="flow-shell">
      <FlowStepper steps={STEPS} currentIndex={4} />

      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Requirement packet</span>
          <h2>Here's what we've put together</h2>
          <p>Review the structured packet before it's used to find matching developers.</p>
        </div>
      </div>

      <div className="packet-flow">
        {PACKET_STAGES.map((stage, i) => (
          <div key={stage} className="packet-flow-stage">
            <span>{stage}</span>
            {i < PACKET_STAGES.length - 1 && <ArrowDown size={14} />}
          </div>
        ))}
      </div>

      <div className="card packet-summary">
        <div className="detail-row"><span>Title</span><p>{draft.requirements.title || '\u2014'}</p></div>
        <div className="detail-row"><span>Category</span><p>{draft.requirements.category || '\u2014'}</p></div>
        <div className="detail-row"><span>Description</span><p>{draft.requirements.description || '\u2014'}</p></div>
        <div className="detail-row"><span>Pages</span><p>{draft.requirements.pages || '\u2014'}</p></div>
        <div className="detail-row">
          <span>Confirmed features</span>
          <p><div className="chip-row">{confirmedFeatures.length ? confirmedFeatures.map((f) => <span key={f} className="chip active">{f}</span>) : '\u2014'}</div></p>
        </div>
        <div className="detail-row">
          <span>Tech stack</span>
          <p><div className="chip-row">{[...draft.requirements.frontend, ...draft.requirements.backend, ...draft.requirements.database].map((t) => <span key={t} className="chip active">{t}</span>)}</div></p>
        </div>
        <div className="detail-row"><span>Design</span><p>{draft.requirements.design.theme || 'No preference set'}, {draft.requirements.design.uiStyle || 'any style'}, {draft.requirements.design.mode} mode</p></div>
        <div className="detail-row"><span>Budget</span><p>{budgetLabel || '\u2014'}</p></div>
        <div className="detail-row"><span>Timeline</span><p>{timelineLabel || '\u2014'}</p></div>
        <div className="detail-row"><span>Priority</span><p>{draft.extra.priority}</p></div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-muted" onClick={() => navigate('/client/new-project/budget')}>Back</button>
        <button type="button" className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
          {submitting ? 'Submitting\u2026' : 'Submit project requirement'}
        </button>
      </div>
    </div>
  );
}
