import React from 'react';
import { Box } from '@mui/material';
import TeachersList from '../features/teachers/components/TeachersList';

const TeachersPage: React.FC = () => {
  return (
    <Box>
      <TeachersList />
    </Box>
  );
};

export default TeachersPage;
