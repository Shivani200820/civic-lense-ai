import React, { useEffect } from 'react';
import { IconButton, Badge } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { notificationService } from '../../services/api/notificationService';
import { setUnreadCount } from '../../store/redux/slices/notificationsSlice';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        dispatch(setUnreadCount(count));
      } catch (error) { /* Handled by interceptor */ }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <IconButton>
      <Badge badgeContent={unreadCount} color="error">
        <Notifications />
      </Badge>
    </IconButton>
  );
};

export default NotificationBell;