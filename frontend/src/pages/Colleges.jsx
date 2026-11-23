import { motion } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, ChevronUp, Medal, Search, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { colleges as demoColleges } from '../data/mockData';
import { collegeService } from '../services/collegeService';
import { useToast } from '../context/ToastContext';

const accents = ['#6366f1', '#22c55e', '#f97316', '#0ea5e9', '#a855f7', '#ef4444'];

function normalizeCollege(raw, index) {
  const score = Math.round(raw.performance_score ?? raw.score ?? 0);
  return {
    ...raw,
    rank: index + 1,
    slug: raw.slug,
    name: raw.name,
    city: raw.location || raw.city || '',
    score: Number.isFinite(score) ? score : 0,
    accent: accents[index % accents.length],
    trend: raw.trend || '',
    projects: raw.projects_completed ?? raw.projects ?? 0,
    successRate: raw.success_rate != null ? `${raw.success_rate}%` : raw.successRate || '—',
    rating: raw.client_rating ?? raw.rating ?? 0,
    developers: raw.total_developers ?? raw.developers ?? 0,
    teams: raw.total_teams ?? raw.teams ?? 0,
  };
}

export default function Colleges() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [colleges, setColleges] = useState(demoColleges);

  useEffect(() => {
    let active = true;
    collegeService.leaderboard(50).then(({ data }) => {
      if (!active) return;
      const items = Array.isArray(data) ? data : data.results;
      if (Array.isArray(items) && items.length) {
        setColleges(items.map(normalizeCollege));
      }
    }).catch(() => {
      if (active) showToast('Showing demo colleges until the database API is available');
    });
    return () => { active = false; };
  }, [showToast]);

  const visibleColleges = useMemo(
    () => colleges
      .filter((college) => `${college.name} ${college.city}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sortBy === 'rating' ? b.rating - a.rating : b.score - a.score))
      .map((college, index) => ({ ...college, rank: index + 1 })),
    [colleges, query, sortBy]
  );

  const topScore = visibleColleges[0]?.score ?? 0;

  return <main className="directory-page college-page"><section className="directory-hero college-hero"><div className="container directory-hero-grid"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><span className="eyebrow">College performance</span><h1>Find the campuses where great work keeps happening.</h1><p>SkillBridge rankings reward successful outcomes, client satisfaction, and developer activity—not just the size of a college.</p><div className="hero-actions"><Link to="/discover" className="btn btn-primary">Find top developers <ArrowUpRight size={16} /></Link><Link to="/teams" className="btn btn-outline">Browse college teams</Link></div></motion.div><div className="ranking-hero-card card"><Medal size={20} /><span>Quality-weighted index</span><strong>{topScore}<span>/100</span></strong><p>Top college score right now</p><div className="ranking-bars"><i style={{ width: '94%' }} /><i style={{ width: '82%' }} /><i style={{ width: '70%' }} /></div></div></div></section>

  <section className="section directory-content"><div className="container"><div className="directory-toolbar card"><div className="search-input-wrap"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search colleges or cities" aria-label="Search colleges" /></div><div className="filter-wrap"><ChevronUp size={15} /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort colleges"><option value="rank">Sort: performance score</option><option value="rating">Sort: client rating</option></select></div></div><div className="section-head directory-heading"><div><span className="eyebrow">The leaderboard</span><h2>Campuses delivering with consistency</h2></div><span className="result-count">{visibleColleges.length} colleges</span></div>{visibleColleges.length ? <div className="college-table card"><div className="college-table-head"><span>Rank & college</span><span>Performance</span><span>Outcomes</span><span>Community</span><span /></div>{visibleColleges.map((college, index) => <CollegeRow key={college.slug} college={college} index={index} />)}</div> : <div className="card empty-state"><h3>No colleges match those filters.</h3><p>Try a different search term, or register a team to add your college.</p></div>}<div className="ranking-note"><CheckCircle2 size={16} /><p><strong>How ranking works:</strong> success rate, average client rating, completed projects, and meaningful developer activity are blended into a quality-weighted score.</p></div></div></section></main>;
}

function CollegeRow({ college, index }) {
  return <motion.div className="college-row" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }}><div className="college-name-cell"><span className={`rank-number ${index < 3 ? 'top-rank' : ''}`}>{college.rank < 4 ? <Medal size={15} /> : college.rank}</span><div><Link to={`/colleges/${college.slug}`} className="college-link"><strong>{college.name}</strong><ArrowUpRight size={14} /></Link><span>{college.city}</span></div></div><div className="performance-cell"><strong>{college.score}<small>/100</small></strong><div className="progress-track"><i style={{ width: `${Math.min(college.score, 100)}%`, background: college.accent }} /></div>{college.trend && <span className="trend">{college.trend} this month</span>}</div><div className="outcome-cell"><strong>{college.projects}</strong><span>projects · {college.successRate} success</span></div><div className="community-cell"><strong><Star size={14} /> {college.rating}</strong><span>{college.developers} developers · {college.teams} teams</span></div><Link to={`/colleges/${college.slug}`} className="row-arrow" aria-label={`View ${college.name}`}><ArrowUpRight size={17} /></Link></motion.div>;
}
