import axiosInstance from './axiosInstance';

export const officerService = {
  // ✅ ADD 1: Officer Dashboard Stats
  getOfficerDashboard: async () => {
    const res = await axiosInstance.get('/api/v1/officer/complaints/dashboard');
    return res.data.data || res.data;
  },

  // ✅ ADD 2: Department Complaints List
  getDepartmentComplaints: async () => {
    const res = await axiosInstance.get('/api/v1/officer/complaints');
    return res.data.data || res.data;
  },

  acceptComplaint: async (complaintId) => {
    const res = await axiosInstance.patch(
      `/api/v1/officer/complaints/${complaintId}/accept`
    );
    return res.data.data || res.data;
  },

  rejectComplaint: async (complaintId, payload) => {
    const res = await axiosInstance.patch(
      `/api/v1/officer/complaints/${complaintId}/reject`,
      payload
    );
    return res.data.data || res.data;
  },

  startWork: async (complaintId) => {
    const res = await axiosInstance.patch(
      `/api/v1/officer/complaints/${complaintId}/start-work`
    );
    return res.data.data || res.data;
  },

  resolveComplaint: async (complaintId, payload) => {
    const body = {
      resolution_remarks: payload?.resolution_remarks?.trim(),
    };

    if (payload?.resolution_image_url) {
      body.resolution_image_url = payload.resolution_image_url;
    }

    const res = await axiosInstance.patch(
      `/api/v1/officer/complaints/${complaintId}/resolve`,
      body
    );

    return res.data.data || res.data;
  },

  restartWork: async (complaintId) => {
    const res = await axiosInstance.patch(
      `/api/v1/officer/complaints/${complaintId}/restart-work`
    );
    return res.data.data || res.data;
  },
};