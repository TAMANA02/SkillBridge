import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MatchCard from '../../../components/flow/MatchCard';
import EmptyState from '../../../components/EmptyState';
import { useProjectFlow } from '../../../context/ProjectFlowContext';

const TABS = [
  { id: 'developer', label: 'Developers', key: 'developerMatches' },
  { id: 'team', label: 'Teams', key: 'teamMatches' },
  { id: 'college', label: 'Colleges', key: 'collegeMatches' },
];

export default function Matches() {
  const { id } = useParams();
  const { getProject, selectMatch } = useProjectFlow();
  const navigate = useNavigate();
  const [tab, setTab] = useState('developer');
  const project = getProject(id);

  if (!project) {
    return <EmptyState title="Project not found" description="This requirement packet doesn't exist yet." />;
  }

  const activeTab = TABS.find((t) => t.id === tab);
  const results = project.matches[activeTab.key] || [];

  const handleSelect = (match) => {
    selectMatch(id, match);
    navigate(`/client/projects/${id}/agreement`);
  };

  return (
    <div className="flow-shell">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Matching engine</span>
          <h2>{project.packet.requirements.title || 'Your project'}</h2>
          <p>Ranked against your requirement packet: {project.tags.slice(0, 6).join(', ') || 'general fit'}.</p>
        </div>
      </div>

      <div className="chip-row" style={{ marginBottom: '1.5rem' }}>
        {TABS.map((t) => (
          <button key={t.id} type="button" className={`chip ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {results.length ? (
        <div className="developer-results-grid">
          {results.map((m) => (
            <MatchCard
              key={m.entity.id || m.entity.slug}
              type={m.type}
              entity={m.entity}
              score={m.score}
              selected={project.selected && (project.selected.entity.id || project.selected.entity.slug) === (m.entity.id || m.entity.slug)}
              onSelect={() => handleSelect(m)}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No matches yet" description="Try adjusting your requirement packet for stronger matches." />
      )}
    </div>
  );
}
