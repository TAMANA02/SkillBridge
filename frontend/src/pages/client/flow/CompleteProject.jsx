import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PartyPopper, Star } from 'lucide-react';
import EmptyState from '../../../components/EmptyState';
import StarRating from '../../../components/flow/StarRating';
import { useProjectFlow } from '../../../context/ProjectFlowContext';

const CATEGORIES = ['Technical skills', 'Communication', 'Quality', 'Timeliness', 'Requirement understanding', 'Professionalism'];

export default function CompleteProject() {
  const { id } = useParams();
  const { getProject, submitRating } = useProjectFlow();
  const [stars, setStars] = useState(0);
  const [highlights, setHighlights] = useState([]);
  const [feedback, setFeedback] = useState('');
  const project = getProject(id);

  if (!project || project.status !== 'completed') {
    return <EmptyState title="Not completed yet" description="This project still has milestones in progress." />;
  }

  const toggleHighlight = (c) => setHighlights((h) => (h.includes(c) ? h.filter((x) => x !== c) : [...h, c]));

  const handleSubmit = () => {
    submitRating(id, { stars, highlights, feedback });
  };

  return (
    <div className="flow-shell">
      <div className="completion-banner">
        <PartyPopper size={22} />
        <div>
          <strong>100% project completed</strong>
          <span>{project.packet.requirements.title} is finished and ready to hand off.</span>
        </div>
      </div>

      {!project.rating ? (
        <div className="card">
          <h3 className="step-panel-title">Rate {project.selected.entity.name}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginBottom: '1rem' }}>How was your experience working with this developer?</p>
          <StarRating value={stars} onChange={setStars} size={28} />

          <div className="chip-row" style={{ margin: '1.1rem 0' }}>
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className={`chip ${highlights.includes(c) ? 'active' : ''}`} onClick={() => toggleHighlight(c)}>{c}</button>
            ))}
          </div>

          <div className="field-group full">
            <label>Written feedback</label>
            <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell future clients about this experience" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-primary" disabled={!stars} onClick={handleSubmit}>Submit rating</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <h3 className="step-panel-title">Public developer reputation</h3>
          <div className="public-profile-header">
            <div className="match-card-avatar">
              {project.selected.entity.image ? <img src={project.selected.entity.image} alt="" /> : project.selected.entity.name[0]}
            </div>
            <div>
              <strong>{project.selected.entity.name}</strong>
              <span>{(project.selected.entity.rating || 4.8).toFixed(1)}/5 \u00b7 {(project.selected.entity.projects || project.selected.entity.completed || 0) + 1} completed projects</span>
            </div>
          </div>
          <div className="reputation-review">
            <div className="star-rating" style={{ marginBottom: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} fill={n <= project.rating.stars ? 'var(--orange)' : 'none'} color={n <= project.rating.stars ? 'var(--orange)' : 'var(--text-faint)'} />
              ))}
            </div>
            <p>"{project.rating.feedback || 'Delivered according to the agreed requirements.'}"</p>
            <div className="chip-row">
              {project.rating.highlights.map((h) => <span key={h} className="chip">{h}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
