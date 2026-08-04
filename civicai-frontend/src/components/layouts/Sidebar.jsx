import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import { Dashboard, AddCircle, ListAlt, Person, Settings, Help, Explore } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const menuItems = {
  Citizen: [
    { text: 'Dashboard', icon: <Dashboard />, path: '/citizen/dashboard' },
    { text: 'New Complaint', icon: <AddCircle />, path: '/citizen/new' },
    { text: 'My Complaints', icon: <ListAlt />, path: '/citizen/complaints' },
    { text: 'Explore Complaints', icon: <Explore />, path: '/citizen/explore' },
    { text: 'Profile', icon: <Person />, path: '/citizen/profile' },
{ text: 'Help & Guide', icon: <Help />, path: '/citizen/help' },
  ],

  Officer: [
    { text: 'Dashboard', icon: <Dashboard />, path: '/officer/dashboard' },
    { text: 'Complaints', icon: <ListAlt />, path: '/officer/complaints' },
  ],

  Admin: [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Officers', icon: <Person />, path: '/admin/officers' },
    { text: 'Departments', icon: <Settings />, path: '/admin/master-data/departments' },
    { text: 'Categories', icon: <Settings />, path: '/admin/master-data/categories' },
    { text: 'Priorities', icon: <Settings />, path: '/admin/master-data/priorities' },
  ],
};

const Sidebar = ({ drawerWidth, mobileOpen, isMobile, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useSelector((state) => state.auth);
  
  const items = menuItems[role] || [];

  const drawerContent = (
    <>
      <Toolbar sx={{ justifyContent: 'center', borderBottom: '1px solid #E2E8F0' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">CivicAI</Typography>
      </Toolbar>
      <List sx={{ px: 1, pt: 2 }}>
        {items.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton 
              onClick={() => { navigate(item.path); if(isMobile) onDrawerToggle(); }}
              selected={location.pathname === item.path}
              sx={{ 
                borderRadius: 2,
                '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiSvgIcon-root': { color: 'white' } },
                '&:hover': { bgcolor: 'primary.light', color: 'white' }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {isMobile ? (
        <Drawer variant="temporary" open={mobileOpen} onClose={onDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}>
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer variant="permanent" sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #E2E8F0' } }}>
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;