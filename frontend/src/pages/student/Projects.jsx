import ProjectCard from '../../components/ProjectCard';
import EmptyState from '../../components/EmptyState';
import { studentProjects } from '../../data/mockData';

export default function StudentProjects() {
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Portfolio</span>
          <h2>Projects</h2>
          <p>Showcase your portfolio work.</p>
        </div>
        <button type="button" className="btn btn-outline btn-sm">Add Project</button>
      </div>

      {studentProjects.length ? (
        <div className="grid-3">
          {studentProjects.map((project, i) => (
            <ProjectCard key={project.title} title={project.title} description={project.description} tags={project.tags} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState title="No projects uploaded yet" description="Your projects are ready to showcase for client review." />
      )}
    </div>
  );
}
