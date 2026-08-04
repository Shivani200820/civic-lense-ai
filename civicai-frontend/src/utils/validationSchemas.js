import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const registerSchema = yup.object().shape({
  full_name: yup.string().min(2, 'Min 2 characters').max(100).required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Phone must be 10 digits').required('Phone is required'),
  password: yup.string().min(8, 'Min 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password'),
});

// Add to src/utils/validationSchemas.js
export const complaintSchema = yup.object().shape({
  title: yup.string().min(5, 'Min 5 chars').max(255).required('Title is required'),
  description: yup.string().min(10, 'Min 10 chars').max(5000).required('Description is required'),
  latitude: yup.number().required('GPS location is required'),
  longitude: yup.number().required('GPS location is required'),
  final_category_id: yup.number().typeError('Select a category').required('Category is required'),
  final_department_id: yup.number().typeError('Select a department').required('Department is required'),
  final_priority_id: yup.number().typeError('Select a priority').required('Priority is required'),
});

export const rejectSchema = yup.object().shape({
  reason: yup.string().min(10, 'Min 10 characters').max(500).required('Reason is required'),
});

export const resolveSchema = yup.object().shape({
  resolution_remarks: yup.string().min(10, 'Min 10 characters').max(1000).required('Remarks are required'),
});