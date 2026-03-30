import React from "react";
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
  Assignment,
} from "@mui/icons-material";
import { useStudents } from "../hooks/useStudents";
import { StudentStatus } from "../types";

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
  const { data: students, isLoading, error } = useStudents();

  const filteredStudents = students?.filter((student) => {
    const fullName = `${student.first_name} ${student.family_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (error) return <Typography color="error">حدث خطأ أثناء تحميل البيانات</Typography>;

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #f5f5f4", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", overflow: "hidden" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#fafaf9" }}>
            <TableRow>
              <TableCell sx={{ color: "#78716c", fontWeight: "bold", py: 2 }}>#</TableCell>
              <TableCell sx={{ color: "#78716c", fontWeight: "bold", py: 2 }}>الاسم الكامل</TableCell>
              <TableCell sx={{ color: "#78716c", fontWeight: "bold", py: 2 }}>الحلقة</TableCell>
              <TableCell sx={{ color: "#78716c", fontWeight: "bold", py: 2 }}>تاريخ الميلاد</TableCell>
              <TableCell sx={{ color: "#78716c", fontWeight: "bold", py: 2 }}>الحالة</TableCell>
              <TableCell align="center" sx={{ color: "#78716c", fontWeight: "bold", py: 2 }}>إجراءات</TableCell>
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
                      sx={{ 
                        color: "#047857", 
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
                      <Tooltip title="إسناد واجب">
                        <IconButton size="small" sx={{ bgcolor: "#059669", color: "white", "&:hover": { bgcolor: "#047857" }, borderRadius: "8px" }}>
                          <Assignment sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="الملف الشخصي">
                        <IconButton size="small" sx={{ bgcolor: "#f5f5f4", color: "#57534e", borderRadius: "8px" }}>
                          <Person sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="تعديل">
                        <IconButton size="small" sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", borderRadius: "8px" }}>
                          <Edit sx={{ fontSize: "1rem" }} />
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
  );
};

export default StudentsList;
