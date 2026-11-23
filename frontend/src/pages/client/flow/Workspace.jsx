import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import EmptyState from '../../../components/EmptyState';
import MilestoneTimeline from '../../../components/flow/MilestoneTimeline';
import BadgeGrid from '../../../components/flow/BadgeGrid';
import ScoreRing from '../../../components/flow/ScoreRing';
import { useProjectFlow } from '../../../context/ProjectFlowContext';

export default function Workspace() {
  const { id } = useParams();
  const { getProject, reviewMilestone } = useProjectFlow();
  const navigate = useNavigate();
  const [revisionNote, setRevisionNote] = useState('');
  const project = getProject(id);

  if (!project || !project.workspace) {
    return <EmptyState title="Workspace not open yet" description="Communication and milestone tracking unlock once both sides accept the agreement." />;
  }

  const { workspace, selected, packet, status } = project;
  const submittedMilestone = workspace.milestones.find((m) => m.status === 'submitted');

  const approve = () => reviewMilestone(id, 'approve');
  const requestRevision = () => {
    reviewMilestone(id, 'revise', revisionNote.trim());
    setRevisionNote('');
  };

  return (
    <div className="flow-shell">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Project workspace</span>
          <h2>{packet.requirements.title || 'Your project'}</h2>
          <p>Working with {selected.entity.name} \u00b7 Progress: {workspace.progress}%</p>
        </div>
      </div>

      <div className="workspace-progress-bar">
        <div style={{ width: `${workspace.progress}%` }} />
      </div>

      <div className="workspace-grid">
        <div className="card">
          <h3 className="step-panel-title">Milestones</h3>
          <MilestoneTimeline milestones={workspace.milestones} />

          {submittedMilestone && (
            <div className="milestone-review-box">
              <strong>{submittedMilestone.title} was submitted for review</strong>
              {submittedMilestone.submission?.notes && <p>{submittedMilestone.submission.notes}</p>}
              {submittedMilestone.submission?.link && (
                <a href={submittedMilestone.submission.link} target="_blank" rel="noreferrer">{submittedMilestone.submission.link}</a>
              )}
              {submittedMilestone.submission?.files?.length > 0 && (
                <div className="chip-row">
                  {submittedMilestone.submission.files.map((f) => <span key={f} className="chip">{f}</span>)}
                </div>
              )}
              <div className="field-group full" style={{ marginTop: '0.75rem' }}>
                <label>Revision note (optional)</label>
                <textarea rows={2} value={revisionNote} onChange={(e) => setRevisionNote(e.target.value)} placeholder="What needs to change?" />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={requestRevision}>Request revision</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={approve}>Approve milestone</button>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate(`/client/projects/${id}/complete`)}>
              View completion & leave a rating
            </button>
          )}
        </div>

        <div className="card">
          <h3 className="step-panel-title">Performance score</h3>
          <div className="performance-ring-wrap">
            <ScoreRing value={workspace.performance.score} size={110} stroke={8} label="/ 100" />
          </div>
          <div className="performance-breakdown">
            <div><span>Milestone success</span><strong>{workspace.performance.milestoneSuccess}%</strong></div>
            <div><span>On-time delivery</span><strong>{workspace.performance.onTime}%</strong></div>
            <div><span>Client satisfaction</span><strong>{workspace.performance.satisfaction}%</strong></div>
            <div><span>Requirement accuracy</span><strong>{workspace.performance.accuracy}%</strong></div>
          </div>
        </div>

        <div className="card">
          <h3 className="step-panel-title">Badges</h3>
          <BadgeGrid earned={workspace.badgesEarned} />
        </div>

        <div className="card">
          <h3 className="step-panel-title"><MessageCircle size={16} style={{ verticalAlign: '-3px', marginRight: '0.4rem' }} />Communication</h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)' }}>
            Messaging, file sharing, and milestone discussion opened automatically once both sides accepted the
            agreement. Nothing was visible before that point.
          </p>
        </div>
      </div>
    </div>
  );
}
