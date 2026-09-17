import api from './api';

export const reviewService = {
  getReviews: (params = {}) => api.get('/reviews/', { params }),
  getReview: (id) => api.get(`/reviews/${id}/`),

  // reviewee: target user id, target: { projectId } or { jobId }
  createReview: ({ revieweeId, projectId = null, jobId = null, rating, comment }) =>
    api.post('/reviews/', {
      reviewee: revieweeId,
      project: projectId,
      job: jobId,
      rating,
      comment,
    }),

  updateReview: (id, data) => api.patch(`/reviews/${id}/`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}/`),
};
