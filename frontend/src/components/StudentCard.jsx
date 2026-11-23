import { motion } from 'framer-motion';

const initials = (name) => name.split(' ').map((p) => p[0]).join('').slice(0, 2);

export default function StudentCard({ student, onInvite, index = 0 }) {
  return (
    <motion.article
      className="card public-profile-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05 }}
    >
      <div className="public-profile-header">
        <div className="profile-photo large">{initials(student.name)}</div>
        <div>
          <strong>{student.name}</strong>
          <span>{student.college} • {student.year}</span>
        </div>
      </div>
      <p><strong>ID:</strong> {student.studentId}</p>
      <p><strong>Skills:</strong> {student.skills}</p>
      <p><strong>Portfolio:</strong> {student.portfolio}</p>
      {onInvite && (
        <div className="form-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => onInvite(student.name)}>
            Invite
          </button>
        </div>
      )}
    </motion.article>
  );
}
