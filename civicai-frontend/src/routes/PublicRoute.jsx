import { Navigate, Outlet } from "react-router-dom";
import { storage } from "../utils/storage";
import { isTokenExpired } from "../utils/auth";

const PublicRoute = () => {
  const token = storage.getToken();

  if (token && !isTokenExpired(token)) {
    return <Navigate to="/citizen" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;