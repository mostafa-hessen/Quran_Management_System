import React from 'react';
import { Box, Container, type ContainerProps, useTheme, alpha } from '@mui/material';

interface PageContainerProps extends ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, maxWidth = 'lg', sx, ...props }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        minHeight: '100%',
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        backgroundColor: 'transparent',
        ...sx
      }}
    >
      <Container maxWidth={maxWidth} disableGutters {...props}>
        {children}
      </Container>
    </Box>
  );
};

