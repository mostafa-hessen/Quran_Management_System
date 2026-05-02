import React from 'react';
import { Chip, type ChipProps, alpha, useTheme } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'stone' | 'sky' | 'emerald' | 'amber';
}

export const StatusChip: React.FC<StatusChipProps> = ({ color = 'primary', sx, ...props }) => {
  const theme = useTheme();
  
  // Custom color mapping for soft SaaS look
  const getColors = () => {
    const palette = theme.palette as any;
    const targetColor = palette[color] || palette.primary;
    
    return {
      bg: alpha(targetColor.main, 0.08),
      text: targetColor.dark || targetColor.main,
      border: alpha(targetColor.main, 0.12)
    };
  };

  const colors = getColors();

  return (
    <Chip
      {...props}
      sx={{
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: '0.75rem',
        height: '24px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        '& .MuiChip-label': {
          px: 1.5
        },
        ...sx
      }}
    />
  );
};

