import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Divider,
  useTheme,
  alpha,
  CircularProgress,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  PersonAdd as AddIcon,
} from "@mui/icons-material";
import { useHalaqatStore } from "../store";
import { useStudents } from "../../students/hooks/useStudents";
import { 
  useEnrollMultipleStudents, 
  useHalaqaEnrollments 
} from "@/features/enrollments/hooks/useEnrollment";
import { toast } from "react-hot-toast";

export const HalaqaDrawerStudents: React.FC = () => {
  const theme = useTheme();
  const { isStudentsDrawerOpen, closeStudentsDrawer, selectedHalaqa } =
    useHalaqatStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch real students
  const { data: students = [], isLoading: isLoadingStudents } = useStudents();
  const { data: currentEnrollments = [], isLoading: isLoadingEnrollments } = 
    useHalaqaEnrollments(selectedHalaqa?.halaqa_id || "");
    
  const enrollMultipleMutation = useEnrollMultipleStudents();

  const isLoading = isLoadingStudents || isLoadingEnrollments;

  // Get IDs of students already in this halaqa
  const enrolledStudentIds = new Set(currentEnrollments.map((e: any) => e.student_id));

  // Filter students based on search, level, and enrollment status
  const filteredStudents = students.filter((s: any) => {
    // Skip if already enrolled
    if (enrolledStudentIds.has(s.student_id)) return false;

    const fullName = `${s.first_name} ${s.family_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || s.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s: any) => s.student_id));
    }
  };

  const handleAddStudents = async () => {
    if (!selectedHalaqa || selectedIds.length === 0) return;

    try {
      await enrollMultipleMutation.mutateAsync({
        studentIds: selectedIds,
        halaqaId: selectedHalaqa.halaqa_id
      });
      setSelectedIds([]);
      closeStudentsDrawer();
    } catch (error) {
      // Error handled by mutation toast
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isStudentsDrawerOpen}
      onClose={closeStudentsDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 450 },
          borderRadius: "24px 0 0 24px",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              إدارة الطلاب
            </Typography>
            <IconButton onClick={closeStudentsDrawer} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="text.secondary">
            إضافة طلاب إلى حلقة:{" "}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {selectedHalaqa?.name}
            </Box>
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ p: 3, bgcolor: theme.palette.stone[50] }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              placeholder="ابحث عن طالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "stone.400" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "12px", bgcolor: "white" },
              }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl size="small" fullWidth>
                <Select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  sx={{ borderRadius: "12px", bgcolor: "white" }}
                  startAdornment={
                    <FilterIcon
                      sx={{ fontSize: 18, mr: 1, color: "stone.500" }}
                    />
                  }
                >
                  <MenuItem value="all">كل المستويات</MenuItem>
                  <MenuItem value="مبتدئ">مبتدئ</MenuItem>
                  <MenuItem value="متوسط">متوسط</MenuItem>
                  <MenuItem value="متقدم">متقدم</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                onClick={handleSelectAll}
                sx={{ borderRadius: "12px", whiteSpace: "nowrap", px: 2 }}
              >
                {selectedIds.length === filteredStudents.length
                  ? "إلغاء الكل"
                  : "تحديد الكل"}
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* List */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={32} thickness={5} />
            </Box>
          ) : filteredStudents.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center" }}>
              <Typography color="stone.400">لا يوجد طلاب يطابقون البحث</Typography>
            </Box>
          ) : (
            <List>
              {filteredStudents.map((student: any) => (
                <ListItem
                  key={student.student_id}
                  sx={{
                    borderRadius: "12px",
                    mb: 1,
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={selectedIds.includes(student.student_id)}
                      onChange={() => toggleSelect(student.student_id)}
                    />
                  }
                >
                  <ListItemText
                    primary={`${student.first_name} ${student.family_name}`}
                    secondary={
                      <Stack spacing={1} sx={{ mt: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={student.gender === 'male' || student.gender === 'ذكر' ? 'ذكر' : 'أنثى'}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              height: 20, 
                              fontSize: "10px", 
                              fontWeight: 700,
                              color: student.gender === 'male' || student.gender === 'ذكر' ? 'sky.700' : 'rose.700',
                              borderColor: student.gender === 'male' || student.gender === 'ذكر' ? 'sky.200' : 'rose.200',
                              bgcolor: student.gender === 'male' || student.gender === 'ذكر' ? 'sky.50' : 'rose.50',
                            }}
                          />
                          {student.level && (
                            <Chip
                              label={student.level}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "10px",
                                fontWeight: 700,
                              }}
                            />
                          )}
                        </Stack>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'stone.500', display: 'block', mb: 0.5 }}>
                            الحلقات الحالية:
                          </Typography>
                          {student.enrolled_halaqat && student.enrolled_halaqat.length > 0 ? (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {student.enrolled_halaqat.map((h: any) => (
                                <Chip 
                                  key={h.halaqa_id} 
                                  label={h.name} 
                                  size="small" 
                                  variant="filled"
                                  sx={{ 
                                    height: 18, 
                                    fontSize: '9px', 
                                    bgcolor: 'stone.100',
                                    color: 'stone.600'
                                  }} 
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="caption" sx={{ color: 'error.400', fontStyle: 'italic' }}>
                              غير منضم لحلقات
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    }
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '1rem' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: "white",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={selectedIds.length === 0 || enrollMultipleMutation.isPending}
            startIcon={enrollMultipleMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
            onClick={handleAddStudents}
            sx={{ borderRadius: "12px", py: 1.5 }}
          >
            {enrollMultipleMutation.isPending ? "جاري الإضافة..." : `إضافة ${selectedIds.length} طلاب للمجموعة`}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
