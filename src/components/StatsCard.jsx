import { motion } from 'framer-motion';

export default function StatsCard({ value, label, index = 0 }) {
  return (
    <motion.div
      className="card stat-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <strong>{value}</strong>
      <span>{label}</span>
    </motion.div>
  );
}
