import React from "react";
import { Grid, Box, Typography, Skeleton, useTheme } from "@mui/material";
import { Groups as GroupsIcon } from "@mui/icons-material";
import { HalaqaCard } from "./HalaqaCard";
import type { Halaqa } from "../types";

interface HalaqaGridProps {
  halaqat: Halaqa[] | undefined;
  isLoading: boolean;
}

export const HalaqaGrid: React.FC<HalaqaGridProps> = ({ halaqat, isLoading }) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={i}>
            <Skeleton
              variant="rectangular"
              height={420}
              sx={{ borderRadius: "16px" }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!halaqat || halaqat.length === 0) {
    return (
      <Box
        sx={{
          py: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: theme.palette.stone[50],
          borderRadius: "24px",
          border: `2px dashed ${theme.palette.stone[200]}`,
        }}
      >
        <GroupsIcon sx={{ fontSize: 64, color: theme.palette.stone[300], mb: 2 }} />
        <Typography variant="h6" sx={{ color: theme.palette.stone[600], fontWeight: 700 }}>
          لا توجد حلقات متاحة
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.stone[400], mt: 1 }}>
          ابدأ بإضافة أول حلقة قرآنية للمنصة
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {halaqat.map((halaqa) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={halaqa.halaqa_id}>
          <HalaqaCard halaqa={halaqa} />
        </Grid>
      ))}
    </Grid>
  );
};
