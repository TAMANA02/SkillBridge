import ProjectCard from '../../components/ProjectCard';
import EmptyState from '../../components/EmptyState';
import { studentJobs } from '../../data/mockData';

export default function StudentJobs() {
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Opportunities</span>
          <h2>Jobs</h2>
          <p>Browse opportunities tailored to your skills.</p>
        </div>
      </div>

      {studentJobs.length ? (
        <div className="grid-2">
          {studentJobs.map((job, i) => (
            <ProjectCard
              key={job.title}
              title={job.title}
              description={job.description}
              tags={job.tags}
              index={i}
              actions={<button type="button" className="btn btn-primary btn-sm">Apply Now</button>}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No jobs found" description="Check back soon for new opportunities." />
      )}
    </div>
  );
}
