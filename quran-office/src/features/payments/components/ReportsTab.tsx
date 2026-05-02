import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Stack, 
  useTheme 
} from '@mui/material';
import { 
  WarningAmberRounded, 
  TrendingUpRounded, 
  PeopleAltRounded, 
  AccountBalanceWalletRounded 
} from '@mui/icons-material';
import { useOverdueStudents, useDashboardStats } from '../hooks/usePayments';
import { DataTable, StatsCard, LoadingSkeleton, StatusChip } from '@/shared/components/ui';

const ReportsTab: React.FC = () => {
  const theme = useTheme();
  const { data: overdue, isLoading: loadingOverdue } = useOverdueStudents();
  const { data: stats, isLoading: loadingStats } = useDashboardStats();

  if (loadingOverdue || loadingStats) return <LoadingSkeleton type="table" />;

  const overdueColumns = [
    {
      id: 'full_name',
      label: 'الطالب',
      render: (val: string) => <Typography variant="body2" fontWeight={700}>{val}</Typography>
    },
    {
      id: 'type',
      label: 'الاشتراك',
      render: (val: string) => <StatusChip label={val} color="neutral" />
    },
    {
      id: 'total_amount',
      label: 'المبلغ الإجمالي',
      render: (val: number) => `${val} ج.م`
    },
    {
      id: 'remaining',
      label: 'المتبقي',
      render: (val: number) => (
        <Typography variant="body2" color="error.main" fontWeight={800}>
          {val} ج.م
        </Typography>
      )
    },
    {
      id: 'days_overdue',
      label: 'مدة التأخير',
      render: (val: number) => (
        <Typography variant="body2" color="error.main">
          {val} يوم
        </Typography>
      )
    }
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard 
            title="إجمالي الطلاب النشطين"
            value={stats?.total_students || 0}
            icon={<PeopleAltRounded />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard 
            title="متأخرات السداد"
            value={overdue?.length || 0}
            icon={<WarningAmberRounded />}
            color={theme.palette.error.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard 
            title="الحلقات النشطة"
            value={stats?.total_halaqat || 0}
            icon={<TrendingUpRounded />}
            color={theme.palette.sky.main}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard 
            title="المدرسين"
            value={stats?.total_teachers || 0}
            icon={<AccountBalanceWalletRounded />}
            color={theme.palette.emerald.main}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
        تقرير المتأخرات
      </Typography>
      
      <DataTable 
        columns={overdueColumns} 
        data={overdue || []}
        emptyTitle="لا يوجد متأخرات"
        emptyDescription="جميع الطلاب قاموا بسداد اشتراكاتهم الحالية."
      />
    </Box>
  );
};

export default ReportsTab;
