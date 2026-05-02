import React from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import {
  TeacherPerformanceCard,
  HalaqatStatusCard,
} from "@/features/reports/components/ReportCards";
import OverdueReport from "@/features/payments/components/OverdueReport";

const ReportsPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
          التقارير والإحصائيات
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <OverdueReport />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <HalaqatStatusCard />
              <TeacherPerformanceCard />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ReportsPage;
