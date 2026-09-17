import { useEffect, useState } from 'react';
import EmptyState from '../../../components/EmptyState';
import { applicationService } from '../../../services/applicationService';
import { projectService } from '../../../services/projectService';
import { firstErrorMessage } from '../../../utils/formErrors';
import { useToast } from '../../../context/ToastContext';

export default function Opportunities() {
  const { showToast } = useToast();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const loadMatches = async () => {
    try {
      setError('');
      const { data } = await projectService.getMatchedProjects();
      setMatches(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(firstErrorMessage(requestError?.response?.data, 'Unable to load matched projects. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  const respond = async (match, decision) => {
    setBusyId(match.project.id);
    try {
      let application = match.application;
      if (!application) {
        const response = await applicationService.apply({ projectId: match.project.id, coverLetter: 'I am interested in this project based on my profile.' });
        application = response.data;
      }
      const response = decision === 'accepted'
        ? await applicationService.accept(application.id)
        : await applicationService.reject(application.id);
      setMatches((current) => current.map((item) => item.project.id === match.project.id ? { ...item, application: response.data } : item));
      showToast(decision === 'accepted' ? 'Project accepted successfully.' : 'Project declined.');
    } catch (requestError) {
      showToast(firstErrorMessage(requestError?.response?.data, 'Unable to save your response. Please try again.'));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="section"><p>Loading matched projects...</p></div>;
  if (error) return <div className="section"><div className="card"><h3>Matched projects unavailable</h3><p>{error}</p><button type="button" className="btn btn-primary" onClick={loadMatches}>Try again</button></div></div>;

  return (
    <div>
      <div className="dashboard-header"><div><span className="eyebrow">Provider opportunities</span><h2>Projects matched to your profile</h2><p>Matches use the skills, technologies, category, and requirements saved in the database.</p></div></div>
      {matches.length ? <div className="grid-2">{matches.map((match) => {
        const application = match.application;
        const status = application?.status;
        return <div key={match.project.id} className="card card-hover">
          <span className="eyebrow">{match.project.category} · {match.match_score}% match</span>
          <h3 style={{ margin: '.3rem 0' }}>{match.project.title}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '.88rem' }}>{match.project.description}</p>
          <div className="chip-row" style={{ margin: '.75rem 0' }}>{(match.project.required_skills || []).map((skill) => <span key={skill} className="chip">{skill}</span>)}</div>
          {status ? <p className="status-badge">Your response: {status}</p> : <div className="card-actions"><button type="button" className="btn btn-primary btn-sm" disabled={busyId === match.project.id} onClick={() => respond(match, 'accepted')}>{busyId === match.project.id ? 'Saving...' : 'Accept'}</button><button type="button" className="btn btn-outline btn-sm" disabled={busyId === match.project.id} onClick={() => respond(match, 'rejected')}>Reject</button></div>}
        </div>;
      })}</div> : <EmptyState title="No matched projects yet" description="Complete your skills and technologies so relevant client projects can find you." />}
    </div>
  );
}
