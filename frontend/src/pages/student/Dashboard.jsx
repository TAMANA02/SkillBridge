import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Target, FileCheck2, Briefcase, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProjectFlow } from '../../context/ProjectFlowContext';

export default function StudentDashboard() {
  console.log("STUDENT DASHBOARD LOADED");
  const { user } = useAuth();
  const { projects } = useProjectFlow();

  const stats = useMemo(() => {
    const all = Object.values(projects);
    return {
      newOpportunities: all.filter((p) => p.status === 'matching' && !p.providerResponse).length,
      awaitingAgreement: all.filter((p) => p.status === 'agreement_pending' && !p.agreement?.providerAccepted).length,
      active: all.filter((p) => p.status === 'active').length,
      completed: all.filter((p) => p.status === 'completed').length,
      latestScore: all.filter((p) => p.workspace).slice(-1)[0]?.workspace?.performance?.score ?? null,
    };
  }, [projects]);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Welcome back{user?.first_name ? `, ${user.first_name}` : ''}</span>
          <h2>Student dashboard</h2>
          <p>Track new opportunities, agreements awaiting your acceptance, and active projects.</p>
        </div>
      </div>

      <div className="stats-strip">
        <Link to="/student/opportunities" className="card card-hover stat-card">
          <Target size={20} />
          <strong>{stats.newOpportunities}</strong>
          <span>New opportunities</span>
        </Link>
        <Link to="/student/opportunities" className="card card-hover stat-card">
          <FileCheck2 size={20} />
          <strong>{stats.awaitingAgreement}</strong>
          <span>Agreements to review</span>
        </Link>
        <Link to="/student/opportunities" className="card card-hover stat-card">
          <Briefcase size={20} />
          <strong>{stats.active}</strong>
          <span>Active projects</span>
        </Link>
        <Link to="/student/performance" className="card card-hover stat-card">
          <TrendingUp size={20} />
          <strong>{stats.latestScore ?? '\u2014'}</strong>
          <span>Performance score</span>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="step-panel-title">What's next</h3>
        <ul className="dashboard-next-list">
          <li>Review new project packets under <Link to="/student/opportunities">Opportunities</Link> and accept or decline with feedback.</li>
          <li>Once a client selects you, accept the generated agreement to open the project workspace.</li>
          <li>Submit milestone work for review and track your badges and performance under <Link to="/student/performance">Performance</Link>.</li>
        </ul>
      </div>
    </div>
  );
}
