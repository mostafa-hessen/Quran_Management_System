import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, HistoryRounded, ReceiptLongRounded } from '@mui/icons-material';
import { usePaymentStore } from '../store/usePaymentStore';
import { DataTable, StatusChip } from '@/shared/components/ui';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const SubscriptionHistoryModal: React.FC = () => {
  const { isHistoryModalOpen, selectedSubscription, setHistoryModal } = usePaymentStore();

  const handleClose = () => {
    setHistoryModal(false, null);
  };

  const columns = [
    {
      id: 'payment_date',
      label: 'التاريخ',
      render: (value: string) => (
        <Typography variant="body2">
          {format(new Date(value), 'dd MMMM yyyy', { locale: ar })}
        </Typography>
      ),
    },
    {
      id: 'amount',
      label: 'المبلغ',
      render: (value: number) => (
        <Typography variant="body2" fontWeight={700} color="emerald.600">
          {value} ج.م
        </Typography>
      ),
    },
    {
      id: 'method',
      label: 'وسيلة الدفع',
      render: (value: string) => <StatusChip label={value} color="stone" />,
    },
    {
      id: 'receipt_number',
      label: 'رقم الإيصال',
      render: (value: string) => (
        <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
          {value || '---'}
        </Typography>
      ),
    },
  ];

  return (
    <Dialog
      open={isHistoryModalOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '20px', bgcolor: '#fafaf9' },
      }}
    >
      <DialogTitle sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.600',
              }}
            >
              <HistoryRounded />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="800">
                سجل مدفوعات الاشتراك
              </Typography>
              <Typography variant="caption" color="text.secondary">
                الطالب: {selectedSubscription?.student?.full_name}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Summary Cards */}
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1, p: 2, bgcolor: 'emerald.50', borderRadius: '12px', border: '1px solid', borderColor: 'emerald.100' }}>
              <Typography variant="caption" color="emerald.700" fontWeight={700}>إجمالي الاشتراك</Typography>
              <Typography variant="h6" fontWeight={800} color="emerald.800">{selectedSubscription?.total_amount} ج.م</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, bgcolor: 'sky.50', borderRadius: '12px', border: '1px solid', borderColor: 'sky.100' }}>
              <Typography variant="caption" color="sky.700" fontWeight={700}>المبلغ المُسدد</Typography>
              <Typography variant="h6" fontWeight={800} color="sky.800">{selectedSubscription?.paid_amount || 0} ج.م</Typography>
            </Box>
            <Box sx={{ flex: 1, p: 2, bgcolor: 'amber.50', borderRadius: '12px', border: '1px solid', borderColor: 'amber.100' }}>
              <Typography variant="caption" color="amber.700" fontWeight={700}>المتبقي</Typography>
              <Typography variant="h6" fontWeight={800} color="amber.800">
                {(selectedSubscription?.total_amount || 0) - (selectedSubscription?.paid_amount || 0)} ج.م
              </Typography>
            </Box>
          </Stack>

          <DataTable
            columns={columns}
            data={selectedSubscription?.payments || []}
            emptyTitle="لا توجد مدفوعات"
            emptyDescription="لم يتم تسجيل أي مبالغ مدفوعة لهذا الاشتراك بعد."
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: '10px' }}>
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionHistoryModal;
