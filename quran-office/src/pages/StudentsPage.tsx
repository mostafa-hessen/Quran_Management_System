import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import StudentsList from "../features/students/components/StudentsList";
import AddStudentModal from "../features/students/components/AddStudentModal";
import EditStudentModal from "../features/students/components/EditStudentModal";
import StudentProfileModal from "../features/students/components/StudentProfileModal";
import { useStudentUIStore } from "../features/students/store/useStudentUIStore";
import StudentFiltersComponent from "../features/students/components/StudentFilters";
import { useStudentFilters } from "../features/students/hooks/useStudentFilters";
import { useHalaqat } from "../features/halaqat/hooks/useHalaqat";
import { useAuthStore } from "../features/auth/store";

const StudentsPage: React.FC = () => {
  const profile = useAuthStore(state => state.profile);
  const isTeacher = profile?.role === 'teacher';
  
  const openAdd = useStudentUIStore(state => state.openAdd);
  const { filters, updateFilter, resetFilters } = useStudentFilters();
  const { data: allHalaqat } = useHalaqat();

  // If teacher, force teacherId filter and restrict halaqat list
  React.useEffect(() => {
    if (isTeacher && profile?.teacher_id) {
      updateFilter('teacherId', profile.teacher_id);
    }
  }, [isTeacher, profile?.teacher_id]);

  const displayedHalaqat = isTeacher 
    ? allHalaqat?.filter(h => h.teacher_id === profile?.teacher_id)
    : allHalaqat;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "1600px", mx: "auto" }}>
      {/* Page Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight="bold" color="#1c1917">
          سجل الطلاب
        </Typography>
        {!isTeacher && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openAdd}
            sx={{
              bgcolor: "#059669",
              borderRadius: "12px",
              px: 3,
              py: 1,
              fontWeight: "bold",
              fontSize: "0.9rem",
              boxShadow: "none",
              "&:hover": { 
                bgcolor: "#047857",
                boxShadow: "none",
              },
              textTransform: "none"
            }}
          >
            إضافة طالب جديد
          </Button>
        )}
      </Stack>

      <StudentFiltersComponent 
        filters={filters}
        onFilterChange={updateFilter}
        onReset={() => {
          resetFilters();
          if (isTeacher && profile?.teacher_id) {
            updateFilter('teacherId', profile.teacher_id);
          }
        }}
        halaqat={displayedHalaqat?.map(h => ({ id: h.halaqa_id, name: h.name }))}
      />

      <Box>
        <StudentsList filters={filters} />
      </Box>

      <AddStudentModal />
      <EditStudentModal />
      <StudentProfileModal />
    </Box>
  );
};

export default StudentsPage;
