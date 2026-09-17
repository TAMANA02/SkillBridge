import api from './api';

export const notificationService = {
  // Get all notifications
  getNotifications: (page = 1) => api.get(`/notifications/?page=${page}`),

  // Get unread count
  getUnreadCount: () => api.get('/notifications/unread_count/'),

  // Mark notification as read
  markAsRead: (id) => api.patch(`/notifications/${id}/mark_as_read/`),

  // Mark all as read
  markAllAsRead: () => api.patch('/notifications/mark_all_as_read/'),
};