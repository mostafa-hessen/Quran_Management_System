import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { calculateAge, formatArabicAge } from '../utils/dateUtils';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface AgeDisplayProps {
  birthDate: string | null | undefined;
  variant?: 'body1' | 'body2' | 'caption' | 'h6';
  showIcon?: boolean;
  isChip?: boolean;
}

const AgeDisplay: React.FC<AgeDisplayProps> = ({ 
  birthDate, 
  variant = 'body2', 
  showIcon = true,
  isChip = false
}) => {
  if (!birthDate) return null;

  const age = calculateAge(birthDate);
  const formattedAge = formatArabicAge(age);

  if (isChip) {
    return (
      <Chip
        icon={showIcon ? <CalendarMonthIcon /> : undefined}
        label={formattedAge}
        size="small"
        variant="outlined"
        sx={{ 
          borderColor: 'divider',
          fontWeight: 500,
          color: 'text.secondary'
        }}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {showIcon && <CalendarMonthIcon sx={{ fontSize: 16, color: 'text.secondary' }} />}
      <Typography variant={variant} color="text.secondary">
        {formattedAge}
      </Typography>
    </Box>
  );
};

export default AgeDisplay;
