import axiosInstance from './axiosInstance';

export const adminService = {
  // 1. Dashboard & Analytics
  getDashboard: async () => {
    const res = await axiosInstance.get('/api/v1/admin/dashboard');
    return res.data.data;
  },
  getCharts: async () => {
    const res = await axiosInstance.get('/api/v1/admin/dashboard/charts');
    return res.data.data;
  },
  getRecentActivities: async () => {
    const res = await axiosInstance.get('/api/v1/admin/dashboard/recent-activities');
    return res.data.data;
  },

  // 2. Officer Management
  getOfficers: async () => {
    const res = await axiosInstance.get('/api/v1/admin/officers');
    return res.data.data;
  },
  createOfficer: async (data) => {
    const res = await axiosInstance.post('/api/v1/admin/officers', data);
    return res.data.data;
  },
  updateOfficerStatus: async (id, isActive) => {
    const res = await axiosInstance.patch(`/api/v1/admin/officers/${id}/status`, { is_active: isActive });
    return res.data.data;
  },

  // 3. Generic Master Data (Departments, Categories, Priorities)
  getMasterData: async (type) => {
    // type = 'departments' | 'complaint-categories' | 'complaint-priorities'
    const res = await axiosInstance.get(`/api/v1/${type}`);
    return res.data.data;
  },
  createMasterData: async (type, payload) => {
    const res = await axiosInstance.post(`/api/v1/${type}`, payload);
    return res.data.data;
  },
  updateMasterData: async (type, id, payload) => {
    const res = await axiosInstance.put(`/api/v1/${type}/${id}`, payload);
    return res.data.data;
  },
  toggleMasterDataStatus: async (type, id, isActive) => {
    const endpoint = isActive ? 'activate' : 'deactivate';
    const res = await axiosInstance.patch(`/api/v1/${type}/${id}/${endpoint}`);
    return res.data.data;
  },
};