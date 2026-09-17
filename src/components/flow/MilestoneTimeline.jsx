import { CheckCircle2, CircleDashed, Loader2, UploadCloud } from 'lucide-react';

const ICONS = {
  completed: <CheckCircle2 size={18} />,
  submitted: <UploadCloud size={18} />,
  in_progress: <Loader2 size={18} className="spin" />,
  pending: <CircleDashed size={18} />,
};

const LABELS = {
  completed: 'Completed',
  submitted: 'Submitted for review',
  in_progress: 'In progress',
  pending: 'Pending',
};

const BADGE_CLASS = {
  completed: 'completed',
  submitted: 'accepted',
  in_progress: 'review',
  pending: 'pending',
};

export default function MilestoneTimeline({ milestones }) {
  return (
    <ol className="milestone-timeline">
      {milestones.map((m, i) => (
        <li key={m.id} className={`milestone-item ${m.status}`}>
          <span className="milestone-dot">{ICONS[m.status]}</span>
          <div className="milestone-copy">
            <strong>Milestone {i + 1}: {m.title}</strong>
            <span className={`status-badge ${BADGE_CLASS[m.status]}`}>{LABELS[m.status]}</span>
            {m.status === 'in_progress' && m.revisionNote && (
              <span className="milestone-revision-note">Revision requested: {m.revisionNote}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
