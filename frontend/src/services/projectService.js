import api from './api';

export const projectService = {
  getProjects: (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page, ...filters });
    return api.get(`/projects/?${params}`);
  },

  getProject: (id) => api.get(`/projects/${id}/`),

  getFeaturedProjects: () => api.get('/projects/featured/'),

  getMatchedProjects: () => api.get('/projects/matched/'),

  searchProjects: (query, filters = {}) => {
    const params = new URLSearchParams({
      search: query,
      ...filters,
    });

    return api.get(`/projects/search/?${params}`);
  },

  createProject: (projectData) =>
    api.post('/projects/', projectData),

  updateProject: (id, projectData) =>
    api.patch(`/projects/${id}/`, projectData),

  getProjectApplications: (id) =>
    api.get(`/projects/${id}/applications/`),

  manageProject: (id, status) =>
    api.post(`/projects/${id}/manage/`, { status }),
};