import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import complaintsReducer from './slices/complaintsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    complaints: complaintsReducer,
    notifications: notificationsReducer,
  },
});