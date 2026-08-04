// src/services/api/notificationService.js
import axiosInstance from './axiosInstance';

export const notificationService = {
  getUnreadCount: async () => {
    const response = await axiosInstance.get('/api/v1/notifications/unread-count');
    return response.data.data; // Returns integer
  },
  getNotifications: async () => {
    const response = await axiosInstance.get('/api/v1/notifications');
    return response.data.data;
  },
  markAsRead: async (id) => {
    await axiosInstance.patch(`/api/v1/notifications/${id}/read`);
  },
};