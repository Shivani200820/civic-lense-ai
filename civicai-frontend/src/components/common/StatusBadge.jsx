import React from 'react';
import { Chip } from '@mui/material';
import { getStatusConfig } from '../../utils/statusMapper';

const StatusBadge = ({ statusId }) => {
  const config = getStatusConfig(statusId);
  
  return (
    <Chip 
      label={`${config.icon} ${config.label}`} 
      color={config.color} 
      size="small" 
      variant="outlined"
      sx={{ fontWeight: 'bold', borderRadius: 1 }}
    />
  );
};

export default StatusBadge;