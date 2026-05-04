import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Stack, 
  useTheme, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  SearchRounded, 
  FilterListRounded, 
  AddCardRounded, 
  AccountBalanceWalletRounded, 
  AssignmentTurnedInRounded, 
  PriorityHighRounded,
  HistoryRounded,
  PaymentRounded
} from '@mui/icons-material';
import { useSubscriptions } from '../hooks/usePayments';
import { DataTable, StatsCard, LoadingSkeleton, StatusChip } from '@/shared/components/ui';
import { usePaymentStore } from '../store/usePaymentStore';

const ReportsTab: React.FC = () => {
  const theme = useTheme();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { setAddPaymentModal, setHistoryModal } = usePaymentStore();
  
  const [searchTerm, setSearchTerm] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filteredData = useMemo(() => {
    if (!subscriptions) return [];
    return subscriptions.filter(s => {
      const remaining = Number(s.total_amount) - Number(s.paid_amount || 0);
      const isOverdue = s.status !== 'cancelled' && s.end_date < today && remaining > 0;
      if (!isOverdue) return false;

      const nameMatch = s.student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch;
    });
  }, [subscriptions, searchTerm, today]);

  if (isLoading) return <LoadingSkeleton type="table" />;

  const columns = [
    {
      id: 'student_name',
      label: 'الطالب',
      render: (_: any, row: any) => (
        <Typography variant="body2" fontWeight={700}>
          {row.student?.full_name}
        </Typography>
      )
    },
    {
      id: 'type',
      label: 'النوع',
      render: (val: string) => <StatusChip label={val} color="neutral" />
    },
    {
      id: 'total_amount',
      label: 'الإجمالي',
      render: (val: number) => `${val} ج.م`
    },
    {
      id: 'paid_amount',
      label: 'المدفوع',
      render: (val: number) => (
        <Typography variant="body2" color="success.main" fontWeight={700}>
          {val} ج.م
        </Typography>
      )
    },
    {
      id: 'remaining',
      label: 'المتبقي',
      render: (_: any, row: any) => {
        const remaining = Number(row.total_amount) - Number(row.paid_amount);
        return (
          <Typography variant="body2" color="error.main" fontWeight={800}>
            {remaining} ج.م
          </Typography>
        );
      }
    },
    {
      id: 'end_date',
      label: 'تاريخ الاستحقاق',
      render: (val: string) => (
        <Typography variant="body2" color="error.main" fontWeight={700}>
          {val}
        </Typography>
      )
    },
    {
      id: 'days_overdue',
      label: 'مدة التأخير',
      render: (_: any, row: any) => {
        const diff = new Date(today).getTime() - new Date(row.end_date).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return (
          <Typography variant="body2" color="error.main" fontWeight={800}>
            {days} يوم
          </Typography>
        );
      }
    },

    {
      id: 'actions',
      label: 'إجراء',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="دفع">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => setAddPaymentModal(true, row)}
            >
              <PaymentRounded fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }

  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800} color="error.main">
          قائمة المتأخرين في السداد
        </Typography>
        <TextField
          placeholder="بحث عن طالب..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded fontSize="small" />
                </InputAdornment>
              ),
            }
          }}
          sx={{ width: 300 }}
        />
      </Stack>

      <DataTable 
        columns={columns} 
        data={filteredData}
        emptyTitle="لا يوجد متأخرات"
        emptyDescription="جميع الطلاب قاموا بسداد اشتراكاتهم الحالية أو لا توجد اشتراكات منتهية."
      />
    </Box>
  );
};


export default ReportsTab;

