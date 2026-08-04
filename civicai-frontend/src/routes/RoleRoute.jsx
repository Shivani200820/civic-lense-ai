import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);

  if (!allowedRoles.includes(role?.toLowerCase())) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;