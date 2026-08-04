import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Switch, Avatar, Stack,
} from '@mui/material';
import { adminService } from '../../services/api/adminService';
import { authService } from '../../services/api/authService';
import GenericDataView from '../../components/admin/GenericDataView';
import { useDispatch } from 'react-redux';
import { setLoading, showSnackbar } from '../../store/redux/slices/uiSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [officers, setOfficers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [citizenData, setCitizenData] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const [offs, depts, citizens, profile] = await Promise.all([
          adminService.getOfficers(),
          adminService.getMasterData('departments'),
          adminService.getCitizenAnalytics(),
          authService.getProfile(),
        ]);
        setOfficers(offs || []);
        setDepartments(depts || []);
        setCitizenData(citizens);
        setAdminProfile(profile);
      } catch (e) {
        /* interceptor handles */
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, [dispatch]);

  const handleToggle = async (id, isActive) => {
    try {
      await adminService.updateOfficerStatus(id, !isActive);
      dispatch(showSnackbar({ message: 'Status updated', severity: 'success' }));
      setOfficers((prev) => prev.map((o) => (o.id === id ? { ...o, is_active: !isActive } : o)));
    } catch (e) {}
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>User Management</Typography>

      <Card>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ px: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Tab label="Officers" />
          <Tab label="Citizens" />
          <Tab label="Admins" />
        </Tabs>

        <CardContent>
          {/* OFFICERS TAB */}
          {tab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Toggle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {officers.map((off) => (
                    <TableRow key={off.id} hover>
                      <TableCell>{off.full_name}</TableCell>
                      <TableCell>{off.email}</TableCell>
                      <TableCell>{off.phone}</TableCell>
                      <TableCell>
                        {departments.find((d) => d.id === off.department_id)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={off.is_active ? 'Active' : 'Inactive'}
                          color={off.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Switch
                          checked={off.is_active}
                          onChange={() => handleToggle(off.id, off.is_active)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* CITIZENS TAB */}
          {tab === 1 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Note: Backend madhe citizens chi direct list endpoint nahiye, mhanun citizen-analytics dakhavli aahe.
              </Typography>
              <GenericDataView data={citizenData} />
            </Box>
          )}

          {/* ADMINS TAB */}
          {tab === 2 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Note: Backend madhe admins chi list endpoint nahiye — fakt current admin profile.
              </Typography>
              {adminProfile && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {adminProfile.full_name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{adminProfile.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {adminProfile.email} • {adminProfile.phone}
                    </Typography>
                    <Chip label={adminProfile.role} color="primary" size="small" sx={{ mt: 1 }} />
                  </Box>
                </Stack>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserManagement;