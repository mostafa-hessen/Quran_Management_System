import React from "react";
import { Grid, Skeleton } from "@mui/material";
import {
  AccountBalanceWalletRounded,
  TodayRounded,
  CalendarMonthRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import { useFinancialSummary } from "../hooks/useReports";
import { StatsCard } from "@/shared/components/ui";

export const FinancialSummaryCards: React.FC = () => {
  const { data: summary, isLoading } = useFinancialSummary();

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const cards = [
    {
      title: "دخل اليوم",
      value: `${(summary?.daily_total || 0).toLocaleString()} ج.م`,
      icon: <TodayRounded />,
      color: 'primary' as const,
      trend: { value: 8, isUp: true }
    },
    {
      title: "دخل الشهر",
      value: `${(summary?.monthly_total || 0).toLocaleString()} ج.م`,
      icon: <CalendarMonthRounded />,
      color: 'info' as const,
      trend: { value: 12, isUp: true }
    },
    {
      title: "الخزينة الحالية",
      value: `${((summary?.daily_total || 0) + (summary?.monthly_total || 0)).toLocaleString()} ج.م`,
      icon: <AccountBalanceWalletRounded />,
      color: 'success' as const,
    },
    {
      title: "معدل النمو",
      value: "12%",
      icon: <TrendingUpRounded />,
      color: 'secondary' as const,
      trend: { value: 5, isUp: true }
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <StatsCard
            title={card.title}
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
