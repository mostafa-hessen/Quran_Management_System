import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  MenuItem,
  InputAdornment,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  SearchRounded,
  FilterListRounded,
  AddCardRounded,
  PersonRounded,
} from '@mui/icons-material';
import { useSubscriptions } from '../api/queries';
import { usePaymentStore } from '../store/usePaymentStore';
import { DataTable, StatusChip, LoadingSkeleton } from '@/shared/components/ui';

export const UnifiedPaymentsTable: React.FC = () => {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { setAddPaymentModal } = usePaymentStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('الكل');
  const theme = useTheme();

  const getStatusConfig = (remaining: number, total: number) => {
    if (remaining <= 0) return { label: 'مدفوع', type: 'success' as const };
    if (remaining === total) return { label: 'غير مدفوع', type: 'error' as const };
    return { label: 'جزئي', type: 'warning' as const };
  };

  const filteredSubs = subscriptions?.filter(sub => {
    const matchesSearch = sub.student_name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'الكل' || sub.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
      id: 'type',
      label: 'نوع الاشتراك',
      render: (value: string) => (
        <StatusChip label={value} type="primary" />
      )
    },
    {
      id: 'total_amount',
      label: 'إجمالي المبلغ',
      render: (value: number) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value.toLocaleString()} ج.م
        </Typography>
      )
    },
    {
      id: 'remaining_amount',
      label: 'المتبقي',
      render: (value: number) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 800, 
            color: value > 0 ? 'error.main' : 'success.main' 
          }}
        >
          {value.toLocaleString()} ج.م
        </Typography>
      )
    },
    {
      id: 'status',
      label: 'الحالة',
      render: (_: any, row: any) => {
        const config = getStatusConfig(row.remaining_amount, row.total_amount);
        return <StatusChip label={config.label} type={config.type} />;
      }
    },
    {
      id: 'actions',
      label: 'الإجراءات',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <Tooltip title="تسجيل دفعة">
          <IconButton 
            size="small" 
            onClick={() => setAddPaymentModal(true)}
            sx={{ 
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <AddCardRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  return (
    <Box>
      {/* Filters Section */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        sx={{ mb: 3 }}
      >
        <TextField
          placeholder="البحث عن طالب..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{ minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListRounded sx={{ color: 'text.secondary', mr: 1 }} />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="الكل">جميع الأنواع</MenuItem>
          <MenuItem value="شهري">شهري</MenuItem>
          <MenuItem value="دورة">دورة</MenuItem>
        </TextField>
      </Stack>

      <DataTable 
        columns={columns} 
        data={filteredSubs || []} 
      />
    </Box>
  );
};
