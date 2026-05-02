import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store';
import { usePermissions } from '@/features/auth/hooks';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LockRounded } from '@mui/icons-material';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute — wraps pages that are visible ONLY to users with the `admin` role.
 * Non-admin authenticated users see a "403 Access Denied" message rather than
 * being redirected, to avoid confusion.
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { initialized, loading } = useAuthStore();
  const { role } = usePermissions();

  if (!initialized || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (role !== 'admin') {
    return (
      <Box
        sx={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          minHeight: '50vh', gap: 2, color: 'text.secondary',
        }}
      >
        <LockRounded sx={{ fontSize: 64, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          غير مصرّح لك بالوصول إلى هذه الصفحة
        </Typography>
        <Typography variant="body2">
          هذه الصفحة مخصصة لمدير النظام فقط
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
