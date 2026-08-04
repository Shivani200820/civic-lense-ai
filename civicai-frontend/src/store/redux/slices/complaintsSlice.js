// src/store/redux/slices/complaintsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  myComplaints: [],
  stats: { total: 0, pending: 0, resolved: 0 },
};

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState,
  reducers: {
    setMyComplaints: (state, action) => {
      state.myComplaints = action.payload;
      // Calculate stats on the frontend since citizen dashboard API returns a string
      state.stats.total = action.payload.length;
      state.stats.pending = action.payload.filter(c => c.status_id === 1).length; // Assuming 1 is Pending
      state.stats.resolved = action.payload.filter(c => c.status_id === 4).length; // Assuming 4 is Resolved
    },
  },
});

export const { setMyComplaints } = complaintsSlice.actions;
export default complaintsSlice.reducer;