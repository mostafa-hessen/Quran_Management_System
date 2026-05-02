import React from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, Button, Box, LinearProgress, Stack, Chip
} from '@mui/material';
import { useSubscriptions } from '../hooks/usePayments';
import { usePaymentStore } from '../store/usePaymentStore';
import { AddCard } from '@mui/icons-material';

export const SubscriptionsTable: React.FC = () => {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { setAddPaymentModal } = usePaymentStore();

  if (isLoading) return <LinearProgress />;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الطالب</TableCell>
            <TableCell>نوع الاشتراك</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>المبلغ الكلي</TableCell>
            <TableCell>المسدد</TableCell>
            <TableCell>المتبقي</TableCell>
            <TableCell align="center">الإجراء</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions?.map((sub) => (
            <TableRow key={sub.subscription_id}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {sub.student_name}
                </Typography>
              </TableCell>
              <TableCell>{sub.type}</TableCell>
              <TableCell>
                <Chip 
                  label={sub.status === 'active' ? 'نشط' : 'منتهي'} 
                  size="small"
                  color={sub.status === 'active' ? 'success' : 'error'}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>{sub.total_amount} ج.م</TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {sub.total_paid} ج.م ({Math.round(((sub.total_paid || 0) / sub.total_amount) * 100)}%)
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, ((sub.total_paid || 0) / sub.total_amount) * 100)}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Stack>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  color={(sub.remaining_amount || 0) > 0 ? "error.main" : "success.main"}
                  sx={{ fontWeight: 700 }}
                >
                  {sub.remaining_amount} ج.م
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Button
                  size="small"
                  startIcon={<AddCard />}
                  onClick={() => setAddPaymentModal(true, sub.subscription_id)}
                  disabled={(sub.remaining_amount || 0) <= 0}
                  variant="outlined"
                >
                  دفع
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
