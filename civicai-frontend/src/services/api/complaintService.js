import axiosInstance from './axiosInstance';

export const complaintService = {
  // Dashboard
  getCitizenDashboard: async () => {
    const response = await axiosInstance.get('/api/v1/citizen/dashboard');
    return response.data.data || response.data;
  },

  // My Complaints (Prefix /api/v1 added back)
  getMyComplaints: async () => {
    const response = await axiosInstance.get('/api/v1/complaints/me');
    return response.data.data || response.data;
  },

  // Upload Image & AI Analysis
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('/api/v1/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Master Data
  getCategories: async () => {
    const res = await axiosInstance.get('/api/v1/complaint-categories');
    return res.data.data || res.data;
  },
  getDepartments: async () => {
    const res = await axiosInstance.get('/api/v1/departments');
    return res.data.data || res.data;
  },
  getPriorities: async () => {
    const res = await axiosInstance.get('/api/v1/complaint-priorities');
    return res.data.data || res.data;
  },
  getStatuses: async () => {
    const res = await axiosInstance.get('/api/v1/complaint-statuses');
    return res.data.data || res.data;
  },

  // Create Complaint 
  createComplaint: async (payload) => {
    const response = await axiosInstance.post('/api/v1/complaints', payload);
    return response.data.data || response.data;
  },

  // Support Complaint 
  supportComplaint: async (complaintId) => {
    const response = await axiosInstance.post(`/api/v1/complaints/${complaintId}/support`);
    return response.data.data || response.data;
  },

  // Get Single Complaint 
  getComplaintById: async (id) => {
    const res = await axiosInstance.get(`/api/v1/complaints/${id}`);
    return res.data.data || res.data;
  },

  // Timeline 
  getTimeline: async (id) => {
    const res = await axiosInstance.get(`/api/v1/complaints/${id}/timeline`);
    return res.data.data || res.data;
  },

  // Citizen Confirmation 
  confirmResolution: async (id, payload) => {
    const res = await axiosInstance.patch(`/api/v1/complaints/${id}/confirm`, payload);
    return res.data.data || res.data;
  },

  // Update Complaint 
  updateComplaint: async (id, payload) => {
    const res = await axiosInstance.patch(`/api/v1/complaints/${id}`, payload);
    return res.data.data || res.data;
  },

  // Delete Complaint 
  deleteComplaint: async (id) => {
    const res = await axiosInstance.delete(`/api/v1/complaints/${id}`);
    return res.data.data || res.data;
  },

  // All Complaints (for Explore page) 
  getAllComplaints: async (page = 1, pageSize = 50) => {
    const res = await axiosInstance.get('/api/v1/complaints', {
      params: { page, page_size: pageSize }
    });
    return res.data.data || res.data;
  },
};