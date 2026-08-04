import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { Menu as MenuIcon, Logout } from '@mui/icons-material'; // Person आणि Settings काढून टाकले
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';

const TopNavbar = ({ drawerWidth, onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        bgcolor: 'white', 
        color: 'text.primary', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', 
        ml: { md: `${drawerWidth}px` }, 
        width: { md: `calc(100% - ${drawerWidth}px)` } 
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton 
          edge="start" 
          onClick={onMenuClick} 
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        
        {/* Notification Bell */}
        <NotificationBell />
        
        {/* User Profile Menu */}
        <Box sx={{ ml: 2 }}>
          <Box 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f5f5f5' },
              transition: 'background-color 0.2s'
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main', 
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            {/* User Name - Desktop Only */}
            <Typography 
              variant="body2" 
              fontWeight="500" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                color: 'text.primary',
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {user?.full_name || 'User'}
            </Typography>
          </Box>

          {/* Dropdown Menu - फक्त User Info आणि Logout */}
          <Menu 
            anchorEl={anchorEl} 
            open={Boolean(anchorEl)} 
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }
            }}
          >
            {/* User Info Header */}
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight="600" noWrap>
                {user?.full_name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
            
            <Divider />

            {/* फक्त Logout Option */}
            <MenuItem 
              onClick={handleLogout} 
              sx={{ py: 1.5, color: 'error.main' }}
            >
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;