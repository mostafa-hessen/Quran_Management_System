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
  Typography
} from '@mui/material';
import { useStudents } from '../../students/hooks/useStudents';
import { useCreateSubscription } from '../api/queries';
import type { CreateSubscriptionInput } from '../types';
import toast from 'react-hot-toast';

interface SubscriptionFormProps {
  open: boolean;
  onClose: () => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ open, onClose }) => {
  const { data: students } = useStudents();
  const createSubscription = useCreateSubscription();

  const { control, handleSubmit, reset, watch, setValue } = useForm<CreateSubscriptionInput>({
    defaultValues: {
      type: 'شهري',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      total_amount: 0
    }
  });

  const subscriptionType = watch('type');
  const startDate = watch('start_date');

  // Auto-calculate end date based on type
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
      onClose();
    } catch (error: any) {
      toast.error('حدث خطأ أثناء إنشاء الاشتراك');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pb: 1 }}>
        إضافة اشتراك جديد
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="student_id"
                control={control}
                rules={{ required: 'هذا الحقل مطلوب' }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="الطالب"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    {students?.map((student) => (
                      <MenuItem key={student.student_id} value={student.student_id}>
                        {student.first_name} {student.family_name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={6}>
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

            <Grid item xs={6}>
              <Controller
                name="total_amount"
                control={control}
                rules={{ required: 'هذا الحقل مطلوب', min: 1 }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="المبلغ الإجمالي"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    fullWidth 
                    type="date" 
                    label="تاريخ البدء" 
                    InputLabelProps={{ shrink: true }} 
                  />
                )}
              />
            </Grid>

            <Grid item xs={6}>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    fullWidth 
                    type="date" 
                    label="تاريخ الانتهاء" 
                    InputLabelProps={{ shrink: true }} 
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">إلغاء</Button>
          <Button 
            type="submit" 
            variant="contained" 
            loading={createSubscription.isPending}
          >
            حفظ الاشتراك
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubscriptionForm;
