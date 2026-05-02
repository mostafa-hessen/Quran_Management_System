import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Card,
  TextField,
  MenuItem,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import StudentsList from "@/features/students/components/StudentsList";
import AddStudentModal from "@/features/students/components/AddStudentModal";
import EditStudentModal from "@/features/students/components/EditStudentModal";
import StudentProfileModal from "@/features/students/components/StudentProfileModal";
import { useStudentUIStore } from "@/features/students/store/useStudentUIStore";

const StudentsPage: React.FC = () => {
  const openAdd = useStudentUIStore(state => state.openAdd);
  const [filters, setFilters] = React.useState({
    search: "",
    circle: "",
    status: "",
  });

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
      </Stack>

      {/* Filters Card */}
      <Card 
        sx={{ 
          p: 2.5, 
          mb: 3, 
          borderRadius: "16px", 
          border: "1px solid #f5f5f4", 
          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "flex-end"
        }}
      >
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="caption" sx={{ color: "#78716c", fontWeight: "bold", mb: 0.5, display: "block" }}>
            بحث بالاسم
          </Typography>
          <TextField
            fullWidth
            placeholder="ابحث..."
            size="small"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#fafafa", 
                borderRadius: "10px",
                "& fieldset": { borderColor: "#e7e5e4" }
              }
            }}
          />
        </Box>

        <Box sx={{ minWidth: 150 }}>
          <Typography variant="caption" sx={{ color: "#78716c", fontWeight: "bold", mb: 0.5, display: "block" }}>
            الحلقة
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.circle}
            onChange={(e) => setFilters({ ...filters, circle: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#fafafa", 
                borderRadius: "10px",
                "& fieldset": { borderColor: "#e7e5e4" }
              }
            }}
          >
            <MenuItem value="">كل الحلقات</MenuItem>
            <MenuItem value="h1">حلقة الفجر</MenuItem>
            <MenuItem value="h2">حلقة النور</MenuItem>
          </TextField>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <Typography variant="caption" sx={{ color: "#78716c", fontWeight: "bold", mb: 0.5, display: "block" }}>
            الحالة
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": { 
                bgcolor: "#fafafa", 
                borderRadius: "10px",
                "& fieldset": { borderColor: "#e7e5e4" }
              }
            }}
          >
            <MenuItem value="">الكل</MenuItem>
            <MenuItem value="active">نشط</MenuItem>
            <MenuItem value="inactive">غير نشط</MenuItem>
          </TextField>
        </Box>
      </Card>

      <Box>
        <StudentsList searchTerm={filters.search} />
      </Box>

      <AddStudentModal />
      <EditStudentModal />
      <StudentProfileModal />
    </Box>
  );
};



export default StudentsPage;
