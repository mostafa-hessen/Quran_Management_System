import React from 'react';
import { Box, Typography, Button, Stack, alpha, useTheme } from '@mui/material';
import { InboxRounded } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha(theme.palette.stone.main, 0.05),
          color: 'stone.300',
          mb: 3
        }}
      >
        {icon || <InboxRounded sx={{ fontSize: 40 }} />}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 400, mb: 4 }}>
          {description}
        </Typography>
      )}
      {action && (
        <Button 
          variant="contained" 
          onClick={action.onClick}
          sx={{ borderRadius: '12px', px: 4 }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
};

