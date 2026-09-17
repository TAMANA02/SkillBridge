import api from './api';

export const messageService = {
  // Get all messages
  getMessages: (page = 1) => api.get(`/messages/?page=${page}`),

  // Get conversations
  getConversations: () => api.get('/messages/conversations/'),

  // Get chat with specific user
  getChatWithUser: (recipientId) =>
    api.get(`/messages/with_user/?recipient_id=${recipientId}`),

  // Send message
  sendMessage: (recipientId, content, projectId = null, jobId = null) => {
    return api.post('/messages/', {
      recipient: recipientId,
      content,
      project: projectId,
      job: jobId,
    });
  },

  // Mark message as read
  markAsRead: (messageId) =>
    api.patch(`/messages/${messageId}/`, { is_read: true }),
};