import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, Card, CardContent, TextField, Button, Typography, 
  Alert, Grid, FormControl, InputLabel, Select, MenuItem, InputAdornment 
} from '@mui/material';
import { 
  PersonAdd, Person, Email, Phone, Lock, Language 
} from '@mui/icons-material';
import { registerSchema } from '../../utils/validationSchemas';
import { authService } from '../../services/api/authService';
import { setLoading, showSnackbar } from '../../store/redux/slices/uiSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors } 
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { language: 'English' }
  });

  const onSubmit = async (data) => {
    setApiError('');
    dispatch(setLoading(true));
    try {
      const payload = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        language: data.language
      };

      await authService.register(payload);
      dispatch(showSnackbar({ message: 'Registration successful! Please login.', severity: 'success' }));
      navigate('/login');
    } catch (error) {
      setApiError('Registration failed. Email or Phone might already be in use.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 🎨 COLOR THEME SETTINGS (येथे तुम्ही रंग बदलू शकता)
  const themeColor = '#4f46e5'; // Indigo (जांभळट निळा - AI Theme)
  // const themeColor = '#0d9488'; // Teal (हिरवा - Civic/Resolution Theme)
  // const themeColor = '#ea580c'; // Orange (केशरी - Energy Theme)

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f8fafc', // अगदी हलका ग्रे बॅकग्राउंड
      p: 2 
    }}>
      <Card sx={{ 
        maxWidth: 520, 
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
              <PersonAdd sx={{ fontSize: 32, color: themeColor }} />
            </Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', mb: 0.5 }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="#64748b">
              Register as a Citizen to get started
            </Typography>
          </Box>

          {apiError && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{apiError}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2.5}>
              
              {/* Full Name */}
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  {...register('full_name')} 
                  error={!!errors.full_name} 
                  helperText={errors.full_name?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Person sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Email & Phone */}
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Email" 
                  {...register('email')} 
                  error={!!errors.email} 
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Email sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Phone" 
                  {...register('phone')} 
                  error={!!errors.phone} 
                  helperText={errors.phone?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Password & Confirm Password */}
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Password" 
                  type="password" 
                  {...register('password')} 
                  error={!!errors.password} 
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Confirm Password" 
                  type="password" 
                  {...register('confirmPassword')} 
                  error={!!errors.confirmPassword} 
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94a3b8' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              {/* Language Selection Dropdown */}
              <Grid item xs={12}>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.language}>
                      <InputLabel>Preferred Language</InputLabel>
                      <Select 
                        {...field} 
                        label="Preferred Language"
                        startAdornment={
                          <InputAdornment position="start">
                            <Language sx={{ color: themeColor }} />
                          </InputAdornment>
                        }
                        sx={{ 
                          borderRadius: 2,
                          bgcolor: 'white'
                        }}
                      >
                        <MenuItem value="English">🇬🇧 English</MenuItem>
                        <MenuItem value="Hindi">🇮🇳 Hindi (हिंदी)</MenuItem>
                        <MenuItem value="Marathi">🇮🇳 Marathi (मराठी)</MenuItem>
                      </Select>
                      {errors.language && (
                        <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
                          {errors.language.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  sx={{ 
                    mt: 1, 
                    py: 1.5, 
                    borderRadius: 2, 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    bgcolor: themeColor,
                    boxShadow: `0 4px 14px ${themeColor}40`, // 40% opacity shadow
                    '&:hover': {
                      bgcolor: themeColor,
                      filter: 'brightness(0.9)',
                      boxShadow: `0 6px 20px ${themeColor}50`,
                    }
                  }}
                >
                  Create Account
                </Button>
              </Grid>
            </Grid>
          </form>

          {/* Footer Link */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="#64748b">
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', fontWeight: '700', color: themeColor }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;