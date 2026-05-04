import React from 'react';
import { Chip, type ChipProps, alpha, useTheme, Box } from '@mui/material';

interface StatusChipProps extends Omit<ChipProps, 'color'> {
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'stone' | 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'violet';
  showDot?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ 
  color = 'primary', 
  showDot = true,
  sx, 
  ...props 
}) => {
  const theme = useTheme();
  
  // Custom color mapping for soft SaaS look
  const getColors = () => {
    const palette = theme.palette as any;
    
    // Default fallback if color doesn't exist in palette
    const targetColor = palette[color] || palette.primary;
    
    // For custom colors not in the standard palette but defined in theme.ts
    // (Assuming they are defined like emerald, sky, etc.)
    return {
      bg: alpha(targetColor.main, 0.1),
      text: targetColor.dark || targetColor.main,
      border: alpha(targetColor.main, 0.2)
    };
  };

  const colors = getColors();

  return (
    <Chip
      {...props}
      icon={
        showDot ? (
          <Box 
            sx={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              bgcolor: colors.text,
              ml: 0.5,
              mr: -0.5
            }} 
          />
        ) : undefined
      }
      sx={{
        borderRadius: '8px',
        fontWeight: 700,
        fontSize: '0.75rem',
        height: '26px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: alpha(colors.bg, 0.15),
          transform: 'translateY(-1px)',
        },
        '& .MuiChip-label': {
          px: 1.2
        },
        '& .MuiChip-icon': {
          color: 'inherit'
        },
        ...sx
      }}
    />
  );
};


