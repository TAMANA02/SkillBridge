import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ThumbsDown, ThumbsUp } from 'lucide-react';
import EmptyState from '../../../components/EmptyState';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { BUDGET_TIERS, TIMELINE_OPTIONS } from '../../../data/flowTemplates';

export default function OpportunityDetail() {
  const { id } = useParams();
  const { getProject, respondToOpportunity } = useProjectFlow();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [showReject, setShowReject] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const project = getProject(id);

  if (!project) {
    return <EmptyState title="Opportunity not found" description="This project packet no longer exists." />;
  }

  const { packet, tags, providerResponse } = project;
  const confirmedFeatures = Object.entries(packet.clarification.answers)
    .filter(([, v]) => v === true)
    .map(([qid]) => packet.clarification.plan.find((p) => p.id === qid)?.tag)
    .filter(Boolean);

  const budgetLabel = packet.budget.tier === 'custom' ? packet.budget.custom : BUDGET_TIERS.find((t) => t.id === packet.budget.tier)?.label;
  const timelineLabel = packet.timeline.option === 'custom' ? packet.timeline.customDate : TIMELINE_OPTIONS.find((t) => t.id === packet.timeline.option)?.label;

  const respond = async (response) => {
    setSubmitting(true);
    await respondToOpportunity(id, { response, feedback });
    setSubmitting(false);
    if (response === 'accepted') navigate('/student/opportunities');
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">New project opportunity</span>
          <h2>{packet.requirements.title || 'Untitled project'}</h2>
          <p>Category: {packet.requirements.category || '\u2014'}</p>
        </div>
      </div>

      {providerResponse ? (
        <div className="card">
          <CheckCircle2 size={18} style={{ color: 'var(--lime)' }} />
          <p style={{ marginTop: '0.5rem' }}>
            You marked this opportunity as <strong>{providerResponse.response}</strong> on{' '}
            {new Date(providerResponse.respondedAt).toLocaleDateString()}.
          </p>
          {providerResponse.feedback && <p style={{ color: 'var(--text-dim)' }}>"{providerResponse.feedback}"</p>}
        </div>
      ) : (
        <>
          <div className="card packet-summary" style={{ marginBottom: '1.25rem' }}>
            <div className="detail-row"><span>Description</span><p>{packet.requirements.description || '\u2014'}</p></div>
            <div className="detail-row"><span>Pages required</span><p>{packet.requirements.pages || '\u2014'}</p></div>
            <div className="detail-row"><span>Functional requirements</span><p>{packet.requirements.functional || '\u2014'}</p></div>
            <div className="detail-row"><span>Technical requirements</span><p>{packet.requirements.technical || '\u2014'}</p></div>
            <div className="detail-row">
              <span>AI-clarified features</span>
              <p><div className="chip-row">{confirmedFeatures.length ? confirmedFeatures.map((f) => <span key={f} className="chip active">{f}</span>) : '\u2014'}</div></p>
            </div>
            <div className="detail-row">
              <span>Required skills</span>
              <p><div className="chip-row">{tags.map((t) => <span key={t} className="chip active">{t}</span>)}</div></p>
            </div>
            <div className="detail-row"><span>Design</span><p>{packet.requirements.design.theme || 'No preference'}, {packet.requirements.design.uiStyle || 'any style'}, {packet.requirements.design.mode} mode</p></div>
            <div className="detail-row"><span>Budget</span><p>{budgetLabel || '\u2014'}</p></div>
            <div className="detail-row"><span>Timeline</span><p>{timelineLabel || '\u2014'}</p></div>
            <div className="detail-row"><span>Priority</span><p>{packet.extra.priority}</p></div>
            {packet.extra.attachments.length > 0 && (
              <div className="detail-row">
                <span>Attachments</span>
                <p><div className="chip-row">{packet.extra.attachments.map((a) => <span key={a} className="chip">{a}</span>)}</div></p>
              </div>
            )}
          </div>

          {!showReject ? (
            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowReject(true)}>
                <ThumbsDown size={16} /> Not a fit
              </button>
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={() => respond('accepted')}>
                <ThumbsUp size={16} /> Accept opportunity
              </button>
            </div>
          ) : (
            <div className="card">
              <h3 className="step-panel-title">Tell the client why (optional)</h3>
              <div className="field-group full">
                <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="e.g. the required delivery time doesn't match my availability" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-muted" onClick={() => setShowReject(false)}>Cancel</button>
                <button type="button" className="btn btn-outline" disabled={submitting} onClick={() => respond('rejected')}>Confirm decline</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
