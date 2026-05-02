import React from 'react';
import { Box, Typography, Stack, Breadcrumbs, Link, useTheme } from '@mui/material';
import { ChevronLeftRounded } from '@mui/icons-material';

interface Action {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, breadcrumbs }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 4 }}>
      {breadcrumbs && (
        <Breadcrumbs 
          separator={<ChevronLeftRounded sx={{ fontSize: '1rem', color: 'stone.300' }} />}
          sx={{ mb: 1.5 }}
        >
          {breadcrumbs.map((bc, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{ 
                color: index === breadcrumbs.length - 1 ? 'text.primary' : 'text.secondary',
                fontWeight: index === breadcrumbs.length - 1 ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              {bc.label}
            </Typography>
          ))}
        </Breadcrumbs>
      )}
      
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontFamily: 'Cairo, sans-serif',
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Stack direction="row" spacing={1.5}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

