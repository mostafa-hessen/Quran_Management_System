import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  AddRounded, 
  PaymentsRounded, 
  HistoryRounded,
  ReceiptLongRounded
} from '@mui/icons-material';
import { useSubscriptions } from '../api/queries';
import SubscriptionForm from './SubscriptionForm';
import PaymentForm from './PaymentForm';
import type { Subscription } from '../types';

const PaymentsList: React.FC = () => {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const [isSubFormOpen, setIsSubFormOpen] = useState(false);
  const [isPayFormOpen, setIsPayFormOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);

  const handleOpenPayment = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsPayFormOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">الاشتراكات والمدفوعات</Typography>
          <Typography variant="body2" color="text.secondary">إدارة اشتراكات الطلاب وتحصيل الرسوم</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddRounded />} 
          onClick={() => setIsSubFormOpen(true)}
        >
          اشتراك جديد
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
            <TableRow>
              <TableCell>الطالب</TableCell>
              <TableCell>نوع الاشتراك</TableCell>
              <TableCell>الفترة</TableCell>
              <TableCell>المبلغ الكلي</TableCell>
              <TableCell>المدفوع</TableCell>
              <TableCell>المتبقي</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions?.map((sub) => {
              const remaining = Number(sub.total_amount) - (sub.paid_amount || 0);
              return (
                <TableRow key={sub.subscription_id} hover>
                  <TableCell fontWeight="bold">{sub.student?.full_name}</TableCell>
                  <TableCell>{sub.type}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block' }}>من: {sub.start_date}</Typography>
                    <Typography variant="caption" color="text.secondary">إلى: {sub.end_date}</Typography>
                  </TableCell>
                  <TableCell>{sub.total_amount}</TableCell>
                  <TableCell color="success.main">{sub.paid_amount || 0}</TableCell>
                  <TableCell color={remaining > 0 ? 'error.main' : 'text.secondary'}>
                    {remaining}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={sub.status === 'active' ? 'نشط' : sub.status === 'expired' ? 'منتهي' : 'ملغى'}
                      color={sub.status === 'active' ? 'success' : sub.status === 'expired' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Tooltip title="تسجيل دفعة">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenPayment(sub)}
                          disabled={remaining <= 0}
                        >
                          <PaymentsRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="سجل المدفوعات">
                        <IconButton size="small">
                          <ReceiptLongRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <SubscriptionForm 
        open={isSubFormOpen} 
        onClose={() => setIsSubFormOpen(false)} 
      />
      
      <PaymentForm 
        open={isPayFormOpen} 
        onClose={() => setIsPayFormOpen(false)} 
        subscription={selectedSub}
      />
    </Box>
  );
};

export default PaymentsList;
