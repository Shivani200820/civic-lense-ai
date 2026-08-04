import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Landing from "../pages/landing/Landing";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/citizen"
          element={<h1>Citizen Dashboard</h1>}
        />

        <Route
          path="/officer"
          element={<h1>Officer Dashboard</h1>}
        />

        <Route
          path="/admin"
          element={<h1>Admin Dashboard</h1>}
        />
      </Route>

     

      <Route
        path="*"
        element={<h1>404 Page Not Found</h1>}
      />
      <Route
    path="/"
    element={<Landing />}
/>
    </Routes>
  );
};

export default AppRoutes;