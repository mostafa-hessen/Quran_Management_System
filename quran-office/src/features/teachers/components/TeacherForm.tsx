import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  MenuItem, 
  Box,
  Typography,
  IconButton
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Teacher } from '../types/index';

const teacherSchema = z.object({
  name: z.string().min(5, 'يرجى إدخال الاسم الرباعي').max(100),
  gender: z.enum(['Male', 'Female'], { message: 'يجب اختيار القسم' }),
  phone: z.union([z.string().regex(/^05\d{8}$|^01\d{9}$/, 'رقم الجوال غير صحيح'), z.literal('')]).optional(),
  identity_number: z.union([z.string().regex(/^\d{10}$/, 'رقم الهوية يجب أن يكون 10 أرقام'), z.literal('')]).optional(),
  qualification: z.union([z.string().max(100), z.literal('')]).optional(),
  address: z.union([z.string().max(255), z.literal('')]).optional()
});

export type TeacherFormData = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherFormData) => void;
  initialData?: Teacher | null;
  isLoading?: boolean;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ open, onClose, onSubmit, initialData, isLoading }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: '',
      gender: 'Male',
      phone: '',
      identity_number: '',
      qualification: '',
      address: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name,
          gender: initialData.gender,
          phone: initialData.phone || '',
          identity_number: initialData.identity_number || '',
          qualification: initialData.qualification || '',
          address: initialData.address || ''
        });
      } else {
        reset({
          name: '',
          gender: 'Male',
          phone: '',
          identity_number: '',
          qualification: '',
          address: ''
        });
      }
    }
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" fontWeight="bold" fontFamily="Tajawal, sans-serif">
          {initialData ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f1f5f9' }}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers sx={{ borderBottom: 'none', borderTop: 'none', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="الاسم الرباعي *"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                size="small"
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="القسم *"
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Male">بنين</MenuItem>
                  <MenuItem value="Female">بنات</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="رقم الجوال"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                  size="small"
                  inputProps={{ dir: 'ltr' }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="identity_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="رقم الهوية"
                  error={!!errors.identity_number}
                  helperText={errors.identity_number?.message}
                  fullWidth
                  size="small"
                  inputProps={{ dir: 'ltr' }}
                />
              )}
            />

            <Controller
              name="qualification"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="المؤهل (مثال: إجازة، شهادة، إلخ)"
                  error={!!errors.qualification}
                  helperText={errors.qualification?.message}
                  fullWidth
                  size="small"
                />
              )}
            />
          </Box>

          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="العنوان"
                error={!!errors.address}
                helperText={errors.address?.message}
                fullWidth
                size="small"
                multiline
                rows={2}
              />
            )}
          />

        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="text" color="inherit">
            إلغاء
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            sx={{ bgcolor: '#064e3b', '&:hover': { bgcolor: '#047857' } }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeacherForm;
