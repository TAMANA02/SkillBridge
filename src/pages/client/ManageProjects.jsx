import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { clientProjects } from '../../data/mockData';

export default function ManageProjects() {
  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Your projects</span>
          <h2>Manage Projects</h2>
          <p>Keep track of posted work and student applications.</p>
        </div>
        <Link to="/client/post-project" className="btn btn-primary btn-sm"><Plus size={15} /> New Project</Link>
      </div>

      {clientProjects.length ? (
        <div className="card" style={{ padding: 0 }}>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clientProjects.map((project) => (
                  <tr key={project.title}>
                    <td>{project.title}</td>
                    <td><StatusBadge status={project.status} /></td>
                    <td>
                      <div className="table-actions">
                        <button type="button" className="btn btn-ghost btn-sm">View</button>
                        <button type="button" className="btn btn-ghost btn-sm">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState title="No projects posted yet" description="Post a project to start receiving student applications." />
      )}
    </div>
  );
}
