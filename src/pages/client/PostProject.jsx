import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';

export default function PostProject() {
  const [form, setForm] = useState({ title: '', category: '', description: '', budget: '', deadline: '', skills: '' });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
  e.preventDefault();

  try {
    const projectData = {
      title: form.title,
      description: form.description,

      category: form.category,

      required_skills: form.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean),

      budget_type: 'fixed',

      budget_min: Number(
        form.budget.replace(/[^\d.]/g, '')
      ) || 0,

      budget_max: null,

      duration_weeks: null,

      experience_level: 'intermediate',

      deadline: form.deadline
        ? `${form.deadline}T23:59:59`
        : null,
    };

    console.log(
      'Creating project:',
      projectData
    );

    const response =
      await projectService.createProject(
        projectData
      );

    console.log(
      'Project created:',
      response.data
    );

    showToast(
      'Project posted successfully'
    );

    navigate('/client/manage-projects');

  } catch (error) {

    console.error(
      'Project creation failed:',
      error
    );

    console.error(
      'Backend error:',
      error.response?.data
    );

    showToast(
      error.response?.data?.detail ||
      'Failed to post project'
    );
  }
};

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">New project</span>
          <h2>Post Project</h2>
          <p>Describe the work you need from student developers.</p>
        </div>
      </div>

      <form className="card" onSubmit={submit} style={{ maxWidth: '760px' }}>
        <div className="field-grid">
          <div className="field-group full">
            <label>Project Title</label>
            <input value={form.title} onChange={update('title')} placeholder="Project Title" required />
          </div>
          <div className="field-group">
            <label>Category</label>
            <select value={form.category} onChange={update('category')}>
              <option value="">Select category</option>
              <option>Frontend Development</option>
              <option>Backend Development</option>
              <option>Full Stack Development</option>
              <option>UI/UX Design</option>
              <option>AI Project Completion</option>
              <option>Digital Marketing</option>
            </select>
          </div>
          <div className="field-group">
            <label>Skills needed</label>
            <input value={form.skills} onChange={update('skills')} placeholder="React, Node.js" />
          </div>
          <div className="field-group full">
            <label>Description</label>
            <textarea rows={5} value={form.description} onChange={update('description')} placeholder="Describe the work you need" required />
          </div>
          <div className="field-group">
            <label>Budget</label>
            <input value={form.budget} onChange={update('budget')} placeholder="e.g. \u20b930k - \u20b945k" />
          </div>
          <div className="field-group">
            <label>Deadline</label>
            <input type="date" value={form.deadline} onChange={update('deadline')} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Post Project</button>
        </div>
      </form>
    </div>
  );
}
