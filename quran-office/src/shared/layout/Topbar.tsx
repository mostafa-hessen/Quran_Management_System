import React from 'react';
import { AppBar, Toolbar, Box, IconButton, Avatar, Typography, Badge, Tooltip } from '@mui/material';
import { 
  NotificationsNoneRounded, 
  SearchRounded, 
} from '@mui/icons-material';

const Topbar: React.FC = () => {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #f1f5f9',
        color: '#1e293b',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
        {/* Left Side: Right-Aligned Search & Info for RTL context */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Tooltip title="البحث">
            <IconButton sx={{ backgroundColor: '#f8fafc' }}>
              <SearchRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right Side: Notification & User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton sx={{ backgroundColor: '#f8fafc' }}>
            <Badge badgeContent={4} color="warning" overlap="circular">
              <NotificationsNoneRounded fontSize="small" />
            </Badge>
          </IconButton>

          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              backgroundColor: '#f8fafc', 
              py: 0.5, 
              px: 1.5, 
              borderRadius: '20px',
              border: '1px solid #f1f5f9'
            }}
          >
            <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'Tajawal', lineHeight: 1 }}>
                أحمد محمد
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                مدير النظام
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 38, 
                height: 38, 
                bgcolor: '#064e3b',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            >
              أ
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
