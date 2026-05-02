import React from 'react';
import { Card, Box, Typography, alpha, useTheme, Stack } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isUp: boolean;
  };
  color?: string;
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color, subtitle }) => {
  const theme = useTheme();
  const accentColor = color || theme.palette.primary.main;

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          backgroundColor: accentColor,
          opacity: 0.8
        }
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.secondary', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              fontSize: '0.75rem'
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              mt: 0.5, 
              fontWeight: 800, 
              color: 'text.primary',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {value}
          </Typography>
        </Box>
        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(accentColor, 0.08),
              color: accentColor,
            }}
          >
            {icon}
          </Box>
        )}
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 'auto' }}>
        {trend && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: trend.isUp ? 'success.main' : 'error.main',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: alpha(trend.isUp ? theme.palette.success.main : theme.palette.error.main, 0.1),
              px: 1,
              py: 0.25,
              borderRadius: '6px'
            }}
          >
            {trend.isUp ? '+' : '-'}{trend.value}%
          </Typography>
        )}
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Card>
  );
};

