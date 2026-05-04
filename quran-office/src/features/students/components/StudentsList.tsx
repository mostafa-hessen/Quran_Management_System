import React, { useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  Edit,
  Person,
  DeleteOutline,
  LocationOn,
} from "@mui/icons-material";
import { useAuthStore } from "@/features/auth/store";
import { useStudents, useFilteredStudents } from "../hooks/useStudents";
import { StudentStatus } from "../types";
import type { FullStudentData, StudentFilterState, ExtendedStudent } from "../types";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { fetchStudentDetails } from "../api/studentsApi";
import { StatusChip } from "@/shared/components/ui/StatusChip";
import AgeDisplay from "./AgeDisplay";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface StudentsListProps {
  filters: StudentFilterState;
}

const StudentsList: React.FC<StudentsListProps> = ({ filters }) => {
  const profile = useAuthStore(state => state.profile);
  const isTeacher = profile?.role === 'teacher';
  
  const { data: students, isLoading, error } = useFilteredStudents(filters);
  const { openEdit, openProfile } = useStudentUIStore();
  
  const [deleteTarget, setDeleteTarget] = useState<FullStudentData | null>(null);

  const handleEditClick = async (studentId: string) => {
    try {
      const fullData = await fetchStudentDetails(studentId);
      openEdit(fullData as FullStudentData);
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">حدث خطأ أثناء تحميل البيانات. يرجى المحاولة لاحقاً.</Typography>
      </Box>
    );
  }

  const renderSkeletons = () => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <TableRow key={i}>
          <TableCell><Skeleton width={20} /></TableCell>
          <TableCell><Skeleton width={150} /></TableCell>
          <TableCell><Skeleton width={100} /></TableCell>
          <TableCell><Skeleton width={80} /></TableCell>
          <TableCell><Skeleton width={60} /></TableCell>
          <TableCell align="center"><Skeleton width={100} /></TableCell>
        </TableRow>
      ))}
    </>
  );

  const renderEmptyState = () => (
    <TableRow>
      <TableCell colSpan={6} sx={{ py: 10, textAlign: 'center' }}>
        <Stack alignItems="center" spacing={2}>
          <Person sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            لا يوجد طلاب يطابقون خيارات البحث
          </Typography>
          <Typography variant="body2" color="text.disabled">
            جرب تغيير الفلاتر أو اسم البحث
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Card sx={{ borderRadius: "16px", border: "1px solid #f5f5f4", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "primary.main" }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>الاسم الكامل</TableCell>
                <TableCell>الحلقة</TableCell>
                <TableCell>تاريخ الميلاد</TableCell>
                <TableCell>الحالة</TableCell>
                <TableCell align="center">إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                renderSkeletons()
              ) : students && students.length > 0 ? (
                students.map((student, index) => (
                  <TableRow key={student.student_id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ color: "#78716c" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: student.gender === 'أنثى' ? 'rose.50' : 'sky.50',
                            color: student.gender === 'أنثى' ? 'rose.600' : 'sky.600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {student.first_name[0]}
                        </Box>
                        <Box>
                          <Typography 
                            variant="body2" 
                            onClick={() => openProfile(student as any)}
                            sx={{ 
                              color: "stone.800", 
                              fontWeight: "700", 
                              cursor: "pointer",
                              "&:hover": { color: "primary.main" }
                            }}
                          >
                            {`${student.first_name} ${student.father_name || ""} ${student.family_name}`}
                          </Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <LocationOn sx={{ fontSize: "0.875rem", color: "stone.400" }} />
                            <Typography variant="caption" sx={{ color: student.address ? "text.secondary" : "stone.400", fontStyle: student.address ? "normal" : "italic" }}>
                              {student.address || "بدون عنوان"}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {student.enrolled_halaqat && student.enrolled_halaqat.length > 0 ? (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, maxWidth: 220 }}>
                          {student.enrolled_halaqat.map((h: any) => (
                            <StatusChip 
                              key={h.halaqa_id}
                              label={h.name} 
                              color="indigo"
                              showDot={false}
                              sx={{ 
                                height: 22,
                                fontSize: "0.65rem",
                                borderRadius: "6px",
                              }} 
                            />
                          ))}
                        </Stack>
                      ) : (
                        <StatusChip 
                          label="غير ملتحق" 
                          color="stone"
                          variant="outlined"
                          showDot={false}
                          sx={{ 
                            height: 22,
                            fontSize: "0.65rem",
                            borderStyle: "dashed",
                            bgcolor: "transparent"
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <AgeDisplay birthDate={student.birth_date} variant="body2" />
                    </TableCell>
                    <TableCell>
                      <StatusChip 
                        label={
                          student.status === StudentStatus.ACTIVE ? "نشط" : 
                          student.status === StudentStatus.INACTIVE ? "غير نشط" : 
                          "موقوف"
                        } 
                        color={
                          student.status === StudentStatus.ACTIVE ? "emerald" : 
                          student.status === StudentStatus.INACTIVE ? "stone" : 
                          "amber"
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        {!isTeacher && (
                          <>
                            <Tooltip title="تعديل">
                              <IconButton 
                                size="small" 
                                onClick={() => handleEditClick(student.student_id)}
                                sx={{ bgcolor: "sky.50", color: "sky.700", borderRadius: "8px", "&:hover": { bgcolor: "sky.100" } }}
                              >
                                <Edit sx={{ fontSize: "1rem" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton 
                                size="small" 
                                onClick={async () => {
                                  const fullData = await fetchStudentDetails(student.student_id);
                                  setDeleteTarget(fullData as FullStudentData);
                                }}
                                sx={{ bgcolor: "rose.50", color: "rose.700", borderRadius: "8px", "&:hover": { bgcolor: "rose.100" } }}
                              >
                                <DeleteOutline sx={{ fontSize: "1.1rem" }} />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip title="الملف الشخصي">
                          <IconButton 
                            size="small" 
                            onClick={() => openProfile(student as any)}
                            sx={{ bgcolor: "stone.50", color: "stone.600", borderRadius: "8px", "&:hover": { bgcolor: "stone.100" } }}
                          >
                            <Person sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                renderEmptyState()
              )}
            </TableBody>

          </Table>
        </TableContainer>
      </Card>

      {deleteTarget && (
        <DeleteConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          student={deleteTarget}
        />
      )}
    </>
  );
};

export default StudentsList;
