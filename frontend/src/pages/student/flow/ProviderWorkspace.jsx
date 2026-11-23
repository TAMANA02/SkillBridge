import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';
import EmptyState from '../../../components/EmptyState';
import MilestoneTimeline from '../../../components/flow/MilestoneTimeline';
import BadgeGrid from '../../../components/flow/BadgeGrid';
import ScoreRing from '../../../components/flow/ScoreRing';
import { useProjectFlow } from '../../../context/ProjectFlowContext';

export default function ProviderWorkspace() {
  const { id } = useParams();
  const { getProject, submitMilestoneWork } = useProjectFlow();
  const [notes, setNotes] = useState('');
  const [link, setLink] = useState('');
  const [fileNames, setFileNames] = useState([]);
  const project = getProject(id);

  if (!project || !project.workspace) {
    return <EmptyState title="Workspace not open yet" description="This unlocks once you've accepted the project agreement." />;
  }

  const { workspace, packet } = project;
  const activeMilestone = workspace.milestones.find((m) => m.status === 'in_progress');

  const onFiles = (e) => {
    setFileNames(Array.from(e.target.files || []).map((f) => f.name));
  };

  const submit = () => {
    submitMilestoneWork(id, { notes, link, files: fileNames });
    setNotes('');
    setLink('');
    setFileNames([]);
  };

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Project workspace</span>
          <h2>{packet.requirements.title || 'Your project'}</h2>
          <p>Progress: {workspace.progress}%</p>
        </div>
      </div>

      <div className="workspace-progress-bar">
        <div style={{ width: `${workspace.progress}%` }} />
      </div>

      <div className="workspace-grid">
        <div className="card">
          <h3 className="step-panel-title">Milestones</h3>
          <MilestoneTimeline milestones={workspace.milestones} />

          {activeMilestone && (
            <div className="milestone-review-box">
              <strong><UploadCloud size={15} style={{ verticalAlign: '-2px', marginRight: '0.35rem' }} />Submit work for "{activeMilestone.title}"</strong>
              <div className="field-group full">
                <label>Notes</label>
                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you complete?" />
              </div>
              <div className="field-group full">
                <label>Link (staging, repo, design file)</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
              </div>
              <div className="field-group full">
                <label>Screenshots / files</label>
                <input type="file" multiple onChange={onFiles} />
                {fileNames.length > 0 && (
                  <div className="chip-row" style={{ marginTop: '0.5rem' }}>
                    {fileNames.map((f) => <span key={f} className="chip">{f}</span>)}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-primary btn-sm" disabled={!notes.trim()} onClick={submit}>
                  Submit for client review
                </button>
              </div>
            </div>
          )}

          {!activeMilestone && workspace.milestones.some((m) => m.status === 'submitted') && (
            <EmptyState title="Waiting for client review" description="Your submission is with the client for approval." />
          )}
        </div>

        <div className="card">
          <h3 className="step-panel-title">Your performance on this project</h3>
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
      </div>
    </div>
  );
}
