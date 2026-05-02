import React from "react";
import { Box, LinearProgress, Typography, useTheme } from "@mui/material";

interface EnrollmentProgressProps {
  current: number;
  capacity: number;
}

export const EnrollmentProgress: React.FC<EnrollmentProgressProps> = ({ current, capacity }) => {
  const theme = useTheme();
  const percentage = Math.min((current / capacity) * 100, 100);
  
  const getColor = () => {
    if (percentage >= 100) return theme.palette.error.main;
    if (percentage >= 80) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
          نسبة الامتلاء
        </Typography>
        <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 700 }}>
          {current} / {capacity} طالب
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: theme.palette.divider,
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            bgcolor: getColor(),
          },
        }}
      />
    </Box>
  );
};
