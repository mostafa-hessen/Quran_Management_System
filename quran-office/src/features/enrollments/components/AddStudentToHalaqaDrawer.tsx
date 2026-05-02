import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Drawer,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  Chip,
} from "@mui/material";
import {
  Close,
  PersonAdd,
  Search,
} from "@mui/icons-material";
import { useStudents } from "@/features/students/hooks/useStudents";
import { useEnrollMultipleStudents, useHalaqaEnrollments } from "@/features/enrollments/hooks/useEnrollment";
import { Button } from "@/shared/components/ui";
import { useNotification } from "@/shared/hooks/useNotification";

interface AddStudentToHalaqaDrawerProps {
  open: boolean;
  onClose: () => void;
  halaqaId: string;
}

const AddStudentToHalaqaDrawer: React.FC<AddStudentToHalaqaDrawerProps> = ({
  open,
  onClose,
  halaqaId,
}) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: students } = useStudents();
  const { data: enrollments } = useHalaqaEnrollments(halaqaId);
  const enrollMultipleMutation = useEnrollMultipleStudents();
  const { notify } = useNotification();

  // Filter out students already in this halaqa
  const availableStudents = useMemo(() => {
    if (!students) return [];
    const enrolledIds = new Set(enrollments?.map(e => e.student_id));
    return students.filter(s => !enrolledIds.has(s.student_id));
  }, [students, enrollments]);

  const filteredStudents = useMemo(() => {
    return availableStudents.filter(s => {
      const fullName = `${s.first_name} ${s.family_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [availableStudents, searchTerm]);

  const handleToggle = (id: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudentIds.length === filteredStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredStudents.map(s => s.student_id));
    }
  };

  const handleEnroll = () => {
    if (selectedStudentIds.length > 0) {
      enrollMultipleMutation.mutate(
        { studentIds: selectedStudentIds, halaqaId },
        {
          onSuccess: () => {
            onClose();
            setSelectedStudentIds([]);
            setSearchTerm("");
            notify("تم إضافة الطلاب بنجاح", "success");
          },
          onError: (err: any) => {
            notify(err.message || "حدث خطأ، حاول مرة أخرى", "error");
          },
        }
      );
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedStudentIds([]);
    setSearchTerm("");
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          p: 0,
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid', borderColor: 'stone.100' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "stone.800" }}>
          إضافة طلاب للحلقة
        </Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            placeholder="البحث عن طالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'stone.400' }} />
                </InputAdornment>
              ),
              sx: { borderRadius: '12px', bgcolor: 'stone.50' }
            }}
          />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "stone.600" }}>
                الطلاب المتاحين ({filteredStudents.length})
              </Typography>
              {filteredStudents.length > 0 && (
                <Button 
                  size="small" 
                  colorType="ghost"
                  onClick={handleSelectAll}
                >
                  {selectedStudentIds.length === filteredStudents.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
                </Button>
              )}
            </Box>

            {filteredStudents.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'stone.50', borderRadius: '12px' }}>
                <Typography variant="body2" sx={{ color: 'stone.500' }}>
                  لا يوجد طلاب متاحين
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0, '& .MuiListItem-root': { px: 0 } }}>
                {filteredStudents.map((student) => (
                  <ListItem 
                    key={student.student_id}
                    onClick={() => handleToggle(student.student_id)}
                    sx={{ 
                      cursor: 'pointer',
                      borderRadius: '8px',
                      p: 1,
                      mb: 1,
                      '&:hover': { bgcolor: 'stone.50' }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Checkbox
                        edge="start"
                        checked={selectedStudentIds.includes(student.student_id)}
                        disableRipple
                      />
                    </ListItemIcon>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "emerald.100", color: "emerald.700", fontWeight: 700, fontSize: 14, mr: 2 }}>
                      {student.first_name?.[0]}
                    </Avatar>
                    <ListItemText 
                      primary={`${student.first_name} ${student.family_name}`}
                      secondary={
                        <Box component="span">
                          <Box sx={{ display: 'flex', gap: 1, mb: 0.5, alignItems: 'center' }}>
                            <Typography variant="caption" component="span" sx={{ 
                              color: student.gender === "أنثى" ? 'rose.600' : 'sky.600', 
                              fontWeight: 700,
                              bgcolor: student.gender === "أنثى" ? 'rose.50' : 'sky.50',
                              px: 1,
                              borderRadius: '4px'
                            }}>
                              {student.gender || "غير محدد"}
                            </Typography>
                            <Typography variant="caption" component="span" sx={{ color: student.status === "active" ? 'emerald.600' : 'stone.400' }}>
                              • {student.status === "active" ? "نشط" : "غير نشط"}
                            </Typography>
                          </Box>
                          {student.enrolled_halaqat && student.enrolled_halaqat.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {student.enrolled_halaqat.map(h => (
                                <Chip 
                                  key={h.halaqa_id} 
                                  label={h.name} 
                                  size="small" 
                                  variant="outlined" 
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.65rem',
                                    borderColor: 'stone.200',
                                    color: 'stone.600',
                                    bgcolor: 'stone.50'
                                  }} 
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: 'stone.400', display: 'block' }}>
                              غير منضم لحلقات
                            </Typography>
                          )}
                        </Box>
                      }
                      primaryTypographyProps={{ fontWeight: 600, color: 'stone.700', fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'stone.100', bgcolor: 'white' }}>
        <Button
          colorType="primary"
          fullWidth
          size="large"
          startIcon={<PersonAdd />}
          onClick={handleEnroll}
          disabled={selectedStudentIds.length === 0 || enrollMultipleMutation.isPending}
        >
          {enrollMultipleMutation.isPending ? "جاري الإضافة..." : `إضافة (${selectedStudentIds.length}) طلاب`}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AddStudentToHalaqaDrawer;
