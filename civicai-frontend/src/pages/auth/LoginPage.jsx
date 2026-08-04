import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Divider, InputAdornment
} from '@mui/material';
import { PersonOutlined, Email, LockOutlined } from '@mui/icons-material';
import { loginSchema } from '../../utils/validationSchemas';
import { authService } from '../../services/api/authService';
import { setCredentials } from '../../store/redux/slices/authSlice';
import { setLoading, showSnackbar } from '../../store/redux/slices/uiSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    dispatch(setLoading(true));
    try {
      // Step 1: Login to get token
      const loginRes = await authService.login(data.email, data.password);
      const token = loginRes.access_token;
      
      // Temporarily save token in Redux so Axios interceptor can use it
      dispatch(setCredentials({ token, user: null, role: null }));

      // Step 2: Fetch profile to get role
      const userProfile = await authService.getProfile();
      
      // Step 3: Save full credentials
      dispatch(setCredentials({
        token,
        user: userProfile,
        role: userProfile.role
      }));

      dispatch(showSnackbar({ message: 'Login successful!', severity: 'success' }));

      // Step 4: Role-based redirection
      if (userProfile.role === 'Admin') navigate('/admin/dashboard');
      else if (userProfile.role === 'Officer') navigate('/officer/dashboard');
      else navigate('/citizen/dashboard');

    } catch (error) {
      setApiError('Invalid credentials. Please check your email and password.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 🎨 COLOR THEME SETTINGS (Register page शी match करण्यासाठी)
  const themeColor = '#4f46e5'; // Primary Blue

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f8fafc', // Soft premium background
      p: 2 
    }}>
      <Card sx={{ 
        maxWidth: 450, 
        width: '100%', 
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          
          {/* Clean Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 64, height: 64, borderRadius: '50%', 
              bgcolor: `${themeColor}15`, // 15% opacity of theme color
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              mx: 'auto', mb: 2 
            }}>
              <PersonOutlined sx={{ fontSize: 32, color: themeColor }} />
            </Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', mb: 0.5 }}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="#64748b">
              Login to CivicAI Portal
            </Typography>
          </Box>

          {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiError}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Field */}
            <Box sx={{ mb: 2.5 }}>
              <TextField 
                fullWidth 
                label="Email Address" 
                {...register('email')} 
                error={!!errors.email} 
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ mb: 1 }}>
              <TextField 
                fullWidth 
                label="Password" 
                type="password" 
                {...register('password')} 
                error={!!errors.password} 
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            {/* Forgot Password Link (Optional but recommended for UX) */}
            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: themeColor, fontSize: '0.875rem', fontWeight: 500 }}>
                Forgot Password?
              </Link>
            </Box>
            
            {/* Submit Button */}
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large" 
              sx={{ 
                py: 1.5, 
                borderRadius: 2, 
                fontWeight: 'bold', 
                fontSize: '1rem',
                bgcolor: themeColor,
                boxShadow: `0 4px 14px ${themeColor}40`,
                '&:hover': {
                  bgcolor: themeColor,
                  filter: 'brightness(0.9)',
                  boxShadow: `0 6px 20px ${themeColor}50`,
                }
              }}
            >
              Sign In
            </Button>
          </form>

          <Divider sx={{ my: 3, color: '#94a3b8', '&::before, &::after': { borderColor: '#e2e8f0' } }}>
            <Typography variant="caption" sx={{ px: 1 }}>OR</Typography>
          </Divider>
          
          {/* Footer Link */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="#64748b">
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', fontWeight: '700', color: themeColor }}>
                Register as Citizen
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;