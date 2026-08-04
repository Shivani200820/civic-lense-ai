import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('civicai_token') || null,
  user: null,
  isAuthenticated: !!localStorage.getItem('civicai_token'),
  role: localStorage.getItem('civicai_role') || null, // 'Citizen', 'Officer', 'Admin'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, role } = action.payload;
      state.token = token;
      state.user = user;
      state.role = role;
      state.isAuthenticated = true;
      localStorage.setItem('civicai_token', token);
      localStorage.setItem('civicai_role', role);
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      localStorage.removeItem('civicai_token');
      localStorage.removeItem('civicai_role');
    },
  },
});

export const { setCredentials, setUserProfile, logout } = authSlice.actions;
export default authSlice.reducer;