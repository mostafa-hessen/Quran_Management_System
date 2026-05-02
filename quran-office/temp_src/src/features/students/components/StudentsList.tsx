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
} from "@mui/material";
import {
  Edit,
  Person,
  DeleteOutline,
} from "@mui/icons-material";
import { useStudents } from "../hooks/useStudents";
import { type FullStudentData, StudentStatus } from "../types";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { fetchStudentDetails } from "../api/studentsApi";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface StudentsListProps {
  searchTerm: string;
}

const getStatusBadge = (status: StudentStatus) => {
  switch (status) {
    case StudentStatus.ACTIVE:
      return { bgcolor: "#f5f5f4", color: "#57534e", label: "نشط" };
    default:
      return { bgcolor: "#f5f5f4", color: "#57534e", label: "غير نشط" };
  }
};

const StudentsList: React.FC<StudentsListProps> = ({ searchTerm }) => {
  const { data: students, error } = useStudents();
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

  const filteredStudents = students?.filter((student) => {
    const fullName = `${student.first_name} ${student.family_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (error) return <Typography color="error">حدث خطأ أثناء تحميل البيانات</Typography>;

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
              {filteredStudents?.map((student, index) => {
                const badge = getStatusBadge(student.status);
                return (
                  <TableRow key={student.student_id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ color: "#78716c" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        onClick={() => openProfile(student as any)}
                        sx={{ 
                          color: "primary.light", 
                          fontWeight: "bold", 
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" }
                        }}
                      >
                        {student.first_name} {student.father_name} {student.family_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: "6px", 
                          bgcolor: "#dcfce7", 
                          color: "#166534", 
                          fontSize: "0.65rem", 
                          fontWeight: "800",
                          display: "inline-block"
                        }}
                      >
                        حلقة الفجر
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#57534e", fontSize: "0.85rem" }}>
                      {student.birth_date || "—"}
                    </TableCell>
                    <TableCell>
                      <Box 
                        sx={{ 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: "6px", 
                          bgcolor: badge.bgcolor, 
                          color: badge.color, 
                          fontSize: "0.75rem", 
                          fontWeight: "600",
                          display: "inline-block"
                        }}
                      >
                        {badge.label}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
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
                );
              })}
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
