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
  Box,
  Stack,
  alpha,
  useTheme,
  IconButton,
  Divider
} from '@mui/material';
import { CloseRounded, ReceiptRounded, PersonRounded, AccountBalanceWalletRounded } from '@mui/icons-material';
import { useCreatePayment } from '../hooks/usePayments';
import type { CreatePaymentInput, Subscription } from '../types';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ open, onClose, subscription }) => {
  const theme = useTheme();
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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '24px', p: 1 }
      }}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={800} letterSpacing="-0.02em">تحصيل اشتراك</Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'stone.400' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 2, pt: 0 }}>
          {/* Student Info Card */}
          <Box 
            sx={{ 
              mb: 3, 
              p: 2.5, 
              bgcolor: alpha(theme.palette.emerald.main, 0.04), 
              borderRadius: '16px',
              border: `1px solid ${alpha(theme.palette.emerald.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box 
                sx={{ 
                  width: 44, 
                  height: 44, 
                  borderRadius: '12px', 
                  bgcolor: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                }}
              >
                <PersonRounded color="primary" />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="stone.500" fontWeight={600} fontSize="0.75rem">الطالب</Typography>
                <Typography variant="body1" fontWeight={800} color="stone.900">{subscription.student?.full_name}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2, borderColor: alpha(theme.palette.emerald.main, 0.1) }} />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Box>
                <Typography variant="caption" color="stone.500" display="block">الإجمالي</Typography>
                <Typography variant="body2" fontWeight={800}>{subscription.total_amount} ج.م</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="stone.500" display="block">المُسدد مسبقاً</Typography>
                <Typography variant="body2" fontWeight={800} color="emerald.600">{subscription.paid_amount || 0} ج.م</Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="caption" fontWeight={800} color="stone.400" sx={{ mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            تفاصيل الدفعة الحالية
          </Typography>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="amount"
                control={control}
                rules={{ required: 'هذا الحقل مطلوب', min: 1 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="المبلغ المراد تحصيله"
                    placeholder="0.00"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: <ReceiptRounded sx={{ color: 'stone.400', mr: 1, fontSize: 20 }} />,
                      endAdornment: <Typography variant="caption" color="stone.400">ج.م</Typography>
                    }}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="method"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    select 
                    fullWidth 
                    label="طريقة التحصيل"
                    InputProps={{
                      startAdornment: <AccountBalanceWalletRounded sx={{ color: 'stone.400', mr: 1, fontSize: 20 }} />
                    }}
                  >
                    <MenuItem value="نقدي" sx={{ fontWeight: 600 }}>نقدي (كاش)</MenuItem>
                    <MenuItem value="تحويل" sx={{ fontWeight: 600 }}>تحويل بنكي / محفظة</MenuItem>
                    <MenuItem value="آخر" sx={{ fontWeight: 600 }}>أخرى</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="receipt_number"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth label="رقم الإيصال اليدوي (إن وجد)" placeholder="مثلاً: 12345" />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={2} label="ملاحظات إضافية" placeholder="أي ملاحظات حول هذه الدفعة..." />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} variant="text" sx={{ color: 'stone.500', fontWeight: 700 }}>تراجع</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={createPayment.isPending}
            sx={{ px: 4 }}
          >
            {createPayment.isPending ? 'جاري الحفظ...' : 'إتمام التحصيل'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm;

