import api from './api';

export const applicationService = {
  // Get all applications
  getApplications: (page = 1) => api.get(`/applications/?page=${page}`),

  // Get application detail
  getApplication: (id) => api.get(`/applications/${id}/`),

  // Apply to project/job
  apply: (applicationData) => {
    return api.post('/applications/', {
      project: applicationData.projectId || null,
      job: applicationData.jobId || null,
      cover_letter: applicationData.coverLetter,
      proposed_rate: applicationData.proposedRate || null,
      proposed_duration: applicationData.proposedDuration || null,
    });
  },

  accept: (id) => api.patch(`/applications/${id}/accept/`),
  reject: (id) => api.patch(`/applications/${id}/reject/`),

  // Accept application (client)
  acceptApplication: (id) => api.patch(`/applications/${id}/accept/`),

  // Reject application (client)
  rejectApplication: (id) => api.patch(`/applications/${id}/reject/`),

  // Withdraw application (student)
  withdrawApplication: (id) =>
    api.patch(`/applications/${id}/`, { status: 'withdrawn' }),
};