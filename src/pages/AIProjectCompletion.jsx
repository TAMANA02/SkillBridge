import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { aiProjectCompletionItems } from '../data/mockData';

export default function AIProjectCompletion() {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">AI Project Completion</span>
            <h2>Complete your AI-generated projects with verified student developers</h2>
            <p>
              AI Project Completion is designed for users who have already created a website or application
              using AI tools but are unable to finish the remaining development. Verified student developers on
              SkillBridge help transform AI-generated or partially completed projects into fully functional,
              production-ready applications.
            </p>
          </div>

          <motion.div className="card" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>How SkillBridge helps finish your AI project</h3>
            <div className="grid-3">
              {aiProjectCompletionItems.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={16} color="var(--lime)" />
                  <span style={{ fontSize: '0.92rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="card" style={{ marginTop: '2rem', borderColor: 'rgba(244, 114, 182, 0.35)' }}>
            <span className="badge-pill orange">Important notice</span>
            <p style={{ marginTop: '0.75rem' }}>
              SkillBridge does not use AI to automatically complete projects. All development work is completed
              manually by verified student developers.
            </p>
          </div>

          <div className="form-actions" style={{ marginTop: '2rem' }}>
            <Link to="/#contact" className="btn btn-outline">Hire Student Developer</Link>
            <Link to="/signup?role=client" className="btn btn-primary">Post AI Project</Link>
          </div>
        </div>
      </section>
    </>
  );
}
