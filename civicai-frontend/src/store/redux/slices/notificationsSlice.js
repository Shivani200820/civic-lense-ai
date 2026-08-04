// src/store/redux/slices/notificationsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action) => { state.notifications = action.payload; },
    setUnreadCount: (state, action) => { state.unreadCount = action.payload; },
    decrementUnreadCount: (state) => { if(state.unreadCount > 0) state.unreadCount -= 1; },
  },
});

export const { setNotifications, setUnreadCount, decrementUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;