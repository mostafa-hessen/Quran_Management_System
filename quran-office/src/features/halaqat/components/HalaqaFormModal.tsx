import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Grid,
  MenuItem,
  Stack,
  IconButton as MuiIconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { halaqaSchema, type HalaqaFormData } from "../schemas/halaqaSchema";
import { useHalaqatStore } from "../store";
import { useCreateHalaqa, useUpdateHalaqa } from "../hooks/useHalaqat";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import { useQuery } from "@tanstack/react-query";
import { getTeachers } from "../../teachers/api/teachersApi";

const DAYS = [
  { value: "الأحد", label: "الأحد" },
  { value: "الاثنين", label: "الاثنين" },
  { value: "الثلاثاء", label: "الثلاثاء" },
  { value: "الأربعاء", label: "الأربعاء" },
  { value: "الخميس", label: "الخميس" },
  { value: "الجمعة", label: "الجمعة" },
  { value: "السبت", label: "السبت" },
];

export const HalaqaFormModal: React.FC = () => {
  const { isFormModalOpen, closeFormModal, selectedHalaqa } = useHalaqatStore();
  const [activeTab, setActiveTab] = useState(0);

  const createHalaqaMutation = useCreateHalaqa();
  const updateHalaqaMutation = useUpdateHalaqa();

  const { data: teachers = [], isLoading: isLoadingTeachers } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HalaqaFormData>({
    resolver: zodResolver(halaqaSchema),
    defaultValues: {
      name: "",
      teacher_id: null,
      location: "",
      level: "",
      capacity: 20,
      description: "",
      status: "active",
      schedules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  useEffect(() => {
    if (selectedHalaqa) {
      reset({
        ...selectedHalaqa,
        schedules: selectedHalaqa.schedules || [],
      });
    } else {
      reset({
        name: "",
        teacher_id: null,
        location: "",
        level: "",
        capacity: 20,
        description: "",
        status: "active",
        schedules: [],
      });
    }
    setActiveTab(0);
  }, [selectedHalaqa, reset, isFormModalOpen]);

  const onSubmit = async (data: HalaqaFormData) => {
    try {
      if (selectedHalaqa) {
        await updateHalaqaMutation.mutateAsync({
          halaqaId: selectedHalaqa.halaqa_id,
          updates: data,
        });
        toast.success("تم تحديث الحلقة بنجاح");
      } else {
        await createHalaqaMutation.mutateAsync(data);
        toast.success("تم إنشاء الحلقة بنجاح");
      }
      closeFormModal();
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog
      open={isFormModalOpen}
      onClose={closeFormModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "24px", p: 1 },
      }}
    >
      <form id="halaqa-form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {selectedHalaqa ? "تعديل حلقة" : "إنشاء حلقة جديدة"}
          </Typography>
          <IconButton onClick={closeFormModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            aria-label="form tabs"
          >
            <Tab label="المعلومات الأساسية" sx={{ fontWeight: 700 }} />
            <Tab
              label="المواعيد"
              sx={{ fontWeight: 700 }}
              error={!!errors.schedules}
            />
          </Tabs>
        </Box>

        <DialogContent sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="اسم الحلقة"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      placeholder="مثال: حلقة الإمام الشافعي"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="teacher_id"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      select
                      label="المعلم"
                      fullWidth
                      error={!!errors.teacher_id}
                      helperText={errors.teacher_id?.message}
                      disabled={isLoadingTeachers}
                    >
                      <MenuItem value="">
                        <em>بدون معلم</em>
                      </MenuItem>
                      {teachers.map((teacher) => (
                        <MenuItem key={teacher.teacher_id} value={teacher.teacher_id}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', py: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'stone.700' }}>
                                {teacher.full_name}
                              </Typography>
                              {!teacher.halaqat || teacher.halaqat.length === 0 ? (
                                <Chip 
                                  label="متاح" 
                                  size="small" 
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.6rem', 
                                    bgcolor: 'emerald.50', 
                                    color: 'emerald.700',
                                    border: '1px solid',
                                    borderColor: 'emerald.100',
                                    fontWeight: 700
                                  }} 
                                />
                              ) : (
                                <Chip 
                                  label={`${teacher.halaqat.length} حلقة`} 
                                  size="small" 
                                  sx={{ 
                                    height: 20, 
                                    fontSize: '0.6rem', 
                                    bgcolor: 'sky.50', 
                                    color: 'sky.700',
                                    border: '1px solid',
                                    borderColor: 'sky.100',
                                    fontWeight: 700
                                  }} 
                                />
                              )}
                            </Box>
                            {teacher.halaqat && teacher.halaqat.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 0.5, maxWidth: '200px', overflow: 'hidden' }}>
                                {teacher.halaqat.map(h => (
                                  <Chip 
                                    key={h.halaqa_id} 
                                    label={h.name} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ 
                                      height: 18, 
                                      fontSize: '0.6rem',
                                      borderColor: 'stone.200',
                                      color: 'stone.500',
                                      bgcolor: 'stone.50'
                                    }} 
                                  />
                                ))}
                              </Box>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="level"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      select
                      label="المستوى"
                      fullWidth
                    >
                      <MenuItem value="مبتدئ">مبتدئ</MenuItem>
                      <MenuItem value="متوسط">متوسط</MenuItem>
                      <MenuItem value="متقدم">متقدم</MenuItem>
                    </TextField>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="capacity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="السعة الاستيعابية"
                      fullWidth
                      error={!!errors.capacity}
                      helperText={errors.capacity?.message}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      label="الموقع"
                      fullWidth
                      placeholder="مثال: الطابق الثاني - الغرفة 4"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value || ""}
                      label="وصف الحلقة"
                      multiline
                      rows={3}
                      fullWidth
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, color: "stone.600" }}
                >
                  جدول المواعيد الإسبوعي
                </Typography>
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    append({
                      day_of_week: "الأحد",
                      start_time: "16:00",
                      end_time: "18:00",
                    })
                  }
                  sx={{ borderRadius: "8px" }}
                >
                  إضافة موعد
                </Button>
              </Box>

              {errors.schedules && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mb: 2, display: "block" }}
                >
                  {errors.schedules.message}
                </Typography>
              )}

              <Stack spacing={2}>
                {fields.length === 0 && (
                  <Box
                    sx={{
                      py: 4,
                      textAlign: "center",
                      bgcolor: "stone.50",
                      borderRadius: "12px",
                      border: "1px dashed",
                      borderColor: "stone.200",
                    }}
                  >
                    <Typography color="stone.500" variant="body2">
                      لا توجد مواعيد مضافة لهذه الحلقة
                    </Typography>
                  </Box>
                )}

                {fields.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      bgcolor: "stone.50",
                      border: "1px solid",
                      borderColor: "stone.100",
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <Controller
                          name={`schedules.${index}.day_of_week`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              select
                              label="اليوم"
                              fullWidth
                              size="small"
                              {...field}
                            >
                              {DAYS.map((d) => (
                                <MenuItem key={d.value} value={d.value}>
                                  {d.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`schedules.${index}.start_time`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              type="time"
                              label="من"
                              fullWidth
                              size="small"
                              {...field}
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <Controller
                          name={`schedules.${index}.end_time`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              type="time"
                              label="إلى"
                              fullWidth
                              size="small"
                              {...field}
                              InputLabelProps={{ shrink: true }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 2 }}
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => remove(index)}
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={closeFormModal}
            variant="outlined"
            sx={{ borderRadius: "10px", px: 4 }}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={
              createHalaqaMutation.isPending || updateHalaqaMutation.isPending
            }
            sx={{ borderRadius: "10px", px: 4 }}
          >
            {createHalaqaMutation.isPending || updateHalaqaMutation.isPending
              ? "جاري الحفظ..."
              : "حفظ البيانات"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
