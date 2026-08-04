// src/utils/statusMapper.js
export const STATUS_CONFIG = {
  1: { label: 'Pending', color: 'warning', icon: '🕒' },
  2: { label: 'Accepted', color: 'info', icon: '✅' },
  3: { label: 'In Progress', color: 'primary', icon: '🛠️' },
  4: { label: 'Resolved', color: 'success', icon: '🎉' },
  5: { label: 'Closed', color: 'default', icon: '🔒' },
  6: { label: 'Rejected', color: 'error', icon: '❌' },
  7: { label: 'Reopened', color: 'secondary', icon: '🔄' },
};

export const getStatusConfig = (statusId) => {
  return STATUS_CONFIG[statusId] || { label: 'Unknown', color: 'default', icon: '❓' };
};