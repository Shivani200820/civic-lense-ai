import React from 'react';
import { useSelector } from 'react-redux';
import { LinearProgress, Box } from '@mui/material';

const GlobalLoader = () => {
  const isLoading = useSelector((state) => state.ui.isLoading);
  
  if (!isLoading) return null;

  return (
    <Box 
      sx={{ 
        width: '100%', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: 9999,
        // Smooth fade-in and slide-down animation when loader appears
        animation: 'slideDown 0.3s ease-out',
        '@keyframes slideDown': {
          from: { opacity: 0, transform: 'translateY(-10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <LinearProgress
        sx={{
          height: 5, // थोडा जाड (thicker) केला आहे premium look साठी
          borderRadius: 5, // पूर्णपणे गोल टोके (fully rounded ends)
          bgcolor: '#e0f2fe', // खूप light blue track
          '& .MuiLinearProgress-bar': {
            bgcolor: '#1976d2', // App चा primary blue color
            borderRadius: 5,
            // Glowing effect जेणेकरून loader लक्ष वेधून घेईल
            boxShadow: '0 0 12px rgba(25, 118, 210, 0.6)', 
          },
        }}
      />
    </Box>
  );
};

export default GlobalLoader;