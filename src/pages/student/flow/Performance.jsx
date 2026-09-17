import { useMemo } from 'react';
import EmptyState from '../../../components/EmptyState';
import BadgeGrid from '../../../components/flow/BadgeGrid';
import ScoreRing from '../../../components/flow/ScoreRing';
import MiniBarChart from '../../../components/flow/MiniBarChart';
import { useProjectFlow } from '../../../context/ProjectFlowContext';

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function Performance() {
  const { projects } = useProjectFlow();

  const withWorkspace = useMemo(
    () => Object.values(projects).filter((p) => p.workspace).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [projects]
  );

  if (!withWorkspace.length) {
    return <EmptyState title="No performance data yet" description="Accept a project agreement to start building your performance profile." />;
  }

  const latest = withWorkspace[withWorkspace.length - 1].workspace.performance;
  const allBadges = withWorkspace.flatMap((p) => p.workspace.badgesEarned);

  // Derived category breakdown — technical/creativity/innovation/reliability
  // are read off the same underlying milestone/rating signals used for the
  // overall project performance score.
  const overall = latest.score;
  const technical = clamp(latest.accuracy);
  const creativity = clamp(latest.satisfaction - 3);
  const innovation = clamp(latest.accuracy - 2);
  const reliability = clamp(latest.onTime);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Performance</span>
          <h2>Your performance profile</h2>
          <p>Calculated automatically from milestone completions, timeliness, and client feedback.</p>
        </div>
      </div>

      <div className="workspace-grid">
        <div className="card">
          <h3 className="step-panel-title">Overall</h3>
          <div className="performance-ring-wrap">
            <ScoreRing value={overall} size={120} stroke={9} label="/ 100" />
          </div>
          <div className="performance-breakdown">
            <div><span>Technical</span><strong>{technical}</strong></div>
            <div><span>Creativity</span><strong>{creativity}</strong></div>
            <div><span>Innovation</span><strong>{innovation}</strong></div>
            <div><span>Reliability</span><strong>{reliability}</strong></div>
          </div>
        </div>

        <div className="card">
          <h3 className="step-panel-title">Performance across projects</h3>
          <MiniBarChart values={withWorkspace.map((p) => p.workspace.performance.score)} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginTop: '0.5rem' }}>
            {withWorkspace.length} project{withWorkspace.length > 1 ? 's' : ''} tracked
          </p>
        </div>

        <div className="card">
          <h3 className="step-panel-title">Badges earned</h3>
          <BadgeGrid earned={allBadges} />
        </div>
      </div>
    </div>
  );
}
