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
  full_name: z.string().min(5, 'يرجى إدخال الاسم الرباعي').max(100),
  phone: z.string().regex(/^05\d{8}$|^01\d{9}$/, 'رقم الجوال غير صحيح'),
  email: z.union([z.string().email('البريد الإلكتروني غير صحيح'), z.literal('')]).optional(),
  specialization: z.enum(['حفظ', 'تجويد', 'كليهما'], { message: 'يجب اختيار التخصص' }),
  tajweed_level: z.enum(['مبتدئ', 'متوسط', 'متقدم', 'مجاز'], { message: 'يجب اختيار مستوى التجويد' }),
  max_students: z.coerce.number().min(1).max(100),
  hire_date: z.string().min(1, 'يجب إدخال تاريخ التعيين'),
  status: z.enum(['active', 'on_leave', 'terminated']),
  notes: z.string().optional()
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
    resolver: zodResolver(teacherSchema) as any,
    defaultValues: {
      full_name: '',
      phone: '',
      email: '',
      specialization: 'حفظ',
      tajweed_level: 'متوسط',
      max_students: 20,
      hire_date: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: ''
    }
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          full_name: initialData.full_name,
          phone: initialData.phone || '',
          email: initialData.email || '',
          specialization: initialData.specialization || 'حفظ',
          tajweed_level: initialData.tajweed_level || 'متوسط',
          max_students: initialData.max_students || 20,
          hire_date: initialData.hire_date || new Date().toISOString().split('T')[0],
          status: initialData.status || 'active',
          notes: initialData.notes || ''
        });
      } else {
        reset({
          full_name: '',
          phone: '',
          email: '',
          specialization: 'حفظ',
          tajweed_level: 'متوسط',
          max_students: 20,
          hire_date: new Date().toISOString().split('T')[0],
          status: 'active',
          notes: ''
        });
      }
    }
  }, [open, initialData, reset]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: 6,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)'
        } 
      }}
    >
      <DialogTitle sx={{ 
        p: 4, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {initialData ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {initialData ? 'تحديث المعلومات المسجلة مسبقاً في النظام' : 'تعبئة بيانات المعلم للانضمام للكادر التعليمي'}
            </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ 
            color: 'text.secondary',
            '&:hover': { color: 'error.main', bgcolor: 'error.lighter' } 
          }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit((data: any) => onSubmit(data as TeacherFormData))}>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Section: Basic Info */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', fontWeight: 800 }}>
                المعلومات الشخصية والاتصال
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Controller
                  name="full_name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="الاسم الرباعي"
                      error={!!errors.full_name}
                      helperText={errors.full_name?.message}
                      fullWidth
                    />
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
                      inputProps={{ dir: 'ltr' }}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="البريد الإلكتروني"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      fullWidth
                      inputProps={{ dir: 'ltr' }}
                    />
                  )}
                />

                <Controller
                  name="hire_date"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="تاريخ التعيين"
                      type="date"
                      error={!!errors.hire_date}
                      helperText={errors.hire_date?.message}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                />
              </Box>
            </Box>

            {/* Section: Professional Info */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', fontWeight: 800 }}>
                التخصص والبيانات المهنية
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <Controller
                  name="specialization"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="التخصص الرئيسي"
                      error={!!errors.specialization}
                      helperText={errors.specialization?.message}
                      fullWidth
                    >
                      <MenuItem value="حفظ">تحفيظ القرآن</MenuItem>
                      <MenuItem value="تجويد">تعليم التجويد</MenuItem>
                      <MenuItem value="كليهما">حفظ وتجويد معاً</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name="tajweed_level"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="مستوى التجويد"
                      error={!!errors.tajweed_level}
                      helperText={errors.tajweed_level?.message}
                      fullWidth
                    >
                      <MenuItem value="مبتدئ">مبتدئ (مبادئ التلاوة)</MenuItem>
                      <MenuItem value="متوسط">متوسط (أحكام النون والمدود)</MenuItem>
                      <MenuItem value="متقدم">متقدم (المخارج والصفات)</MenuItem>
                      <MenuItem value="مجاز">مجاز (قراءات وسند)</MenuItem>
                    </TextField>
                  )}
                />

                <Controller
                  name="max_students"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="السعة القصوى (طلاب)"
                      type="number"
                      error={!!errors.max_students}
                      helperText={errors.max_students?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="حالة العمل الحالية"
                      error={!!errors.status}
                      helperText={errors.status?.message}
                      fullWidth
                    >
                      <MenuItem value="active">مداوم (Active)</MenuItem>
                      <MenuItem value="on_leave">في إجازة (On Leave)</MenuItem>
                      <MenuItem value="terminated">ملغى عقده (Terminated)</MenuItem>
                    </TextField>
                  )}
                />
              </Box>
            </Box>

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ملاحظات وتقييمات إضافية"
                  error={!!errors.notes}
                  helperText={errors.notes?.message}
                  fullWidth
                  multiline
                  rows={3}
                />
              )}
            />

          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, borderTop: '1px solid', borderColor: 'divider', gap: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit" sx={{ px: 4, borderRadius: 3 }}>
            إلغاء
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isLoading}
            sx={{ px: 6, borderRadius: 3 }}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ البيانات'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TeacherForm;
