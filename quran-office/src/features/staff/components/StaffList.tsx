import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, CircularProgress, IconButton,
  Alert, Tooltip, Badge,
} from '@mui/material';
import {
  AddRounded, EditRounded, BlockRounded, LockResetRounded,
  AdminPanelSettingsRounded, SchoolRounded, SupportAgentRounded,
} from '@mui/icons-material';
import { useStaffMembers, useCreateStaff, useUpdateStaff, useDeactivateStaff } from '../api/queries';
import { resetStaffPassword } from '../api/staffApi';
// ... rest of imports
import maskEmail from '../../../shared/utils/maskEmail';
import StaffForm, { type StaffFormData } from './StaffForm';
import type { StaffMember } from '../types';
import toast from 'react-hot-toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin: {
    label: 'مدير النظام',
    color: '#7c3aed',
    bg: '#ede9fe',
    icon: <AdminPanelSettingsRounded sx={{ fontSize: 14 }} />,
  },
  teacher: {
    label: 'معلم / محفّظ',
    color: '#059669',
    bg: '#d1fae5',
    icon: <SchoolRounded sx={{ fontSize: 14 }} />,
  },
  supervisor: {
    label: 'سكرتير / مشرف',
    color: '#2563eb',
    bg: '#dbeafe',
    icon: <SupportAgentRounded sx={{ fontSize: 14 }} />,
  },
};

const STATUS_CONFIG = {
  active: { label: 'نشط', color: 'success' as const },
  inactive: { label: 'موقوف', color: 'default' as const },
  suspended: { label: 'معلّق', color: 'error' as const },
};

const getInitials = (name: string) =>
  name?.split(' ').slice(0, 2).map(n => n[0]).join('') || '?';

const AVATAR_COLORS = ['#064e3b', '#2563eb', '#7c3aed', '#b45309', '#0e7490'];
const getAvatarColor = (id: string) =>
  AVATAR_COLORS[id.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Component ────────────────────────────────────────────────────────────────
const StaffList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const { data: staff, isLoading, isError } = useStaffMembers();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff();
  const deactivateMutation = useDeactivateStaff();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [formError, setFormError] = useState<string>('');

  // Auto-open form if ID is in URL
  React.useEffect(() => {
    if (staff && editId) {
      const member = staff.find(s => s.id === editId);
      if (member) {
        setSelectedStaff(member);
        setIsFormOpen(true);
        // Clean URL to prevent re-opening on refresh
        setSearchParams({}, { replace: true });
      }
    }
  }, [staff, editId, setSearchParams]);

  const handleOpenForm = (member?: StaffMember) => {
    setSelectedStaff(member || null);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedStaff(null);
    setFormError('');
  };

  const handleSubmit = async (data: StaffFormData) => {
    setFormError('');
    try {
      if (selectedStaff) {
        await updateMutation.mutateAsync({ 
          id: selectedStaff.id, 
          updates: {
            first_name: data.first_name,
            father_name: data.father_name,
            grandfather_name: data.grandfather_name,
            family_name: data.family_name,
            phone: data.phone,
            role: data.role,
            specializations: data.specializations,
            tajweed_level: data.tajweed_level,
            notes: data.notes,
          } 
        });
        toast.success(`تم تحديث بيانات ${data.first_name} بنجاح`, { style: { fontFamily: 'Tajawal, sans-serif' } });
      } else {
        await createMutation.mutateAsync({
          email: data.email,
          password: data.password || '',
          first_name: data.first_name,
          father_name: data.father_name,
          grandfather_name: data.grandfather_name,
          family_name: data.family_name,
          phone: data.phone,
          role: data.role,
          specializations: data.specializations,
          tajweed_level: data.tajweed_level,
          hire_date: data.hire_date,
          notes: data.notes,
        });
        toast.success(`تمت إضافة الموظف ${data.first_name} بنجاح`, { style: { fontFamily: 'Tajawal, sans-serif' } });
      }
      handleCloseForm();
    } catch (err: any) {
      const errorMsg = err.message || 'حدث خطأ غير متوقع';
      setFormError(errorMsg);
      toast.error(errorMsg, { style: { fontFamily: 'Tajawal, sans-serif' } });
    }
  };

  const handleDeactivate = async (id: string, name: string) => {
    if (window.confirm(`هل أنت متأكد من إيقاف حساب "${name}"؟`)) {
      try {
        await deactivateMutation.mutateAsync(id);
        toast.success(`تم إيقاف الحساب بنجاح`, { style: { fontFamily: 'Tajawal, sans-serif' } });
      } catch (err: any) {
        toast.error('فشل إيقاف الحساب: ' + err.message, { style: { fontFamily: 'Tajawal, sans-serif' } });
      }
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    const newPass = window.prompt(`أدخل كلمة المرور الجديدة للموظف "${name}":`);
    if (newPass && newPass.length >= 8) {
      try {
        await resetStaffPassword(id, newPass);
        alert('تم تغيير كلمة المرور بنجاح');
      } catch (err: any) {
        alert('فشل تغيير كلمة المرور: ' + err.message);
      }
    } else if (newPass) {
      alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        حدث خطأ في جلب بيانات الموظفين. يرجى التحقق من إعدادات النظام.
      </Alert>
    );
  }

  const activeCount = staff?.filter(s => s.status === 'active').length || 0;
  const teacherCount = staff?.filter(s => s.role === 'teacher').length || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

      {/* ── Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ mb: 1 }}>
            إدارة شؤون الموظفين
          </Typography>
          <Typography variant="body2" color="text.secondary">
            إدارة كافة حسابات المعلمين والمشرفين والتحكم في صلاحيات الوصول
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => handleOpenForm()}
          startIcon={<AddRounded />}
          sx={{ px: 4 }}
        >
          إضافة موظف جديد
        </Button>
      </Box>

      {/* ── Stats Cards ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
        {[
          { label: 'إجمالي الموظفين', value: staff?.length || 0, color: 'primary.main', icon: <AdminPanelSettingsRounded /> },
          { label: 'موظفون نشطون', value: activeCount, color: 'success.main', icon: <Badge color="success" variant="dot" /> },
          { label: 'الكادر التعليمي', value: teacherCount, color: 'secondary.main', icon: <SchoolRounded /> },
        ].map((stat) => (
          <Paper
            key={stat.label}
            sx={{
              p: 3,
              borderRadius: 6,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <Box>
               <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color, mb: 0.5 }}>
                 {stat.value}
               </Typography>
               <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                 {stat.label}
               </Typography>
            </Box>
            <Box sx={{ 
                bgcolor: 'rgba(0,0,0,0.03)', 
                p: 1.5, 
                borderRadius: 4, 
                display: 'flex', 
                color: stat.color,
                '& > svg': { fontSize: 32 }
              }}>
                {stat.icon}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ── Table ── */}
      <TableContainer component={Paper} sx={{ position: 'relative', overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>الموظف</TableCell>
              <TableCell>الدور الوظيفي</TableCell>
              <TableCell>بيانات التواصل</TableCell>
              <TableCell>تاريخ التعيين</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff?.map((member) => {
              const roleConf = ROLE_CONFIG[member.role] || ROLE_CONFIG.supervisor;
              const statusConf = STATUS_CONFIG[member.status] || STATUS_CONFIG.active;

              return (
                <TableRow
                  key={member.id}
                  sx={{
                    opacity: member.status === 'inactive' ? 0.6 : 1,
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Avatar
                          sx={{
                            bgcolor: 'primary.lighter',
                            color: 'primary.main',
                            width: 44, height: 44,
                            fontWeight: 800,
                            fontSize: '0.9rem'
                          }}
                        >
                          {getInitials(member.full_name)}
                        </Avatar>
                      <Box>
                        <Typography variant="subtitle2" color="text.primary">
                          {member.full_name}
                        </Typography>
                      {/* إخفاء البريد الإلكتروني لأسباب أمان */}
                      <Typography variant="caption" color="text.secondary" sx={{ direction: 'ltr' }}>
                        {maskEmail(member.email)}
                      </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={roleConf.label}
                      size="small"
                      variant="soft"
                      color={member.role === 'admin' ? 'secondary' : member.role === 'teacher' ? 'primary' : 'info'}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ direction: 'ltr', textAlign: 'right', fontWeight: 500 }}>
                      {member.phone || '—'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {member.hire_date
                        ? new Date(member.hire_date).toLocaleDateString('ar-EG')
                        : '—'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={statusConf.label}
                      size="small"
                      color={statusConf.color}
                      variant="soft"
                      sx={{ fontWeight: 800 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="تغيير كلمة المرور">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleResetPassword(member.id, member.full_name)}
                          sx={{ bgcolor: 'warning.lighter' }}
                        >
                          <LockResetRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="تعديل">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenForm(member)}
                          sx={{ bgcolor: 'primary.lighter' }}
                        >
                          <EditRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {member.status === 'active' && (
                        <Tooltip title="إيقاف الحساب">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeactivate(member.id, member.full_name)}
                            sx={{ bgcolor: 'error.lighter' }}
                          >
                            <BlockRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}

            {(!staff || staff.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 12 }}>
                  <Box sx={{ opacity: 0.4 }}>
                      <SupportAgentRounded sx={{ fontSize: 64, mb: 1 }} />
                      <Typography variant="h6">لا يوجد موظفون مسجلون</Typography>
                      <Button
                        variant="soft"
                        size="small"
                        onClick={() => handleOpenForm()}
                        sx={{ mt: 2 }}
                      >
                        إضافة أول موظف الآن
                      </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Form Dialog ── */}
      <StaffForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={selectedStaff}
        isLoading={createMutation.isPending || updateMutation.isPending}
        error={formError}
      />
    </Box>
  );
};

export default StaffList;
