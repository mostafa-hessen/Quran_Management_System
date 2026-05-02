import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Avatar,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import {
  SwapHoriz,
  Block,
  Close,
  PlayArrow,
  Search as SearchIcon,
} from "@mui/icons-material";
import { 
  TextField, 
  InputAdornment,
} from "@mui/material";
import { useHalaqaEnrollments, useUnenrollStudent, useUpdateEnrollment } from "@/features/enrollments/hooks/useEnrollment";
import { useNotification } from "@/shared/hooks/useNotification";
import TransferStudentModal from "./TransferStudentModal";

interface HalaqaEnrollmentsTableProps {
  halaqaId: string;
}

const HalaqaEnrollmentsTable: React.FC<HalaqaEnrollmentsTableProps> = ({ halaqaId }) => {
  const { data: enrollments, isLoading } = useHalaqaEnrollments(halaqaId);
  const unenrollMutation = useUnenrollStudent();
  const updateMutation = useUpdateEnrollment();
  const { notify } = useNotification();

  const [transferEnrollmentId, setTransferEnrollmentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEnrollments = enrollments?.filter((enrollment: any) => {
    const fullName = `${enrollment.student?.first_name} ${enrollment.student?.family_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center">
                جاري التحميل...
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (enrollments?.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography sx={{ color: "stone.400" }}>لا يوجد طلاب مسجلين حالياً</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="بحث عن طالب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "stone.400", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "stone.50" }}>
              <TableCell sx={{ fontWeight: 700, color: "stone.500" }}>الطالب</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "stone.500" }}>الحالة المالية</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "stone.500" }}>الحالة</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "stone.500" }}>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEnrollments?.map((enrollment: any) => {
              const isActive = enrollment.status !== 'inactive';
              return (
                <TableRow key={enrollment.enrollment_id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "emerald.100", color: "emerald.700", fontWeight: 700, fontSize: 14 }}>
                        {enrollment.student?.first_name?.[0]}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, color: "stone.700" }}>
                        {enrollment.student?.first_name} {enrollment.student?.family_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box 
                        sx={{ 
                          width: 8, height: 8, borderRadius: "50%", 
                          bgcolor: enrollment.subscription_status === 'active' ? 'emerald.500' : 'stone.300' 
                        }} 
                      />
                      <Typography variant="body2" sx={{ color: "stone.600", fontWeight: 500 }}>
                        {enrollment.subscription_status === 'active' ? "منتظم" : "متوقف"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={isActive ? "نشط" : "موقوف"} 
                      size="small" 
                      sx={{ 
                        bgcolor: isActive ? 'emerald.50' : 'stone.100',
                        color: isActive ? 'emerald.700' : 'stone.500',
                        fontWeight: 600
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <Tooltip title="نقل لحلقة أخرى">
                        <IconButton size="small" sx={{ color: "stone.400" }} onClick={() => setTransferEnrollmentId(enrollment.enrollment_id)}>
                          <SwapHoriz fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isActive ? "إيقاف مؤقت" : "تنشيط الطالب"}>
                        <IconButton 
                          size="small" 
                          sx={{ color: isActive ? "stone.400" : "success.main" }}
                          onClick={() => {
                            updateMutation.mutate({
                              enrollmentId: enrollment.enrollment_id,
                              updates: { status: isActive ? 'inactive' : 'active' }
                            }, {
                              onSuccess: () => notify(isActive ? "تم إيقاف الطالب مؤقتاً" : "تم تنشيط الطالب", "success")
                            });
                          }}
                        >
                          {isActive ? <Block fontSize="small" /> : <PlayArrow fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="حذف من الحلقة">
                        <IconButton 
                          size="small" 
                          sx={{ color: "error.main" }}
                          onClick={() => {
                            if (window.confirm("هل أنت متأكد من حذف الطالب من هذه الحلقة؟")) {
                              unenrollMutation.mutate(enrollment.enrollment_id, {
                                onSuccess: () => {
                                  notify("تم حذف الطالب من الحلقة", "info");
                                }
                              });
                            }
                          }}
                        >
                          <Close fontSize="small" />
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

      {transferEnrollmentId && (
        <TransferStudentModal
          open={!!transferEnrollmentId}
          onClose={() => setTransferEnrollmentId(null)}
          enrollmentId={transferEnrollmentId}
          currentHalaqaId={halaqaId}
        />
      )}
    </>
  );
};

export default HalaqaEnrollmentsTable;
