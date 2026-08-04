import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <ErrorOutlinedIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h3" fontWeight="bold" color="primary">404</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>Oops! The page you are looking for does not exist.</Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Go to Homepage</Button>
    </Box>
  );
};
export default NotFoundPage;