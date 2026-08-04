import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

const DRAWER_WIDTH = 260;

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // 👇 He 3 hooks add kele
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 👇 Navin user redirect logic — faktu Citizen sathi
  useEffect(() => {
    const seen = localStorage.getItem('civicai_onboarded');
    if (role === 'Citizen' && !seen && location.pathname !== '/citizen/help') {
      navigate('/citizen/help', { replace: true });
    }
  }, [role, location.pathname, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#F4F7FC',
      }}
    >
      <TopNavbar drawerWidth={DRAWER_WIDTH} onMenuClick={handleDrawerToggle} />

      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          p: 3,
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;