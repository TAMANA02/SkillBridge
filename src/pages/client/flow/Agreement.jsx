import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import EmptyState from '../../../components/EmptyState';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { BUDGET_TIERS, TIMELINE_OPTIONS } from '../../../data/flowTemplates';

export default function Agreement() {
  const { id } = useParams();
  const { getProject, acceptAgreementClient } = useProjectFlow();
  const navigate = useNavigate();
  const project = getProject(id);

  if (!project || !project.selected) {
    return <EmptyState title="No developer selected yet" description="Choose a developer, team, or college first." />;
  }

  const { agreement, selected, packet } = project;
  const budgetLabel = packet.budget.tier === 'custom' ? packet.budget.custom : BUDGET_TIERS.find((t) => t.id === packet.budget.tier)?.label;
  const timelineLabel = packet.timeline.option === 'custom' ? packet.timeline.customDate : TIMELINE_OPTIONS.find((t) => t.id === packet.timeline.option)?.label;

  return (
    <div className="flow-shell">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Project agreement</span>
          <h2>Review before you commit</h2>
          <p>Nothing here can change once both sides accept — no surprises on budget or scope later.</p>
        </div>
      </div>

      <div className="agreement-doc card">
        <div className="agreement-doc-head">
          <strong>{packet.requirements.title || 'Untitled project'}</strong>
          <span>Working with {selected.entity.name}</span>
        </div>

        <div className="detail-row"><span>Requirements</span>
          <p>{packet.requirements.description}</p>
        </div>
        <div className="detail-row"><span>Budget</span><p>{budgetLabel}</p></div>
        <div className="detail-row"><span>Timeline</span><p>{timelineLabel}</p></div>
        <div className="detail-row">
          <span>Milestones</span>
          <p>{agreement.milestones.map((m) => m.title).join(' \u2192 ')}</p>
        </div>
        <div className="detail-row"><span>Communication</span><p>{packet.extra.communicationPref}</p></div>
        <div className="detail-row"><span>Other terms</span><p>Revisions follow the agreed scope; payment releases at each completed milestone.</p></div>
      </div>

      <div className="agreement-status">
        <div className={`agreement-status-row ${agreement.clientAccepted ? 'done' : ''}`}>
          {agreement.clientAccepted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          <span>You accept the agreement</span>
        </div>
        <div className={`agreement-status-row ${agreement.providerAccepted ? 'done' : ''}`}>
          {agreement.providerAccepted ? <CheckCircle2 size={18} /> : agreement.clientAccepted ? <Loader2 size={18} className="spin" /> : <Circle size={18} />}
          <span>{selected.entity.name} accepts the agreement</span>
        </div>
        {agreement.clientAccepted && !agreement.providerAccepted && (
          <p className="agreement-hint">
            This project is now sitting in the provider's dashboard under Opportunities \u2192 Agreements awaiting
            acceptance. In this demo build, open Student &gt; Opportunities to accept it from the other side.
          </p>
        )}
      </div>

      <div className="form-actions">
        {!agreement.clientAccepted ? (
          <button type="button" className="btn btn-primary" onClick={() => acceptAgreementClient(id)}>
            Accept agreement
          </button>
        ) : agreement.providerAccepted ? (
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/client/projects/${id}/workspace`)}>
            Open project workspace
          </button>
        ) : (
          <button type="button" className="btn btn-muted" disabled>
            Waiting for {selected.entity.name} to accept in their dashboard\u2026
          </button>
        )}
      </div>
    </div>
  );
}
