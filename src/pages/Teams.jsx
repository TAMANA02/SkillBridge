import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, Search, Star, UserPlus, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { teams as demoTeams } from '../data/mockData';
import { teamService } from '../services/teamService';
import { useToast } from '../context/ToastContext';

const availabilityLabels = {
  taking_projects: 'Taking new projects',
  next_month: 'Available next month',
  at_capacity: 'Currently at capacity',
};

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SB';
}

function normalizeTeam(raw) {
  const leader = raw.leader ? `${raw.leader.first_name || ''} ${raw.leader.last_name || ''}`.trim() : raw.leader;
  const members = (raw.members || []).map((member) => ({
    ...member,
    initials: member.initials || initials(member.name),
  }));
  return {
    ...raw,
    slug: raw.slug || raw.id,
    leader: leader || members.find((member) => member.is_leader)?.name || 'Team lead',
    college: raw.college_name || raw.college,
    collegeSlug: raw.college_slug,
    availability: availabilityLabels[raw.availability] || raw.availability || 'Taking new projects',
    verified: raw.is_verified ?? raw.verification_status === 'verified' ?? raw.verified,
    completed: raw.completed_projects ?? raw.completed ?? 0,
    successRate: raw.success_rate ? `${raw.success_rate}%` : raw.successRate || '—',
    rating: raw.rating ?? 0,
    members,
    skills: raw.skills || [],
    description: raw.description || 'A collaborative college team ready to build meaningful client outcomes.',
  };
}

export default function Teams() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [skill, setSkill] = useState('All skills');
  const [teams, setTeams] = useState(demoTeams);

  useEffect(() => {
    let active = true;
    teamService.list().then(({ data }) => {
      if (!active) return;
      const items = data.results || data;
      // Only swap in live data once the backend actually has teams —
      // otherwise an empty (but "successful") response was silently wiping
      // out the working demo list, which is why search looked broken: the
      // list was empty by the time you typed anything, regardless of query.
      if (Array.isArray(items) && items.length > 0) setTeams(items.map(normalizeTeam));
    }).catch(() => {
      if (active) showToast('Showing demo teams until the database API is available');
    });
    return () => { active = false; };
  }, [showToast]);

  const skills = ['All skills', ...new Set(teams.flatMap((team) => team.skills))];
  const filteredTeams = useMemo(() => teams.filter((team) => {
    const matchesQuery = `${team.name} ${team.college} ${team.description}`.toLowerCase().includes(query.toLowerCase());
    const matchesSkill = skill === 'All skills' || team.skills.includes(skill);
    return matchesQuery && matchesSkill;
  }), [teams, query, skill]);

  return (
    <main className="directory-page">
      <section className="directory-hero team-hero"><div className="container directory-hero-grid"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><span className="eyebrow">Find teams</span><h1>One brief. A complete team. Better momentum.</h1><p>Hire a verified group of college builders with complementary skills, a shared portfolio, and one accountable delivery rhythm.</p><div className="hero-actions"><Link to="/teams/register" className="btn btn-primary"><UserPlus size={16} /> Register your team</Link><Link to="/feed" className="btn btn-outline">See team updates</Link></div></motion.div><div className="team-hero-stack"><div className="stack-card stack-card-back" /><div className="stack-card stack-card-middle" /><div className="stack-card stack-card-front"><span className="badge-pill">Team Nova</span><h3>Cross-functional by default.</h3><div className="avatar-stack"><span>RK</span><span>AR</span><span>KM</span><span>+2</span></div><p>IIT Delhi · Database-backed teams</p></div></div></div></section>
      <section className="section directory-content"><div className="container"><div className="directory-toolbar card"><div className="search-input-wrap"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search team or college" aria-label="Search teams" /></div><div className="filter-wrap"><Users size={15} /><select value={skill} onChange={(event) => setSkill(event.target.value)} aria-label="Filter teams by skill">{skills.map((item) => <option key={item}>{item}</option>)}</select></div></div><div className="section-head directory-heading"><div><span className="eyebrow">Verified team portfolio</span><h2>Teams built for real client outcomes</h2><p className="directory-data-note">Showing teams loaded from the SkillBridge database.</p></div><Link to="/teams/register" className="text-link">Create a team profile <ArrowUpRight size={15} /></Link></div>{filteredTeams.length ? <div className="team-grid">{filteredTeams.map((team, index) => <TeamCard key={team.slug} team={team} index={index} />)}</div> : <div className="card empty-state"><h3>No teams match those filters.</h3><p>Try a different skill or search term.</p></div>}</div></section>
    </main>
  );
}

function TeamCard({ team, index }) {
  return <motion.article className="card team-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}><div className="team-card-image team-card-image-fallback"><Users size={42} /><span className="badge-pill on-image">{team.availability}</span></div><div className="team-card-body"><div className="team-title-row"><div><h3>{team.name}</h3><p>{team.college}</p></div>{team.verified && <CheckCircle2 className="verified-icon" size={18} />}</div><p>{team.description}</p><div className="avatar-stack small">{team.members.slice(0, 4).map((member) => <span key={`${team.slug}-${member.name}`} title={member.name}>{member.initials}</span>)}</div><div className="chip-row compact-chip-row">{team.skills.map((item) => <span key={item} className="chip">{item}</span>)}</div><div className="developer-card-stats"><span><strong><Star size={14} /> {team.rating || '—'}</strong> rating</span><span><strong>{team.completed}</strong> completed</span><span><strong>{team.successRate}</strong> success</span></div><div className="card-actions"><Link to={`/teams/${team.slug}`} className="btn btn-primary btn-sm">View team profile <ArrowUpRight size={14} /></Link><button type="button" className="btn btn-ghost btn-sm" onClick={() => window.alert(`Hire request started for ${team.name}`)}>Hire team</button></div></div></motion.article>;
}
