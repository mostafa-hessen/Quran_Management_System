import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Container,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useHalaqat } from "@/features/halaqat/hooks/useHalaqat";
import { useTeachers } from "@/features/teachers/api/queries";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { HalaqaGrid } from "@/features/halaqat/components/HalaqaGrid";
import { HalaqaFormModal } from "@/features/halaqat/components/HalaqaFormModal";
import { HalaqaDeleteConfirmModal } from "@/features/halaqat/components/HalaqaDeleteConfirmModal";
import { HalaqaDrawerStudents } from "@/features/halaqat/components/HalaqaDrawerStudents";
import { useHalaqatStore } from "@/features/halaqat/store";
import { useAuthStore } from "@/features/auth/store";

const HalaqatPage: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");
  const { data: halaqat, isLoading } = useHalaqat();
  const { data: teachers } = useTeachers();
  const { openCreateForm } = useHalaqatStore();
  const profile = useAuthStore((state) => state.profile);
  const isTeacher = profile?.role === "teacher";

  // If teacher, force filter to their own ID
  React.useEffect(() => {
    if (isTeacher && profile?.teacher_id) {
      setSelectedTeacherId(profile.teacher_id);
    }
  }, [isTeacher, profile]);

  const filteredHalaqat = halaqat?.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.teacher?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeacher =
      selectedTeacherId === "all" || h.teacher_id === selectedTeacherId;

    // Strict teacher isolation: If teacher role, ONLY show their halaqat
    if (isTeacher) {
      return matchesSearch && h.teacher_id === profile?.teacher_id;
    }

    return matchesSearch && matchesTeacher;
  });

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box
          sx={{
            pt: 4,
            pb: 6,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  bgcolor: "primary.main",
                  color: "white",
                  display: "flex",
                }}
              >
                <DashboardIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: "stone.900" }}
              >
                الحلقات القرآنية
              </Typography>
            </Stack>
            <Typography
              variant="subtitle1"
              sx={{ color: "stone.500", maxWidth: 600 }}
            >
              نظام إدارة الحلقات الذكي - تابع مستويات الطلاب، المواعيد، والتقدم
              التعليمي في مكان واحد.
            </Typography>
          </Box>

          {!isTeacher && (
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={openCreateForm}
              sx={{
                borderRadius: "14px",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              إنشاء حلقة جديدة
            </Button>
          )}
        </Box>

        {/* Filters Bar */}
        <Box
          sx={{
            mb: 5,
            p: 2,
            borderRadius: "20px",
            bgcolor: "white",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 2,
          }}
        >
          <TextField
            placeholder="ابحث عن حلقة، موقع، أو معلم..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                bgcolor: "stone.50",
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "primary.light" },
                "&.Mui-focused fieldset": { borderColor: "primary.main" },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "stone.400" }} />
                </InputAdornment>
              ),
            }}
          />

          {!isTeacher && (
            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel id="teacher-filter-label">تصفية حسب المعلم</InputLabel>
              <Select
                labelId="teacher-filter-label"
                value={selectedTeacherId}
                label="تصفية حسب المعلم"
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                sx={{
                  borderRadius: "12px",
                  bgcolor: "stone.50",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.light",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                } as any}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "stone.400", fontSize: 20 }} />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">كل المعلمين</MenuItem>
                {teachers?.map((teacher) => (
                  <MenuItem key={teacher.teacher_id} value={teacher.teacher_id}>
                    {teacher.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Content Grid */}
        <HalaqaGrid halaqat={filteredHalaqat} isLoading={isLoading} />
      </Container>

      {/* Modals & Drawers */}
      <HalaqaFormModal />
      <HalaqaDeleteConfirmModal />
      <HalaqaDrawerStudents />
    </Box>
  );
};

export default HalaqatPage;
