import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, MenuItem,  Grid, Typography, Box,
  Alert
} from '@mui/material';
import { usePaymentStore } from '../store/usePaymentStore';
import { useCreatePayment, useSubscriptions } from '../hooks/usePayments';
import { Controller, useForm } from 'react-hook-form';
import type { CreatePaymentInput, PaymentMethod } from '../types';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'نقدي', label: 'نقدي' },
  { value: 'تحويل', label: 'تحويل بنكي' },
  { value: 'آخر', label: 'وسيلة أخرى' },
];

export const AddPaymentModal: React.FC = () => {
  const { isAddPaymentModalOpen, selectedSubscriptionId, setAddPaymentModal } = usePaymentStore();
  const { data: subscriptions } = useSubscriptions();
  const createPaymentMutation = useCreatePayment();

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<CreatePaymentInput>({
    defaultValues: {
      subscription_id: selectedSubscriptionId || '',
      amount: 0,
      method: 'نقدي',
      notes: '',
      receipt_number: ''
    }
  });

  // Re-sync form with selected sub when modal opens
  React.useEffect(() => {
    if (selectedSubscriptionId) {
      reset({
        subscription_id: selectedSubscriptionId,
        amount: 0,
        method: 'نقدي',
        notes: '',
        receipt_number: ''
      });
    }
  }, [selectedSubscriptionId, reset]);

  const selectedSub = subscriptions?.find(s => s.subscription_id === watch('subscription_id'));

  const onSubmit = async (data: CreatePaymentInput) => {
    try {
      await createPaymentMutation.mutateAsync(data);
      setAddPaymentModal(false);
      reset();
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <Dialog 
      open={isAddPaymentModalOpen} 
      onClose={() => setAddPaymentModal(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>تسجيل دفعة مالية جديدة</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {createPaymentMutation.isError && (
              <Grid size={12}>
                <Alert severity="error">{createPaymentMutation.error instanceof Error ? createPaymentMutation.error.message : 'حدث خطأ أثناء الحفظ'}</Alert>
              </Grid>
            )}

            <Grid size={12}>
              <Controller
                name="subscription_id"
                control={control}
                rules={{ required: 'يجب اختيار الاشتراك' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="الاشتراك / الطالب"
                    error={!!errors.subscription_id}
                    helperText={errors.subscription_id?.message}
                    disabled={!!selectedSubscriptionId}
                  >
                    {subscriptions && subscriptions.length > 0 ? (
                      subscriptions.map((sub) => (
                        <MenuItem key={sub.subscription_id} value={sub.subscription_id}>
                          {sub.student_name} - {sub.type} ({sub.remaining_amount} متبقي)
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value="">
                        {subscriptions ? 'لا توجد اشتراكات نشطة' : 'جاري التحميل...'}
                      </MenuItem>
                    )}
                  </TextField>
                )}
              />
            </Grid>

            {selectedSub && (
              <Grid size={12}>
                <Box sx={{ p: 2, bgcolor: 'stone.50', borderRadius: 2, border: '1px dashed', borderColor: 'stone.200' }}>
                  <Typography variant="body2" color="text.secondary">المبلغ الإجمالي للاشتراك: {selectedSub.total_amount} ج.م</Typography>
                  <Typography variant="body2" color="text.secondary">المبلغ المتبقي: {selectedSub.remaining_amount} ج.م</Typography>
                </Box>
              </Grid>
            )}

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="amount"
                control={control}
                rules={{ 
                  required: 'المبلغ مطلوب',
                  min: { value: 1, message: 'المبلغ يجب أن يكون أكبر من 0' },
                  validate: (val) => !selectedSub || val <= (selectedSub.remaining_amount || 0) || 'المبلغ يتجاوز المتبقي'
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="المبلغ المدفوع"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="method"
                control={control}
                rules={{ required: 'وسيلة الدفع مطلوبة' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="وسيلة الدفع"
                    error={!!errors.method}
                    helperText={errors.method?.message}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="receipt_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="رقم الإيصال (اختياري)"
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={2}
                    label="ملاحظات"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddPaymentModal(false)} color="inherit">إلغاء</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={createPaymentMutation.isPending}
          >
            {createPaymentMutation.isPending ? 'جاري الحفظ...' : 'حفظ الدفعة'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

