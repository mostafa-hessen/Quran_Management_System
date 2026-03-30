import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  Autocomplete,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { 
  PersonAddRounded, 
  GroupRounded, 
  DeleteOutlineRounded,
  CheckCircleRounded,
  ScheduleRounded
} from "@mui/icons-material";
import { useStudents } from "@/features/students/hooks/useStudents";
import { useHalaqat } from "@/features/halaqat/hooks/useHalaqat";
import { useEnrollment } from "@/features/enrollments/hooks/useEnrollment";

const EnrollmentsPage: React.FC = () => {
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  const { data: halaqat, isLoading: isLoadingHalaqat } = useHalaqat();
  const { allEnrollments, isLoadingAll, enroll, unenroll, isEnrolling } = useEnrollment();

  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedHalaqa, setSelectedHalaqa] = useState<any>(null);

  const handleEnroll = () => {
    if (!selectedStudent || !selectedHalaqa) return;
    enroll(
      { studentId: selectedStudent.student_id, halaqaId: selectedHalaqa.halaqa_id },
      {
        onSuccess: () => {
          setSelectedStudent(null);
          setSelectedHalaqa(null);
        }
      }
    );
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1600px", mx: "auto" }}>
      {/* Page Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight="bold" color="#1c1917" display="flex" alignItems="center" gap={1}>
          <GroupRounded sx={{ color: "#059669" }} />
          تسجيل الطلاب في الحلقات
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {/* Left Side: Enroll New Form */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            sx={{ 
              p: 3, 
              borderRadius: "16px", 
              border: "1px solid #e7e5e4", 
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              bgcolor: "#ffffff"
            }}
          >
            <Typography variant="h6" fontWeight="bold" mb={3} color="#44403c">
              تسجيل جديد
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="caption" sx={{ color: "#78716c", fontWeight: "bold", mb: 1, display: "block" }}>
                  اختر الطالب
                </Typography>
                <Autocomplete
                  options={students || []}
                  getOptionLabel={(option: any) => `${option.first_name} ${option.last_name}`}
                  value={selectedStudent}
                  onChange={(_, newValue) => setSelectedStudent(newValue)}
                  loading={isLoadingStudents}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="ابحث عن طالب..." 
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": { 
                          bgcolor: "#fafafa", borderRadius: "10px" 
                        }
                      }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: "#78716c", fontWeight: "bold", mb: 1, display: "block" }}>
                  اختر الحلقة
                </Typography>
                <Autocomplete
                  options={halaqat || []}
                  getOptionLabel={(option: any) => option.name}
                  value={selectedHalaqa}
                  onChange={(_, newValue) => setSelectedHalaqa(newValue)}
                  loading={isLoadingHalaqat}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="ابحث عن حلقة..." 
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": { 
                          bgcolor: "#fafafa", borderRadius: "10px" 
                        }
                      }}
                    />
                  )}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={isEnrolling ? <CircularProgress size={20} color="inherit" /> : <PersonAddRounded />}
                onClick={handleEnroll}
                disabled={!selectedStudent || !selectedHalaqa || isEnrolling}
                sx={{
                  bgcolor: "#059669",
                  borderRadius: "12px",
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: "none",
                  "&:hover": { 
                    bgcolor: "#047857",
                    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.2)",
                  },
                  "&:disabled": {
                    bgcolor: "#d6d3d1",
                    color: "#78716c"
                  },
                  textTransform: "none",
                  mt: 2
                }}
              >
                تأكيد الانضمام
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* Right Side: Enrollments List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card 
            sx={{ 
              borderRadius: "16px", 
              border: "1px solid #e7e5e4", 
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              bgcolor: "#ffffff",
              overflow: "hidden"
            }}
          >
            <Box sx={{ p: 3, borderBottom: "1px solid #f5f5f4" }}>
               <Typography variant="h6" fontWeight="bold" color="#44403c">
                 قائمة المسجلين حديثاً
               </Typography>
            </Box>
            
            <TableContainer component={Box} sx={{ maxHeight: '600px', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#57534e', bgcolor: '#fafafa' }}>الطالب</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#57534e', bgcolor: '#fafafa' }}>الحلقة</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#57534e', bgcolor: '#fafafa' }}>تاريخ الانضمام</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#57534e', bgcolor: '#fafafa' }}>الحالة</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#57534e', bgcolor: '#fafafa' }}>إجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoadingAll ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                        <CircularProgress sx={{ color: '#059669' }} />
                      </TableCell>
                    </TableRow>
                  ) : allEnrollments?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#a8a29e' }}>
                        لا توجد تسجيلات حالية.
                      </TableCell>
                    </TableRow>
                  ) : (
                    allEnrollments?.map((enrollment: any) => (
                      <TableRow key={enrollment.enrollment_id} hover>
                        <TableCell sx={{ fontWeight: '500', color: '#292524' }}>
                          {enrollment.student?.first_name} {enrollment.student?.last_name}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={enrollment.halaqa?.name || "غير محدد"} 
                            size="small"
                            sx={{ bgcolor: '#ecfdf5', color: '#059669', fontWeight: 'bold', borderRadius: '8px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#78716c">
                            {new Date(enrollment.join_date).toLocaleDateString('ar-SA')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {enrollment.subscription_status === 'active' ? (
                            <Chip 
                              icon={<CheckCircleRounded fontSize="small" />} 
                              label="نشط" 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              sx={{ border: 'none', bgcolor: '#f0fdf4' }}
                            />
                          ) : (
                            <Chip 
                              icon={<ScheduleRounded fontSize="small" />} 
                              label="معلق" 
                              size="small" 
                              color="warning" 
                              variant="outlined"
                              sx={{ border: 'none', bgcolor: '#fffbeb' }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error"
                            onClick={() => {
                              if(window.confirm("هل أنت متأكد من إزالة الطالب من هذه الحلقة؟")) {
                                unenroll(enrollment.enrollment_id);
                              }
                            }}
                            sx={{ 
                              bgcolor: '#fef2f2', 
                              '&:hover': { bgcolor: '#fee2e2' },
                              p: 1
                            }}
                          >
                            <DeleteOutlineRounded fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnrollmentsPage;
