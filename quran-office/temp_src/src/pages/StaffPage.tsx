import React from 'react';
import { Box } from '@mui/material';
import StaffList from '../features/staff/components/StaffList';

const StaffPage: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <StaffList />
    </Box>
  );
};

export default StaffPage;
