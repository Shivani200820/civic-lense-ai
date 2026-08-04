import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Card, CardContent, Grid, TextField, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, Avatar, 
  Stack, Divider, InputAdornment
} from '@mui/material';
import { 
  Save, LockReset, Person, Email, Phone, Shield, 
  AccountCircle, VpnKey
} from '@mui/icons-material';
import axiosInstance from '../../services/api/axiosInstance';
import { setUserProfile } from '../../store/redux/slices/authSlice';
import { setLoading, showSnackbar } from '../../store/redux/slices/uiSlice';

// Validation Schemas
const profileSchema = yup.object({
  full_name: yup.string().required('Full Name is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits').required('Phone number is required'),
  email: yup.string().email('Invalid email format')
});

const pwdSchema = yup.object({
  current_password: yup.string().required('Current password is required'),
  new_password: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirm_password: yup.string().oneOf([yup.ref('new_password')], 'Passwords must match').required('Please confirm your password')
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [pwdOpen, setPwdOpen] = useState(false);

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const { control, handleSubmit, formState: { errors }, reset } = useForm({ 
    defaultValues: user || {}, 
    resolver: yupResolver(profileSchema) 
  });

  const { control: pwdControl, handleSubmit: handlePwdSubmit, reset: resetPwd, formState: { errors: pwdErrors } } = useForm({ 
    resolver: yupResolver(pwdSchema) 
  });

  // Reset form when user data is loaded
  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  const onProfileSave = async (data) => {
    dispatch(setLoading(true));
    try {
      const res = await axiosInstance.put('/api/v1/users/profile', data);
      dispatch(setUserProfile(res.data.data));
      dispatch(showSnackbar({ message: 'Profile updated successfully', severity: 'success' }));
    } catch (e) {
      dispatch(showSnackbar({ message: e.response?.data?.message || 'Failed to update profile', severity: 'error' }));
    } finally { 
      dispatch(setLoading(false)); 
    }
  };

  const onPwdSave = async (data) => {
    dispatch(setLoading(true));
    try {
      await axiosInstance.patch('/api/v1/auth/change-password', data);
      dispatch(showSnackbar({ message: 'Password changed successfully', severity: 'success' }));
      setPwdOpen(false);
      resetPwd();
    } catch (e) {
      dispatch(showSnackbar({ message: e.response?.data?.message || 'Failed to change password', severity: 'error' }));
    } finally { 
      dispatch(setLoading(false)); 
    }
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ 
          width: 48, height: 48, borderRadius: 2, 
          bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
        }}>
          <AccountCircle sx={{ color: 'white', fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', lineHeight: 1.2 }}>
            My Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b' }}>
            Manage your personal information and account security.
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Left Column: Personal Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Person sx={{ color: 'primary.main', fontSize: 24 }} />
                <Typography variant="h6" fontWeight="700" sx={{ color: '#0f172a' }}>
                  Personal Information
                </Typography>
              </Stack>
              
              <form onSubmit={handleSubmit(onProfileSave)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller 
                      name="full_name" 
                      control={control} 
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          fullWidth 
                          label="Full Name" 
                          error={!!errors.full_name} 
                          helperText={errors.full_name?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person sx={{ color: '#94a3b8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )} 
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller 
                      name="email" 
                      control={control} 
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          fullWidth 
                          label="Email Address" 
                          disabled 
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email sx={{ color: '#94a3b8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': { borderRadius: 2 },
                            '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#64748b', bgcolor: '#f8fafc' }
                          }} 
                        />
                      )} 
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller 
                      name="phone" 
                      control={control} 
                      render={({ field }) => (
                        <TextField 
                          {...field} 
                          fullWidth 
                          label="Phone Number" 
                          error={!!errors.phone} 
                          helperText={errors.phone?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone sx={{ color: '#94a3b8', fontSize: 20 }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                      )} 
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        startIcon={<Save />}
                        sx={{ 
                          px: 4, py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600,
                          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Security & Avatar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Avatar Card */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', textAlign: 'center', p: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, height: 80, mx: 'auto', mb: 2, 
                  bgcolor: 'primary.main', fontSize: 32, fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                {getInitials(user?.full_name)}
              </Avatar>
              <Typography variant="h6" fontWeight="700" sx={{ color: '#0f172a' }}>
                {user?.full_name || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                {user?.email || 'user@example.com'}
              </Typography>
            </Card>

            {/* Security Card */}
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                <Box sx={{ p: 1, bgcolor: '#fff3e0', borderRadius: 2 }}>
                  <Shield sx={{ color: '#ed6c02', fontSize: 24 }} />
                </Box>
                <Typography variant="h6" fontWeight="700" sx={{ color: '#0f172a' }}>
                  Account Security
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                Keep your account secure by updating your password regularly. Use a strong, unique password.
              </Typography>
              <Button 
                fullWidth 
                variant="outlined" 
                color="primary"
                startIcon={<LockReset />} 
                onClick={() => setPwdOpen(true)}
                sx={{ 
                  borderRadius: 2, textTransform: 'none', fontWeight: 600, py: 1.2,
                  borderColor: '#1976d2', color: '#1976d2',
                  '&:hover': { bgcolor: '#e3f2fd', borderColor: '#1565c0' }
                }}
              >
                Change Password
              </Button>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Change Password Dialog */}
      <Dialog 
        open={pwdOpen} 
        onClose={() => setPwdOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <form onSubmit={handlePwdSubmit(onPwdSave)}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
            <Box sx={{ p: 1, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <VpnKey sx={{ color: 'primary.main', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight="700">Change Password</Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={2.5}>
              <Controller 
                name="current_password" 
                control={pwdControl} 
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    type="password" 
                    fullWidth 
                    label="Current Password" 
                    error={!!pwdErrors.current_password} 
                    helperText={pwdErrors.current_password?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )} 
              />
              <Controller 
                name="new_password" 
                control={pwdControl} 
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    type="password" 
                    fullWidth 
                    label="New Password" 
                    error={!!pwdErrors.new_password} 
                    helperText={pwdErrors.new_password?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )} 
              />
              <Controller 
                name="confirm_password" 
                control={pwdControl} 
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    type="password" 
                    fullWidth 
                    label="Confirm New Password" 
                    error={!!pwdErrors.confirm_password} 
                    helperText={pwdErrors.confirm_password?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                )} 
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
            <Button 
              onClick={() => setPwdOpen(false)}
              sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                textTransform: 'none', fontWeight: 600, px: 4, py: 1.2, borderRadius: 2,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
            >
              Update Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;