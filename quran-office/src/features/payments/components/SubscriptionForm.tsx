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
  Box,
  Typography,
  Stack,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import { CloseRounded, PersonRounded, CalendarMonthRounded, PaymentsRounded } from '@mui/icons-material';
import { useStudents } from '../../students/hooks/useStudents';
import { useCreateSubscription } from '../hooks/usePayments';
import { usePaymentStore } from '../store/usePaymentStore';
import type { CreateSubscriptionInput } from '../types';
import toast from 'react-hot-toast';

const SubscriptionForm: React.FC = () => {
  const theme = useTheme();
  const { isSubscriptionFormOpen, setSubscriptionForm } = usePaymentStore();
  const { data: students } = useStudents();
  const createSubscription = useCreateSubscription();

  const { control, handleSubmit, reset, watch, setValue } = useForm<CreateSubscriptionInput>({
    defaultValues: {
      type: 'شهري',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      total_amount: 0,
      status: 'active'
    }
  });

  const subscriptionType = watch('type');
  const startDate = watch('start_date');

  React.useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      if (subscriptionType === 'شهري') {
        start.setMonth(start.getMonth() + 1);
      } else {
        start.setFullYear(start.getFullYear() + 1);
      }
      setValue('end_date', start.toISOString().split('T')[0]);
    }
  }, [subscriptionType, startDate, setValue]);

  const onSubmit = async (data: CreateSubscriptionInput) => {
    try {
      await createSubscription.mutateAsync(data);
      toast.success('تم إنشاء الاشتراك بنجاح');
      reset();
      setSubscriptionForm(false);
    } catch (error: any) {
      toast.error('حدث خطأ أثناء إنشاء الاشتراك');
    }
  };

  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, mt: 1 }}>
      <Box sx={{ color: 'primary.main', display: 'flex' }}>{icon}</Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
        {title}
      </Typography>
    </Stack>
  );

  return (
    <Dialog 
      open={isSubscriptionFormOpen} 
      onClose={() => setSubscriptionForm(false)} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '24px', padding: 1 }
      }}
    >
      <DialogTitle sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>إنشاء اشتراك جديد</Typography>
          <Typography variant="body2" color="text.secondary">تأسيس خطة سداد لطالب جديد</Typography>
        </Box>
        <IconButton onClick={() => setSubscriptionForm(false)} sx={{ bgcolor: 'stone.50' }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3, pt: 0 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <SectionHeader icon={<PersonRounded fontSize="small" />} title="بيانات الطالب" />
              <Controller
                name="student_id"
                control={control}
                rules={{ required: 'هذا الحقل مطلوب' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="اختر الطالب"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {students?.map((s) => (
                      <MenuItem key={s.student_id} value={s.student_id}>
                        {s.first_name} {s.family_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <SectionHeader icon={<PaymentsRounded fontSize="small" />} title="خطة الاشتراك" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select fullWidth label="نوع الاشتراك">
                        <MenuItem value="شهري">شهري</MenuItem>
                        <MenuItem value="سنوي">سنوي</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="total_amount"
                    control={control}
                    rules={{ required: 'مطلوب', min: 1 }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label="المبلغ الإجمالي"
                        error={!!fieldState.error}
                        InputProps={{
                          startAdornment: <Typography variant="caption" sx={{ mr: 1, fontWeight: 700 }}>ج.م</Typography>,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <SectionHeader icon={<CalendarMonthRounded fontSize="small" />} title="الجدول الزمني" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="start_date"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth type="date" label="تاريخ البدء" InputLabelProps={{ shrink: true }} />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="end_date"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth type="date" label="تاريخ الانتهاء" InputLabelProps={{ shrink: true }} />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setSubscriptionForm(false)} sx={{ color: 'stone.500' }}>إلغاء</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={createSubscription.isPending}
            sx={{ px: 4, borderRadius: '12px' }}
          >
            {createSubscription.isPending ? 'جاري الحفظ...' : 'حفظ الاشتراك'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubscriptionForm;
