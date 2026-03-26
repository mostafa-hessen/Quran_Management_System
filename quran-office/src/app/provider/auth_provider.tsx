import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/features/auth/store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', bgcolor: '#f0fdf4' }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return <>{children}</>;
}
