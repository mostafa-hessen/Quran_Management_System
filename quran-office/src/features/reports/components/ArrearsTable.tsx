import React from 'react';
import { Typography, Box, IconButton, Tooltip, Avatar, Stack, alpha, useTheme } from '@mui/material';
import { useArrears } from '../hooks/useReports';
import { PhoneRounded, WarningRounded, PersonRounded } from '@mui/icons-material';
import { DataTable, StatusChip, LoadingSkeleton } from '@/shared/components/ui';

export const ArrearsTable: React.FC = () => {
  const { data: arrears, isLoading } = useArrears();
  const theme = useTheme();

  if (isLoading) return <LoadingSkeleton type="table" />;

  const columns = [
    {
      id: 'student_name',
      label: 'الطالب',
      render: (value: string) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'surface.subtle', color: 'text.secondary' }}>
            <PersonRounded sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Stack>
      )
    },
    {
      id: 'due_amount',
      label: 'المبلغ المستحق',
      render: (value: number) => (
        <Typography sx={{ fontWeight: 800, color: 'error.main' }}>
          {value.toLocaleString()} <Typography component="span" variant="caption" sx={{ fontWeight: 600 }}>ج.م</Typography>
        </Typography>
      )
    },
    {
      id: 'days_overdue',
      label: 'أيام التأخير',
      render: (value: number) => (
        <StatusChip 
          label={`${value} يوم`} 
          type={value > 30 ? 'error' : 'warning'}
          icon={<WarningRounded sx={{ fontSize: '14px !important' }} />}
        />
      )
    },
    {
      id: 'guardian_phone',
      label: 'رقم ولي الأمر',
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: 'text.secondary' }}>
          {value}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'الإجراءات',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <Tooltip title="اتصال سريع">
          <IconButton 
            size="small" 
            sx={{ 
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
            component="a"
            href={`tel:${row.guardian_phone}`}
          >
            <PhoneRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={arrears || []} 
    />
  );
};
