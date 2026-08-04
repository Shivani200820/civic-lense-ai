import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch } from '@mui/material';
import { Add } from '@mui/icons-material';
import { adminService } from '../../services/api/adminService';
import { useDispatch } from 'react-redux';
import { setLoading, showSnackbar } from '../../store/redux/slices/uiSlice';

// Configuration for different data types
const CONFIG = {
  departments: { title: 'Departments', apiType: 'departments', fields: ['name', 'description'] },
  categories: { title: 'Complaint Categories', apiType: 'complaint-categories', fields: ['name', 'description'] },
  priorities: { title: 'Priorities', apiType: 'complaint-priorities', fields: ['name', 'level', 'color'] },
};

const MasterDataPage = () => {
  const { type } = useParams(); // 'departments', 'categories', or 'priorities'
  const config = CONFIG[type] || CONFIG.departments;
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchData = async () => {
    dispatch(setLoading(true));
    try {
      const res = await adminService.getMasterData(config.apiType);
      setData(res);
    } catch (e) {} finally { dispatch(setLoading(false)); }
  };

  useEffect(() => { fetchData(); }, [type]);

  const handleCreate = async () => {
    dispatch(setLoading(true));
    try {
      await adminService.createMasterData(config.apiType, formData);
      dispatch(showSnackbar({ message: 'Created successfully', severity: 'success' }));
      setDialogOpen(false);
      setFormData({});
      fetchData();
    } catch (e) {} finally { dispatch(setLoading(false)); }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await adminService.toggleMasterDataStatus(config.apiType, id, !isActive);
      fetchData();
    } catch (e) {}
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">{config.title} Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>Add New</Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                {config.fields.includes('description') && <TableCell>Description</TableCell>}
                {config.fields.includes('level') && <TableCell>Level</TableCell>}
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  {config.fields.includes('description') && <TableCell>{row.description}</TableCell>}
                  {config.fields.includes('level') && <TableCell>{row.level}</TableCell>}
                  <TableCell>
                    <Chip label={row.is_active ? 'Active' : 'Inactive'} color={row.is_active ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Switch checked={row.is_active} onChange={() => handleToggle(row.id, row.is_active)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Generic Create Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add {config.title.slice(0, -1)}</DialogTitle>
        <DialogContent>
          {config.fields.map(field => (
            <TextField 
              key={field} 
              fullWidth 
              label={field.charAt(0).toUpperCase() + field.slice(1)} 
              margin="normal" 
              type={field === 'level' ? 'number' : 'text'}
              value={formData[field] || ''}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterDataPage;