import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { Close, EditRounded } from '@mui/icons-material';
import { usePaymentStore } from '../store/usePaymentStore';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSubscription } from '../api/paymentsApi';
import toast from 'react-hot-toast';

const EditSubscriptionModal: React.FC = () => {
  const { isEditSubscriptionOpen, selectedSubscription, setEditSubscriptionModal } = usePaymentStore();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      type: 'شهري',
      total_amount: 0,
      start_date: '',
      end_date: '',
      status: 'active',
    }
  });

  useEffect(() => {
    if (selectedSubscription) {
      reset({
        type: selectedSubscription.type,
        total_amount: selectedSubscription.total_amount,
        start_date: selectedSubscription.start_date,
        end_date: selectedSubscription.end_date,
        status: selectedSubscription.status,
      });
    }
  }, [selectedSubscription, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => updateSubscription(selectedSubscription!.subscription_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('تم تحديث الاشتراك بنجاح');
      handleClose();
    },
    onError: () => {
      toast.error('حدث خطأ أثناء التحديث');
    }
  });

  const handleClose = () => {
    setEditSubscriptionModal(false, null);
  };

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Dialog
      open={isEditSubscriptionOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '20px' },
      }}
    >
      <DialogTitle sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                bgcolor: 'amber.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'amber.600',
              }}
            >
              <EditRounded />
            </Box>
            <Typography variant="h6" fontWeight="800">تعديل الاشتراك</Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField
              select
              fullWidth
              label="نوع الاشتراك"
              {...register('type')}
            >
              <MenuItem value="شهري">شهري</MenuItem>
              <MenuItem value="سنوي">سنوي</MenuItem>
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="قيمة الاشتراك"
              {...register('total_amount', { required: 'القيمة مطلوبة' })}
              error={!!errors.total_amount}
              helperText={errors.total_amount?.message}
            />

            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                type="date"
                label="تاريخ البدء"
                InputLabelProps={{ shrink: true }}
                {...register('start_date', { required: 'التاريخ مطلوب' })}
              />
              <TextField
                fullWidth
                type="date"
                label="تاريخ الانتهاء"
                InputLabelProps={{ shrink: true }}
                {...register('end_date', { required: 'التاريخ مطلوب' })}
              />
            </Stack>

            <TextField
              select
              fullWidth
              label="الحالة"
              {...register('status')}
            >
              <MenuItem value="active">نشط</MenuItem>
              <MenuItem value="exempt">معفي</MenuItem>
              <MenuItem value="cancelled">ملغي</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={handleClose} color="inherit">إلغاء</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={mutation.isPending}
            sx={{ borderRadius: '10px', px: 4 }}
          >
            {mutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditSubscriptionModal;
