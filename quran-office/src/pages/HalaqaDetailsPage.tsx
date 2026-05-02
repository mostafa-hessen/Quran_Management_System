import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import {
  ArrowForward,
  Edit,
  PersonAdd,
  LocationOn,
  Assignment,
  Delete,
} from "@mui/icons-material";
import { useHalaqa } from "@/features/halaqat/hooks/useHalaqat";
import { Card, Button } from "@/shared/components/ui";
import { useHalaqaEnrollments } from "@/features/enrollments/hooks/useEnrollment";
import HalaqaEnrollmentsTable from "@/features/enrollments/components/HalaqaEnrollmentsTable";
import AddStudentToHalaqaDrawer from "@/features/enrollments/components/AddStudentToHalaqaDrawer";
import AddHomeworkDrawer from "@/features/homework/components/AddHomeworkDrawer";
import HalaqaDetailsSidebar from "@/features/halaqat/components/HalaqaDetailsSidebar";
import { HalaqaFormModal } from "@/features/halaqat/components/HalaqaFormModal";
import { HalaqaDeleteConfirmModal } from "@/features/halaqat/components/HalaqaDeleteConfirmModal";
import { useHalaqatStore } from "@/features/halaqat/store";

const HalaqaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddHomeworkOpen, setIsAddHomeworkOpen] = useState(false);
  const { openEditForm, openDeleteConfirm } = useHalaqatStore();

  const { data: halaqa, isLoading: isLoadingHalaqa } = useHalaqa(id!);
  const { data: enrollments } = useHalaqaEnrollments(id!);

  if (isLoadingHalaqa || !halaqa) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>جاري تحميل بيانات الحلقة...</Typography>
      </Box>
    );
  }

  const studentCount = enrollments?.length || 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <IconButton onClick={() => navigate("/halaqat")} sx={{ bgcolor: "white", boxShadow: 1 }}>
          <ArrowForward />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "stone.800", fontFamily: "Tajawal" }}>
            {halaqa.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Chip 
              label={halaqa.level} 
              size="small" 
              sx={{ 
                bgcolor: halaqa.level === 'متقدم' ? 'emerald.100' : halaqa.level === 'متوسط' ? 'sky.100' : 'amber.100',
                color: halaqa.level === 'متقدم' ? 'emerald.800' : halaqa.level === 'متوسط' ? 'sky.800' : 'amber.800',
                fontWeight: 700 
              }} 
            />
            <Typography variant="body2" sx={{ color: "stone.400", display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOn sx={{ fontSize: 16 }} /> {halaqa.location || "بدون موقع"}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mr: "auto", display: "flex", gap: 1 }}>
          <IconButton 
            color="error" 
            onClick={() => openDeleteConfirm(halaqa)}
            sx={{ bgcolor: "white", boxShadow: 1, "&:hover": { bgcolor: "error.50" } }}
          >
            <Delete />
          </IconButton>
          <Button colorType="primary" startIcon={<Edit />} onClick={() => openEditForm(halaqa)}>تعديل الحلقة</Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid  size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "stone.700" }}>الطلاب المسجلون</Typography>
              <Button 
                colorType="primary" 
                startIcon={<PersonAdd />} 
                onClick={() => setIsAddStudentOpen(true)}
              >
                إضافة طالب
              </Button>
            </Box>

            <HalaqaEnrollmentsTable halaqaId={id!} />
          </Card>
        </Grid>

        {/* Sidebar Info */}
        <Grid  size={{ xs: 12, md: 4 }}>
          <HalaqaDetailsSidebar halaqa={halaqa} studentCount={studentCount} />
        </Grid>
      </Grid>

      {/* Drawers */}
      <AddStudentToHalaqaDrawer 
        open={isAddStudentOpen} 
        onClose={() => setIsAddStudentOpen(false)} 
        halaqaId={id!} 
      />
      
      <AddHomeworkDrawer 
        open={isAddHomeworkOpen} 
        onClose={() => setIsAddHomeworkOpen(false)} 
        halaqaId={id!} 
      />
      
      <HalaqaFormModal />
      <HalaqaDeleteConfirmModal />
    </Box>
  );
};

export default HalaqaDetailsPage;
