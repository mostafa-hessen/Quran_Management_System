import React, { useEffect } from 'react';
import {
  Dialog, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Typography,
  IconButton, Divider, Alert, Select, FormControl, InputLabel, Chip, OutlinedInput,
  Tooltip,
} from '@mui/material';
import {
  CloseRounded,
  AdminPanelSettingsRounded,
  SchoolRounded,
  SupportAgentRounded,
  AddCircleOutlineRounded,
  RemoveCircleOutlineRounded,
} from '@mui/icons-material';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { StaffMember } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────
const SPECIALIZATIONS = [
  { value: 'حفظ', label: 'تحفيظ' },
  { value: 'تجويد', label: 'تجويد' },
  { value: 'مراجعة', label: 'مراجعة' },
  { value: 'تلاوة', label: 'تلاوة' },
];

const TAJWEED_LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'مجاز'];

const staffSchema = z.object({
  first_name: z.string().min(2, 'الاسم الأول مطلوب'),
  father_name: z.string().optional(),
  grandfather_name: z.string().optional(),
  family_name: z.string().min(2, 'اسم العائلة مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.enum(['admin', 'teacher', 'supervisor']),
  hire_date: z.string().optional(),
  birth_date: z.string().optional(),
  notes: z.string().optional(),
  // Teacher-only fields
  phones: z.array(z.object({
    phone: z.string().min(8, 'رقم الهاتف غير صحيح'),
    label: z.enum(['أساسي', 'واتساب', 'منزل', 'عمل', 'أخر']).default('أساسي')
  })).optional(),
  specializations: z.array(z.string()).min(1, 'اختر تخصصاً واحداً على الأقل').optional(),
  tajweed_level: z.string().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;

// ─── Role Cards ───────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  {
    value: 'teacher',
    label: 'معلم / محفّظ',
    description: 'يدير الحلقات التعليمية وتحفيظ القرآن',
    icon: <SchoolRounded />,
    color: '#059669',
    bg: '#d1fae5',
  },
  {
    value: 'supervisor',
    label: 'سكرتير / مشرف',
    description: 'إدارة الطلاب والتسجيلات والمتابعة اليومية',
    icon: <SupportAgentRounded />,
    color: '#2563eb',
    bg: '#dbeafe',
  },
  {
    value: 'admin',
    label: 'مدير النظام',
    description: 'صلاحيات كاملة على جميع أقسام النظام',
    icon: <AdminPanelSettingsRounded />,
    color: '#7c3aed',
    bg: '#ede9fe',
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────
interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffFormData) => void;
  initialData?: StaffMember | null;
  isLoading?: boolean;
  error?: string;
}

const StaffForm: React.FC<StaffFormProps> = ({
  open, onClose, onSubmit, initialData, isLoading, error,
}) => {
  const isEdit = !!initialData;

  const { control, handleSubmit, watch, reset, formState: { errors } } =
    useForm<StaffFormData>({
      resolver: zodResolver(staffSchema) as any,
      defaultValues: {
        first_name: '',
        father_name: '',
        grandfather_name: '',
        family_name: '',
        email: '',
        password: '',
        phone: '',
        phones: [{ phone: '', label: 'أساسي' }],
        role: 'teacher',
        hire_date: new Date().toISOString().split('T')[0],
        birth_date: '',
        notes: '',
        specializations: ['حفظ'],
        tajweed_level: 'متوسط',
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones",
  });

  const selectedRole = watch('role');
  const isTeacher = selectedRole === 'teacher';

  useEffect(() => {
    if (open) {
      if (initialData) {
        const nameParts = initialData.full_name?.split(' ') || [];
        
        reset({
          first_name: initialData.first_name || nameParts[0] || '',
          father_name: initialData.father_name || nameParts[1] || '',
          grandfather_name: initialData.grandfather_name || nameParts[2] || '',
          family_name: initialData.family_name || nameParts[nameParts.length - 1] || '',
          email: initialData.email,
          password: '',
          phone: initialData.phone || '',
          role: initialData.role,
          hire_date: initialData.hire_date || new Date().toISOString().split('T')[0],
          birth_date: (initialData as any).birth_date || '',
          notes: initialData.notes || '',
          specializations: ['حفظ'],
          tajweed_level: 'متوسط',
        });
      } else {
        reset({
          first_name: '',
          father_name: '',
          grandfather_name: '',
          family_name: '',
          email: '',
          password: '',
          phone: '',
          role: 'teacher',
          hire_date: new Date().toISOString().split('T')[0],
          notes: '',
          specializations: ['حفظ'],
          tajweed_level: 'متوسط',
        });
      }
    }
  }, [open, initialData, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' } }}
    >
      <Box sx={{ bgcolor: '#064e3b', px: 3, py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" color="white" fontFamily="Tajawal, sans-serif">
          {isEdit ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
          <CloseRounded />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit((data: any) => onSubmit(data as StaffFormData))} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1, overflowY: 'auto' }}>

          {error && <Alert severity="error" variant="filled" sx={{ borderRadius: 2, mb: 1 }}>{error}</Alert>}

          {/* Role Selection */}
          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" mb={1} display="block">
              دور الموظف في النظام *
            </Typography>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {ROLE_OPTIONS.map((opt) => (
                    <Box
                      key={opt.value}
                      onClick={() => field.onChange(opt.value)}
                      sx={{
                        flex: 1,
                        p: 1.5,
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: field.value === opt.value ? opt.color : '#e2e8f0',
                        bgcolor: field.value === opt.value ? opt.bg : '#fafaf9',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        textAlign: 'center',
                        '&:hover': { borderColor: opt.color, bgcolor: opt.bg },
                      }}
                    >
                      <Box sx={{ color: opt.color, mb: 0.5, display: 'flex', justifyContent: 'center' }}>
                        {opt.icon}
                      </Box>
                      <Typography variant="caption" fontWeight="bold" display="block" color={field.value === opt.value ? opt.color : 'text.primary'}>
                        {opt.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            />
          </Box>

          <Divider />

          {/* Name Fields */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="الاسم الأول *" error={!!errors.first_name} helperText={errors.first_name?.message} fullWidth size="small" />
              )}
            />
            <Controller
              name="father_name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="اسم الأب" fullWidth size="small" />
              )}
            />
            <Controller
              name="grandfather_name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="اسم الجد" fullWidth size="small" />
              )}
            />
            <Controller
              name="family_name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="اللقب / العائلة *" error={!!errors.family_name} helperText={errors.family_name?.message} fullWidth size="small" />
              )}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="البريد الإلكتروني *" type="email" error={!!errors.email} helperText={errors.email?.message} fullWidth size="small" disabled={isEdit} inputProps={{ dir: 'ltr' }} />
              )}
            />
            {!isTeacher && (
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="رقم الجوال" error={!!errors.phone} helperText={errors.phone?.message} fullWidth size="small" inputProps={{ dir: 'ltr' }} />
                )}
              />
            )}
          </Box>

          {/* Teacher Multi-Phones */}
          {isTeacher && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary">أرقام الهواتف *</Typography>
              {fields.map((field, index) => (
                <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                  <Controller
                    name={`phones.${index}.phone`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="رقم الهاتف" fullWidth size="small" error={!!(errors.phones as any)?.[index]?.phone} inputProps={{ dir: 'ltr' }} />
                    )}
                  />
                  <Controller
                    name={`phones.${index}.label`}
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} select label="النوع" sx={{ width: 120 }} size="small">
                        {['أساسي', 'واتساب', 'منزل', 'عمل', 'أخر'].map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                      </TextField>
                    )}
                  />
                  {fields.length > 1 && (
                    <IconButton size="small" color="error" onClick={() => remove(index)} sx={{ mt: 0.5 }}>
                      <RemoveCircleOutlineRounded />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button
                size="small"
                startIcon={<AddCircleOutlineRounded />}
                onClick={() => append({ phone: '', label: 'أخر' })}
                sx={{ alignSelf: 'start', color: '#064e3b' }}
              >
                إضافة هاتف آخـر
              </Button>
            </Box>
          )}

          {!isEdit && (
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="كلمة المرور الابتدائية *" type="password" error={!!errors.password} helperText={errors.password?.message || 'يجب على الموظف تغييرها لاحقاً'} fullWidth size="small" inputProps={{ dir: 'ltr' }} />
              )}
            />
          )}

          <Controller
            name="hire_date"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="تاريخ التعيين" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} />
            )}
          />

          {/* Teacher-specific fields */}
          {isTeacher && (
            <>
              <Divider>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">بيانات المعلم التعليمية</Typography>
              </Divider>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth size="small" error={!!errors.specializations}>
                  <InputLabel>التخصصات *</InputLabel>
                  <Controller
                    name="specializations"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || []}
                        multiple
                        input={<OutlinedInput label="التخصصات *" />}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {(selected as string[]).map((value) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {SPECIALIZATIONS.map((spec) => (
                          <MenuItem key={spec.value} value={spec.value}>{spec.label}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.specializations && <Typography variant="caption" color="error">{errors.specializations.message}</Typography>}
                </FormControl>

                <Controller
                  name="tajweed_level"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} value={field.value || ''} select label="مستوى التجويد *" fullWidth size="small">
                      {TAJWEED_LEVELS.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>)}
                    </TextField>
                  )}
                />
              </Box>

            </>
          )}

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="ملاحظات" multiline rows={2} fullWidth size="small" />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">إلغاء</Button>
          <Button type="submit" variant="contained" disabled={isLoading} sx={{ bgcolor: '#064e3b', '&:hover': { bgcolor: '#047857' }, px: 4 }}>
            {isLoading ? 'جاري الحفظ...' : isEdit ? 'حفظ التعديلات' : 'إضافة الموظف'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StaffForm;
