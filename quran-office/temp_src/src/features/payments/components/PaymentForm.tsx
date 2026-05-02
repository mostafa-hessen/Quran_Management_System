import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem, 
  Grid,
  Typography,
  Box
} from '@mui/material';
import { useCreatePayment } from '../api/queries';
import type { CreatePaymentInput, Subscription } from '../types';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ open, onClose, subscription }) => {
  const createPayment = useCreatePayment();

  const { control, handleSubmit, reset } = useForm<CreatePaymentInput>({
    defaultValues: {
      subscription_id: subscription?.subscription_id || '',
      amount: 0,
      method: 'نقدي',
      notes: ''
    }
  });

  // Update default values when subscription changes
  React.useEffect(() => {
    if (subscription) {
      reset({
        subscription_id: subscription.subscription_id,
        amount: Number(subscription.total_amount) - (subscription.paid_amount || 0),
        method: 'نقدي',
        notes: ''
      });
    }
  }, [subscription, reset]);

  const onSubmit = async (data: CreatePaymentInput) => {
    try {
      await createPayment.mutateAsync(data);
      toast.success('تم تسجيل الدفعة بنجاح');
      reset();
      onClose();
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تسجيل الدفعة');
      console.error(error);
    }
  };

  if (!subscription) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>
        تسجيل دفعة جديدة
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(31, 122, 99, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">الطالب:</Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {subscription.student?.full_name}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">إجمالي مطلوب: {subscription.total_amount}</Typography>
              <Typography variant="caption" color="primary.main">مدفوع: {subscription.paid_amount || 0}</Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="amount"
                control={control}
                rules={{ required: 'هذا الحقل مطلوب', min: 1 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="مبلغ الدفعة"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select fullWidth label="طريقة الدفع">
                    <MenuItem value="نقدي">نقدي</MenuItem>
                    <MenuItem value="تحويل">تحويل</MenuItem>
                    <MenuItem value="آخر">آخر</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="receipt_number"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="رقم الإيصال (اختياري)" />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="ملاحظات" />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">إلغاء</Button>
          <Button 
            type="submit" 
            variant="contained" 
            loading={createPayment.isPending}
          >
            تأكيد الدفع
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm;
