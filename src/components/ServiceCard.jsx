import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ServiceCard({ service, index = 0 }) {
  const inner = (
    <>
      <div className="panel-heading">
        <h3>{service.name}</h3>
        <ArrowUpRight size={18} />
      </div>
      <p>{service.description}</p>
    </>
  );

  return (
    <motion.div
      className="card card-hover"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      {service.href ? <Link to={service.href}>{inner}</Link> : inner}
    </motion.div>
  );
}
