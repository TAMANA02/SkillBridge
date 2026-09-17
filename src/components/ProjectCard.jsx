import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

export default function ProjectCard({ title, description, tags, status, index = 0, actions }) {
  return (
    <motion.article
      className="card card-hover"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
    >
      <div className="panel-heading">
        <strong>{title}</strong>
        {status && <StatusBadge status={status} />}
      </div>
      {description && <p>{description}</p>}
      {tags && <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--lavender)' }}>{tags}</p>}
      {actions && <div className="form-actions">{actions}</div>}
    </motion.article>
  );
}
