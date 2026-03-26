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
  Button
} from '@mui/material';
import { 
  EditRounded, 
  DeleteRounded, 
  AddRounded 
} from '@mui/icons-material';
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from '../api/queries';
import TeacherForm, { type TeacherFormData } from './TeacherForm';
import type { Teacher } from '../types/index';

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
        await updateTeacherObj.mutateAsync({ id: selectedTeacher.id, data });
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
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">حدث خطأ أثناء جلب البيانات</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold" fontFamily="Tajawal, sans-serif">
          المعلمون
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => handleOpenForm()}
          startIcon={<AddRounded sx={{ ml: 1, mr: -1 }} />}
          sx={{ bgcolor: '#064e3b', '&:hover': { bgcolor: '#047857' } }}
        >
          إضافة معلم
        </Button>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 4 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>رقم الملف</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>الاسم</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>رقم الجوال</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>المؤهل</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>القسم</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>حالة العمل</TableCell>
              <TableCell sx={{ fontWeight: 'bold', px: 3 }}>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers?.map((teacher) => (
              <TableRow
                key={teacher.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: '#fafaf9' } }}
              >
                <TableCell component="th" scope="row">
                  {teacher.internal_id || '-'}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">{teacher.name}</Typography>
                </TableCell>
                <TableCell sx={{ direction: 'ltr', textAlign: 'right' }}>
                  {teacher.phone || '-'}
                </TableCell>
                <TableCell>{teacher.qualification || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={teacher.gender === 'Male' ? 'بنين' : 'بنات'} 
                    size="small" 
                    sx={{ 
                      bgcolor: teacher.gender === 'Male' ? '#e0f2fe' : '#fce7f3', 
                      color: teacher.gender === 'Male' ? '#0369a1' : '#be185d',
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={teacher.job_status === 'Active' ? 'نشط' : 'متوقف'} 
                    size="small" 
                    color={teacher.job_status === 'Active' ? 'success' : 'default'} 
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleOpenForm(teacher)} size="small" sx={{ color: '#0369a1', bgcolor: '#f0f9ff' }}>
                      <EditRounded fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(teacher.id)} size="small" sx={{ color: '#b91c1c', bgcolor: '#fef2f2' }}>
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            
            {(!teachers || teachers.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 5, color: '#94a3b8' }}>
                  لا يوجد معلمين مسجلين
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <TeacherForm 
        open={isFormOpen} 
        onClose={handleCloseForm} 
        onSubmit={handleFormSubmit} 
        initialData={selectedTeacher}
        isLoading={createTeacherObj.isPending || updateTeacherObj.isPending}
      />
    </Box>
  );
};

export default TeachersList;
