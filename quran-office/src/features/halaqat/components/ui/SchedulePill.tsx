import React from "react";
import { Box, Typography, alpha, useTheme } from "@mui/material";
import { AccessTime as TimeIcon } from "@mui/icons-material";

interface SchedulePillProps {
  day: string;
  startTime: string;
  endTime: string;
}

const dayLabels: Record<string, string> = {
  Sunday: "الأحد",
  Monday: "الاثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
  Saturday: "السبت",
};

export const SchedulePill: React.FC<SchedulePillProps> = ({ day, startTime, endTime }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.5,
        borderRadius: "8px",
        bgcolor: alpha(theme.palette.emerald.main, 0.08),
        color: theme.palette.emerald.dark,
        border: `1px solid ${alpha(theme.palette.emerald.main, 0.15)}`,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {dayLabels[day] || day}
      </Typography>
      <Box sx={{ width: 1, height: 12, bgcolor: alpha(theme.palette.emerald.main, 0.2) }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <TimeIcon sx={{ fontSize: 12 }} />
        <Typography variant="caption" sx={{ fontWeight: 500 }}>
          {startTime} - {endTime}
        </Typography>
      </Box>
    </Box>
  );
};
