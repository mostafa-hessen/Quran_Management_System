import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        bgcolor: 'background.default', // Use theme token
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CssBaseline />

      {/* Sidebar - Handles its own mobile/desktop logic */}
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - 280px)` },
          minWidth: 0,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Topbar onMenuClick={handleDrawerToggle} />
        
        <Box 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            flexGrow: 1,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 72px)', // height of topbar
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
