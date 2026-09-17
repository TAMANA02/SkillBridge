import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { clientService } from "../../services/clientService";
import { projectService } from "../../services/projectService";

export const ClientDashboard = () => {
  console.log("CLIENT DASHBOARD LOADED");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch client profile
        const profileResponse = await clientService.getMyProfile();
        setProfile(profileResponse.data);

        // Fetch client's projects
        const projectsResponse = await projectService.getProjects();
        setProjects(projectsResponse.data.results);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {profile?.company_name}</h1>

      <section>
        <h2>Company Profile</h2>
        <p>Industry: {profile?.industry}</p>
        <p>
          Budget: ${profile?.budget_range_min} - ${profile?.budget_range_max}
        </p>
        <p>Projects Posted: {profile?.projects_posted}</p>
      </section>

      <section>
        <h2>Your Projects ({projects.length})</h2>
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>Status: {project.status}</p>
            <p>Applications: {project.applications_count}</p>
            <button>Manage</button>
          </div>
        ))}
      </section>

      <button className="primary" onClick={() => navigate("/client/new-project")}>
        Post New Project
      </button>
    </div>
  );
};

export default ClientDashboard;
