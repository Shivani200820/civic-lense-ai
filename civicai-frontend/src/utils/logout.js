import { storage } from "./storage";

export const logoutUser = (dispatch, navigate, logout, clearUser) => {
  storage.removeToken();

  dispatch(logout());
  dispatch(clearUser());

  navigate("/login");
};