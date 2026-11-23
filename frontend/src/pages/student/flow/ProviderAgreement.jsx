import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import EmptyState from '../../../components/EmptyState';
import { useToast } from '../../../context/ToastContext';
import { useProjectFlow } from '../../../context/ProjectFlowContext';
import { BUDGET_TIERS, TIMELINE_OPTIONS } from '../../../data/flowTemplates';

export default function ProviderAgreement() {
  const { id } = useParams();
  const { getProject, providerAccept } = useProjectFlow();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [changeNote, setChangeNote] = useState('');
  const [showChanges, setShowChanges] = useState(false);
  const project = getProject(id);

  if (!project || !project.agreement) {
    return <EmptyState title="No agreement yet" description="This project hasn't reached the agreement stage." />;
  }

  const { agreement, packet } = project;
  const budgetLabel = packet.budget.tier === 'custom' ? packet.budget.custom : BUDGET_TIERS.find((t) => t.id === packet.budget.tier)?.label;
  const timelineLabel = packet.timeline.option === 'custom' ? packet.timeline.customDate : TIMELINE_OPTIONS.find((t) => t.id === packet.timeline.option)?.label;

  const requestChanges = () => {
    showToast('Change request sent to the client.');
    setShowChanges(false);
    setChangeNote('');
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Project agreement</span>
          <h2>Review before you commit</h2>
          <p>This is generated from the client's requirement packet \u2014 nothing here can change once both sides accept.</p>
        </div>
      </div>

      <div className="agreement-doc card">
        <div className="agreement-doc-head">
          <strong>{packet.requirements.title || 'Untitled project'}</strong>
          <span>Client budget: {budgetLabel}</span>
        </div>
        <div className="detail-row"><span>Scope</span><p>{packet.requirements.description}</p></div>
        <div className="detail-row"><span>Timeline</span><p>{timelineLabel}</p></div>
        <div className="detail-row">
          <span>Milestones</span>
          <p>{agreement.milestones.map((m) => m.title).join(' \u2192 ')}</p>
        </div>
        <div className="detail-row"><span>Communication</span><p>{packet.extra.communicationPref}</p></div>
        <div className="detail-row"><span>Other terms</span><p>Payment releases at each completed milestone; revisions follow the agreed scope.</p></div>
      </div>

      <div className="agreement-status">
        <div className={`agreement-status-row ${agreement.clientAccepted ? 'done' : ''}`}>
          {agreement.clientAccepted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          <span>Client accepts the agreement</span>
        </div>
        <div className={`agreement-status-row ${agreement.providerAccepted ? 'done' : ''}`}>
          {agreement.providerAccepted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          <span>You accept the agreement</span>
        </div>
      </div>

      {!agreement.clientAccepted ? (
        <EmptyState title="Waiting on the client" description="The client hasn't accepted this agreement yet." />
      ) : agreement.providerAccepted ? (
        <button type="button" className="btn btn-primary" onClick={() => navigate(`/student/projects/${id}/workspace`)}>
          Open project workspace
        </button>
      ) : !showChanges ? (
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => setShowChanges(true)}>Request changes</button>
          <button type="button" className="btn btn-primary" onClick={() => providerAccept(id)}>Accept agreement</button>
        </div>
      ) : (
        <div className="card">
          <div className="field-group full">
            <label>What would you like changed?</label>
            <textarea rows={3} value={changeNote} onChange={(e) => setChangeNote(e.target.value)} placeholder="e.g. the timeline is too tight for this scope" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-muted" onClick={() => setShowChanges(false)}>Cancel</button>
            <button type="button" className="btn btn-outline" onClick={requestChanges}>Send change request</button>
          </div>
        </div>
      )}
    </div>
  );
}
