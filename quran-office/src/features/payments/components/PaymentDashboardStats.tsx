import React from 'react';
import { Grid, useTheme, Skeleton } from '@mui/material';
import { 
  PaymentsRounded, 
  CheckCircleRounded, 
  WarningRounded 
} from '@mui/icons-material';
import { useDashboardStats } from '../api/queries';
import { StatsCard } from '@/shared/components/ui';

export const PaymentDashboardStats: React.FC = () => {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3].map((i) => (
          <Grid size={{ xs: 12, md: 4 }} key={i}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const cards = [
    {
      label: 'إجمالي الاشتراكات',
      value: `${(stats?.total_expected || 0).toLocaleString()} ج.م`,
      icon: <PaymentsRounded />,
      color: 'primary' as const,
    },
    {
      label: 'الإجمالي المُسدد',
      value: `${(stats?.total_collected || 0).toLocaleString()} ج.م`,
      icon: <CheckCircleRounded />,
      color: 'success' as const,
      trend: { value: 15, isUp: true }
    },
    {
      label: 'الإجمالي المتأخر',
      value: `${((stats?.total_expected || 0) - (stats?.total_collected || 0)).toLocaleString()} ج.م`,
      icon: <WarningRounded />,
      color: 'error' as const,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, md: 4 }} key={index}>
          <StatsCard
            title={card.label}
            value={card.value}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
          />
        </Grid>
      ))}
    </Grid>
  );
};
