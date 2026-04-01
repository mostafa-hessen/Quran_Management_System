import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  Stack,
  Chip,
  Grid,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Close,
  Person,
  Phone,
  Cake,
  Wc,
  LocationOn,
  CalendarMonth,
} from "@mui/icons-material";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { useStudentDetails } from "../hooks/useStudents";

/**
 * Modal component for viewing comprehensive student profile details.
 * Features: RTL-layout, guardian phones, and status.
 */
const StudentProfileModal: React.FC = () => {
  const { isProfileOpen, closeProfile, selectedStudent } = useStudentUIStore();
  const { data: details, isLoading } = useStudentDetails(selectedStudent?.student_id || null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#059669";
      case "inactive": return "#d97706";
      case "suspended": return "#dc2626";
      default: return "#78716c";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "نشط";
      case "inactive": return "غير نشط";
      case "suspended": return "موقوف";
      default: return status;
    }
  };

  return (
    <Dialog 
      open={isProfileOpen} 
      onClose={closeProfile} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { 
          borderRadius: "20px",
          overflow: "hidden"
        }
      }}
    >
      {/* Header with Title and Close Button */}
      <DialogTitle sx={{ 
        bgcolor: "#fafaf9", 
        borderBottom: "1px solid #f5f5f4",
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        py: 2
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Person sx={{ color: "#059669" }} />
          <Typography sx={{ fontWeight: "bold", color: "#1c1917" }}>
            ملف الطالب
          </Typography>
        </Stack>
        <IconButton onClick={closeProfile} size="small" sx={{ color: "#78716c" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={40} sx={{ color: "#059669" }} />
          </Box>
        ) : selectedStudent && (
          <Stack spacing={3}>
            {/* Status & Name Header */}
            <Box>
              <Chip 
                label={getStatusLabel(selectedStudent.status)} 
                size="small"
                sx={{ 
                  bgcolor: getStatusColor(selectedStudent.status), 
                  color: "white", 
                  fontWeight: "bold",
                  mb: 1
                }} 
              />
              <Typography variant="h5" fontWeight="bold" color="#1c1917">
                {`${selectedStudent.first_name} ${selectedStudent.father_name || ""} ${selectedStudent.grandfather_name || ""} ${selectedStudent.family_name}`}
              </Typography>
            </Box>

            <Divider />

            {/* Basic Info Grid */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Wc sx={{ color: "#a8a29e", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography variant="caption" color="#78716c" display="block">الجنس</Typography>
                    <Typography fontWeight="500">{selectedStudent.gender || "غير محدد"}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Cake sx={{ color: "#a8a29e", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography variant="caption" color="#78716c" display="block">تاريخ الميلاد</Typography>
                    <Typography fontWeight="500">
                      {selectedStudent.birth_date ? new Date(selectedStudent.birth_date).toLocaleDateString("ar-EG") : "غير مسجل"}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocationOn sx={{ color: "#a8a29e", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography variant="caption" color="#78716c" display="block">العنوان</Typography>
                    <Typography fontWeight="500">{selectedStudent.address || "لا يوجد عنوان مسجل"}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarMonth sx={{ color: "#a8a29e", fontSize: "1.2rem" }} />
                  <Box>
                    <Typography variant="caption" color="#78716c" display="block">تاريخ التسجيل</Typography>
                    <Typography fontWeight="500">
                      {new Date(selectedStudent.created_at).toLocaleDateString("ar-EG")}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>


            {/* Guardian Phones Section */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="#1c1917" gutterBottom sx={{ mt: 1 }}>
                بيانات التواصل (أولياء الأمور)
              </Typography>
              <Stack spacing={1.5}>
                {details?.student_guardian_phones && details.student_guardian_phones.length > 0 ? (
                  details.student_guardian_phones.map((phone: any) => (
                    <Paper 
                      key={phone.phone_id}
                      variant="outlined"
                      sx={{ 
                        p: 1.5, 
                        bgcolor: "#fafaf9", 
                        borderRadius: "12px",
                        border: "1px solid #e7e5e4"
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              borderRadius: "8px", 
                              bgcolor: "#0596691a", 
                              display: "flex", 
                              alignItems: "center", 
                              justifyContent: "center" 
                            }}
                          >
                            <Phone sx={{ fontSize: "1.1rem", color: "#059669" }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">{phone.phone}</Typography>
                            <Typography variant="caption" color="#78716c">
                              {phone.guardian_relation} • {phone.label}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))
                ) : (
                  <Typography variant="body2" color="#a8a29e" sx={{ fontStyle: "italic" }}>
                    لا توجد هواتف مسجلة لهواة الطالب
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentProfileModal;
