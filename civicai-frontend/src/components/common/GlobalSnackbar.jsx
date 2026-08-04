import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import {
  CheckCircle,
  Error,
  Info,
  WarningAmber,
} from '@mui/icons-material';
import { hideSnackbar } from '../../store/redux/slices/uiSlice';

const GlobalSnackbar = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.ui.snackbar);

  // Custom icons for a more premium look
  const iconMapping = {
    success: <CheckCircle fontSize="small" />,
    error: <Error fontSize="small" />,
    info: <Info fontSize="small" />,
    warning: <WarningAmber fontSize="small" />,
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(hideSnackbar())}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Changed to top-right for better visibility
      sx={{
        // Smooth slide-in animation
        '& .MuiSnackbar-root': {
          animation: 'slideInRight 0.3s ease-out',
          '@keyframes slideInRight': {
            from: { transform: 'translateX(100%)', opacity: 0 },
            to: { transform: 'translateX(0)', opacity: 1 },
          },
        },
      }}
    >
      <Alert
        onClose={() => dispatch(hideSnackbar())}
        severity={severity}
        variant="standard" // Standard variant allows for better custom styling
        icon={iconMapping[severity] || iconMapping.info}
        sx={{
          width: '100%',
          minWidth: 300,
          maxWidth: 400,
          borderRadius: 2, // Rounded corners matching the app
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // Floating card effect
          border: '1px solid', // Subtle border
          // Dynamic styling based on severity
          ...(severity === 'success' && {
            bgcolor: '#f0fdf4',
            color: '#166534',
            borderColor: '#bbf7d0',
            '& .MuiAlert-icon': { color: '#16a34a' },
          }),
          ...(severity === 'error' && {
            bgcolor: '#fef2f2',
            color: '#991b1b',
            borderColor: '#fecaca',
            '& .MuiAlert-icon': { color: '#dc2626' },
          }),
          ...(severity === 'info' && {
            bgcolor: '#f0f9ff',
            color: '#075985',
            borderColor: '#bae6fd',
            '& .MuiAlert-icon': { color: '#0284c7' },
          }),
          ...(severity === 'warning' && {
            bgcolor: '#fffbeb',
            color: '#92400e',
            borderColor: '#fde68a',
            '& .MuiAlert-icon': { color: '#d97706' },
          }),
          // Typography styling
          '& .MuiAlert-message': {
            fontSize: '0.9rem',
            fontWeight: 500,
          },
          '& .MuiAlert-action': {
            color: 'inherit',
            opacity: 0.7,
            '&:hover': { opacity: 1 },
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;