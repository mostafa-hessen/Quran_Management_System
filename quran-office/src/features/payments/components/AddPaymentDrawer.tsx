import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  Button, 
  TextField, 
  MenuItem,
  alpha,
  useTheme,
  Alert,
  Divider
} from '@mui/material';
import { 
  CloseRounded, 
  AccountBalanceWalletRounded, 
  ReceiptLongRounded,
  PersonRounded,
  CheckCircleRounded
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useCreatePayment, useSubscriptions } from '../hooks/usePayments';
import { usePaymentStore } from '../store/usePaymentStore';
import { useStudents } from '../../students/hooks/useStudents';
import toast from 'react-hot-toast';

const AddPaymentDrawer: React.FC = () => {
  const theme = useTheme();
  const { isAddPaymentModalOpen, setAddPaymentModal, selectedSubscription } = usePaymentStore();
  const { data: subscriptions } = useSubscriptions();
  const { data: students } = useStudents();
  const createPayment = useCreatePayment(); // Using consolidated hook

  const { control, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      student_id: '',
      subscription_id: '',
      amount: 0,
      method: 'نقدي',
      notes: '',
      receipt_number: ''
    }
  });

  const selectedStudentId = watch('student_id');
  const selectedSubId = watch('subscription_id');
  const amount = watch('amount');

  // Filter subscriptions for the selected student
  const studentSubs = React.useMemo(() => {
    if (!selectedStudentId) return [];
    return (subscriptions || []).filter(s => s.student_id === selectedStudentId);
  }, [selectedStudentId, subscriptions]);

  // Current active subscription for calculation
  const currentSub = React.useMemo(() => {
    return studentSubs.find(s => s.subscription_id === selectedSubId);
  }, [selectedSubId, studentSubs]);

  const remaining = currentSub ? (Number(currentSub.total_amount) - (currentSub.paid_amount || 0)) : 0;

  // Initialize if opened from a specific subscription
  React.useEffect(() => {
    if (isAddPaymentModalOpen && selectedSubscription) {
      reset({
        student_id: selectedSubscription.student_id,
        subscription_id: selectedSubscription.subscription_id,
        amount: Number(selectedSubscription.total_amount) - (selectedSubscription.paid_amount || 0),
        method: 'نقدي',
        notes: '',
        receipt_number: ''
      });
    }
  }, [isAddPaymentModalOpen, selectedSubscription, reset]);

  const onSubmit = async (data: any) => {
    if (data.amount > remaining && remaining > 0) {
      toast.error('المبلغ المدفوع أكبر من المتبقي في الاشتراك');
      return;
    }

    try {
      await createPayment.mutateAsync({
        subscription_id: data.subscription_id,
        amount: Number(data.amount),
        method: data.method,
        notes: data.notes,
        receipt_number: data.receipt_number
      });
      toast.success('تم تسجيل الدفعة بنجاح');
      handleClose();
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الدفعة');
    }
  };

  const handleClose = () => {
    setAddPaymentModal(false);
    reset();
  };

  return (
    <Drawer
      anchor="left"
      open={isAddPaymentModalOpen}
      onClose={handleClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, borderRadius: '0 24px 24px 0', p: 0 }
      }}
    >
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'surface.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={800}>تسجيل دفعة جديدة</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseRounded />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Student Selection */}
            {!selectedSubscription && (
              <Controller
                name="student_id"
                control={control}
                rules={{ required: 'يرجى اختيار الطالب' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="اختار الطالب"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: <PersonRounded sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    }}
                  >
                    {students?.map(s => (
                      <MenuItem key={s.student_id} value={s.student_id}>
                        {s.first_name} {s.family_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            {/* Subscription Selection */}
            {selectedStudentId && !selectedSubscription && (
              <Controller
                name="subscription_id"
                control={control}
                rules={{ required: 'يرجى اختيار الاشتراك' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label="اختار الاشتراك"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: <ReceiptLongRounded sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    }}
                  >
                    {studentSubs.map(s => (
                      <MenuItem key={s.subscription_id} value={s.subscription_id}>
                        {s.type} - {s.start_date} ({Number(s.total_amount) - (s.paid_amount || 0)} متبقي)
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            {selectedSubscription && (
              <Alert severity="info" icon={<PersonRounded />} sx={{ borderRadius: '12px' }}>
                تحصيل دفعة للطالب: <strong>{selectedSubscription.student?.full_name}</strong>
                <br/>
                نوع الاشتراك: <strong>{selectedSubscription.type}</strong>
              </Alert>
            )}

            {currentSub && (
              <Box sx={{ p: 2, bgcolor: alpha(theme.palette.emerald.main, 0.05), borderRadius: '12px', border: '1px dashed', borderColor: 'emerald.main' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="stone.600">المبلغ المتبقي:</Typography>
                  <Typography variant="h6" fontWeight={800} color="emerald.main">{remaining} ج.م</Typography>
                </Stack>
              </Box>
            )}

            <Divider />

            <Controller
              name="amount"
              control={control}
              rules={{ 
                required: 'يرجى إدخال المبلغ',
                min: { value: 1, message: 'المبلغ يجب أن يكون أكبر من صفر' }
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  type="number"
                  label="مبلغ التحصيل"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  InputProps={{
                    startAdornment: <AccountBalanceWalletRounded sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />,
                    endAdornment: <Typography variant="caption" color="text.secondary">ج.م</Typography>
                  }}
                />
              )}
            />

            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <TextField select label="طريقة السداد" fullWidth {...field}>
                  <MenuItem value="نقدي">نقدي</MenuItem>
                  <MenuItem value="تحويل">تحويل بنكي</MenuItem>
                  <MenuItem value="آخر">أخرى</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="receipt_number"
              control={control}
              render={({ field }) => (
                <TextField label="رقم الإيصال اليدوي" fullWidth {...field} placeholder="مثال: RCP-001" />
              )}
            />

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField label="ملاحظات" fullWidth multiline rows={3} {...field} />
              )}
            />
          </Stack>
        </Box>

        <Box sx={{ p: 3, position: 'absolute', bottom: 0, left: 0, right: 0, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'surface.paper' }}>
          <Stack direction="row" spacing={2}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large"
              disabled={createPayment.isPending || !selectedSubId}
              startIcon={createPayment.isPending ? null : <CheckCircleRounded />}
            >
              {createPayment.isPending ? 'جاري التسجيل...' : 'إتمام العملية'}
            </Button>
            <Button variant="text" onClick={handleClose} sx={{ color: 'stone.500' }}>إلغاء</Button>
          </Stack>
        </Box>
      </form>
    </Drawer>
  );
};

export default AddPaymentDrawer;
