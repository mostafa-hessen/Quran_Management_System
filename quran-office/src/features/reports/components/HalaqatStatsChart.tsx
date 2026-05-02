import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  LinearProgress,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { GroupsRounded, SignalCellularAltRounded } from "@mui/icons-material";
import { useHalaqatStats } from "../hooks/useReports";
import { LoadingSkeleton } from "@/shared/components/ui";

export const HalaqatStatsChart: React.FC = () => {
  const { data: stats, isLoading } = useHalaqatStats();
  const theme = useTheme();

  if (isLoading) return <LoadingSkeleton type="cards" />;

  return (
    <Box>
      <Grid container spacing={3}>
        {stats?.map((halaqa) => {
          const isHigh = halaqa.occupancy_rate > 90;
          const isMed = halaqa.occupancy_rate > 70;
          
          const getColor = () => {
            if (isHigh) return theme.palette.error.main;
            if (isMed) return theme.palette.secondary.main;
            return theme.palette.primary.main;
          };
          
          const color = getColor();

          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={halaqa.halaqa_id}>
              <Card
                sx={{ 
                  p: 2.5, 
                  borderRadius: 4, 
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: alpha(color, 0.3),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 800, color: 'text.primary' }}
                      >
                        {halaqa.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <GroupsRounded
                          sx={{ fontSize: 16, color: 'text.secondary' }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight="600"
                        >
                          {halaqa.student_count} / {halaqa.capacity} طالب
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        bgcolor: alpha(color, 0.1),
                        color: color,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                      }}
                    >
                      {halaqa.occupancy_rate}%
                    </Box>
                  </Box>

                  <Box>
                    <LinearProgress
                      variant="determinate"
                      value={halaqa.occupancy_rate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'surface.subtle',
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          bgcolor: color,
                        },
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
