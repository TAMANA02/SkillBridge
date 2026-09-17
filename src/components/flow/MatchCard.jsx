import { Link } from 'react-router-dom';
import { CheckCircle2, Users, GraduationCap } from 'lucide-react';
import ScoreRing from './ScoreRing';

const PROFILE_ROUTE = {
  developer: (entity) => `/developers/${entity.userId || entity.id}`,
  team: (entity) => `/teams/${entity.slug}`,
  college: (entity) => `/colleges/${entity.slug}`,
};

export default function MatchCard({ type, entity, score, onSelect, selected }) {
  const name = entity.name;
  const subtitle =
    type === 'developer' ? entity.title : type === 'team' ? `Team \u00b7 ${entity.college}` : `${entity.developers} developers \u00b7 ${entity.teams} teams`;
  const skills = type === 'college' ? entity.topDevelopers?.slice(0, 3) : entity.skills;
  const Icon = type === 'college' ? GraduationCap : Users;

  return (
    <div className={`card card-hover public-profile-card match-card ${selected ? 'match-card-selected' : ''}`}>
      <div className="public-profile-header">
        <div className="match-card-avatar">
          {entity.image ? <img src={entity.image} alt="" /> : <Icon size={20} />}
        </div>
        <div>
          <strong>{name}</strong>
          <span>{subtitle}</span>
        </div>
        <ScoreRing value={score} size={56} stroke={5} label="match" />
      </div>

      {skills?.length > 0 && (
        <div className="chip-row" style={{ marginBottom: '0.9rem' }}>
          {skills.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      )}

      <div className="match-card-actions">
        <Link to={PROFILE_ROUTE[type](entity)} className="btn btn-outline btn-sm">View profile</Link>
        <button type="button" className="btn btn-primary btn-sm" onClick={onSelect}>
          {selected ? <><CheckCircle2 size={15} /> Selected</> : `Work with this ${type === 'college' ? 'college\u2019s team' : type}`}
        </button>
      </div>
    </div>
  );
}
