import api from './api';

export const jobService = {
  getJobs: (page = 1, filters = {}) => api.get('/jobs/', { params: { page, ...filters } }),
  getJob: (id) => api.get(`/jobs/${id}/`),
  createJob: (jobData) => api.post('/jobs/', jobData),
  updateJob: (id, jobData) => api.patch(`/jobs/${id}/`, jobData),
  dashboard: () => api.get('/jobs/dashboard/'),
};
