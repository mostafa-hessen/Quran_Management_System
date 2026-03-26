import React from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

// إعداد الـ RTL لـ MUI



const MainLayout: React.FC = () => {
  return (
   
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />
          
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              display: 'flex',
              flexDirection: 'column',
              width: { sm: `calc(100% - 280px)` }
            }}
          >
            <Topbar />
            
            <Box sx={{ p: { xs: 2, md: 4 }, flexGrow: 1 }}>
              {/* هنا هتظهر محتويات الصفحات */}
              <Outlet />
            </Box>
          </Box>
        </Box>
    
  );
};

export default MainLayout;
