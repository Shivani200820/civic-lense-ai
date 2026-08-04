import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';

import { store } from './store/redux/store';
import theme from './styles/theme';

// Layout
import DashboardLayout from './components/layouts/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Common Pages
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/common/ProfilePage';
import NotFoundPage from './pages/common/NotFoundPage';


// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ComplaintListPage from './pages/citizen/ComplaintListPage';
import ComplaintTrackingPage from './pages/citizen/ComplaintTrackingPage';
import NewComplaintPage from './pages/citizen/NewComplaintPage';
import HelpGuide from "./pages/citizen/HelpGuide";


// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import OfficerComplaintsList from './pages/officer/OfficerComplaintsList';
import OfficerComplaintDetails from './pages/officer/OfficerComplaintDetails';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import OfficerManagement from './pages/admin/OfficerManagement';
import MasterDataPage from './pages/admin/MasterDataPage';



// Global Components
import GlobalLoader from './components/common/GlobalLoader';
import GlobalSnackbar from './components/common/GlobalSnackbar';
import ExploreComplaintsPage from './pages/citizen/ExploreComplaintsPage';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>

          <GlobalLoader />
          <GlobalSnackbar />

          <Routes>

            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ===================== Citizen ===================== */}
            <Route
              path="/citizen"
              element={
                <ProtectedRoute allowedRoles={['Citizen']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<CitizenDashboard />} />

              <Route path="complaints" element={<ComplaintListPage />} />
              <Route
 path="explore"
 element={<ExploreComplaintsPage />}
/>

              <Route
                path="complaints/:id"
                element={<ComplaintTrackingPage />}
              />

              {/* NEW COMPLAINT */}
              <Route
                path="new"
                element={<NewComplaintPage />}
              />
              <Route path="/citizen/help" element={<HelpGuide />} />

              <Route
                path="profile"
                element={<ProfilePage />}
              />
            </Route>

            {/* ===================== Officer ===================== */}
            <Route
              path="/officer"
              element={
                <ProtectedRoute allowedRoles={['Officer', 'Admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route
                path="dashboard"
                element={<OfficerDashboard />}
              />

              <Route
                path="complaints"
                element={<OfficerComplaintsList />}
              />

              <Route
                path="complaints/:id"
                element={<OfficerComplaintDetails />}
              />

              <Route
                path="profile"
                element={<ProfilePage />}
              />
            </Route>

            {/* ===================== Admin ===================== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route
                path="dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="officers"
                element={<OfficerManagement />}
              />

              <Route
                path="master-data/:type"
                element={<MasterDataPage />}
              />
              

              <Route
                path="profile"
                element={<ProfilePage />}
              />
            </Route>

            {/* Other */}
            <Route
              path="/unauthorized"
              element={<div>Unauthorized</div>}
            />

            <Route
              path="*"
              element={<NotFoundPage />}
            />

          </Routes>

        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;