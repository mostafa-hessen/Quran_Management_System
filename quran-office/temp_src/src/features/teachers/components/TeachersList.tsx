import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Typography,
  Chip,
  IconButton,
  Button,
  Tooltip,
  Avatar
} from '@mui/material';
import { 
  EditRounded, 
  DeleteRounded, 
  AddRounded,
  AutoStoriesRounded
} from '@mui/icons-material';
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '../api/queries';
import TeacherForm, { type TeacherFormData } from './TeacherForm';
import type { Teacher } from '../types/index';
// Add PermissionGate to restrict edit/delete if needed
import { PermissionGate } from '../../auth/components/PermissionGate';
import { Permission } from '../../auth/permissions';

const TeachersList: React.FC = () => {
  const { data: teachers, isLoading, isError } = useTeachers();
  const createTeacherObj = useCreateTeacher();
  const updateTeacherObj = useUpdateTeacher();
  const deleteTeacherObj = useDeleteTeacher();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleOpenForm = (teacher?: Teacher) => {
    setSelectedTeacher(teacher || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedTeacher(null);
  };

  const handleFormSubmit = async (data: TeacherFormData) => {
    try {
      if (selectedTeacher) {
        await updateTeacherObj.mutateAsync({ id: selectedTeacher.teacher_id, data });
      } else {
        await createTeacherObj.mutateAsync(data);
      }
      handleCloseForm();
    } catch (error) {
      console.error('Failed to save teacher', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المعلم؟')) {
      await deleteTeacherObj.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">حدث خطأ أثناء جلب بيانات المعلمين. تأكد من إعداد قاعدة البيانات.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
                إدارة الكادر التعليمي
            </Typography>
            <Typography variant="body2" color="text.secondary">
                متابعة وإدارة بيانات المعلمين والمعلمات وتخصصاتهم
            </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <PermissionGate permission={Permission.TEACHER_CREATE}>
            <Button 
              variant="contained" 
              color="primary"
              component="a"
              href="/staff"
              startIcon={<AddRounded />}
              sx={{ px: 3 }}
            >
              إضافة معلم جديد
            </Button>
          </PermissionGate>
        </Box>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} sx={{ position: 'relative', overflow: 'hidden' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>المعلم</TableCell>
              <TableCell>التخصص والخبرات</TableCell>
              <TableCell>مستوى التجويد</TableCell>
              <TableCell>بيانات الاتصال</TableCell>
              <TableCell>تاريخ التعيين</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell align="center">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers?.map((teacher) => (
              <TableRow key={teacher.teacher_id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 800 }}>
                        {teacher.full_name[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" color="text.primary">
                            {teacher.full_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {teacher.email || 'لا يوجد بريد'}
                        </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(teacher.specializations && teacher.specializations.length > 0) ? (
                      teacher.specializations.map((s: string, idx: number) => (
                        <Chip key={idx} label={s} size="small" variant="soft" color="primary" />
                      ))
                    ) : (
                      <Chip label={teacher.specialization || 'غير محدد'} size="small" variant="outlined" />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{teacher.tajweed_level}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {(teacher.phones && teacher.phones.length > 0) ? (
                      teacher.phones.map((p: any, idx: number) => (
                        <Typography key={idx} variant="caption" sx={{ direction: 'ltr', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <span style={{ color: '#9CA3AF' }}>({p.label})</span> {p.phone}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.disabled">{teacher.phone || '-'}</Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {teacher.hire_date ? (
                      <Typography variant="body2">
                          {new Date(teacher.hire_date).toLocaleDateString('ar-EG')}
                      </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={
                      teacher.status === 'active' ? 'مداوم' : 
                      teacher.status === 'on_leave' ? 'في إجازة' : 'ملغى'
                    } 
                    size="small" 
                    color={
                      teacher.status === 'active' ? 'success' : 
                      teacher.status === 'on_leave' ? 'warning' : 'default'
                    } 
                    sx={{ fontWeight: 700 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <PermissionGate permission={Permission.TEACHER_UPDATE}>
                    <Tooltip title="تعديل الحساب">
                      <IconButton 
                        component="a"
                        href={`/staff?id=${teacher.profile_id}`}
                        size="small"
                        color="primary"
                        sx={{ bgcolor: 'rgba(31, 122, 99, 0.04)' }}
                      >
                        <EditRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </PermissionGate>
                </TableCell>
              </TableRow>
            ))}
            
            {(!teachers || teachers.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 10 }}>
                  <Box sx={{ opacity: 0.5 }}>
                      <AutoStoriesRounded sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="body1">لا يوجد معلمين مسجلين حالياً</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeachersList;
