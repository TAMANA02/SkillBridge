import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/mockData';

export default function Services() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center">
          <span className="eyebrow">Our services</span>
          <h2>Digital services for every stage of your project</h2>
          <p>From design and deployment to AI and security, SkillBridge provides student-led talent for modern digital initiatives.</p>
        </div>

        <div className="grid-3">
          {services.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} />
          ))}
        </div>

        <div className="form-actions" style={{ justifyContent: 'center', marginTop: '3rem' }}>
          <Link to="/discover" className="btn btn-outline">Hire a Developer</Link>
          <Link to="/signup?role=client" className="btn btn-primary">Post an AI Project</Link>
        </div>
      </div>
    </section>
  );
}
