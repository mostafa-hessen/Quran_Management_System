import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Stack,
  Typography,
  IconButton,
  Box,
  Divider,
  Alert,
} from "@mui/material";
import { Close, PersonAdd } from "@mui/icons-material";
import { useStudentUIStore } from "../store/useStudentUIStore";
import { GENDER_OPTIONS } from "../types";
import { useAddStudentForm } from "../hooks/useAddStudentForm";
import { useSubmitStudent } from "../hooks/useSubmitStudent";
import { PhoneFieldList } from "./PhoneFieldList";

const AddStudentModal: React.FC = () => {
  const isOpen = useStudentUIStore((state) => state.isAddOpen);
  // Separation of concerns: state vs mutation
  const { form, fields, append, remove } = useAddStudentForm();
  const { onSubmit, isPending, handleClose, error } = useSubmitStudent(form);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="add-student-title"
      aria-describedby="add-student-description"
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: "#fafaf9",
          backgroundImage: "none",
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      <DialogTitle
        id="add-student-title"
        sx={{ p: 3, borderBottom: "1px solid", borderColor: "stone.200" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "12px",
                bgcolor: "emerald.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "emerald.600",
                border: "1px solid",
                borderColor: "emerald.100",
              }}
            >
              <PersonAdd />
            </Box>
            <Box>
              <Typography
                variant="h6"
                fontWeight="800"
                color="stone.800"
                lineHeight={1.2}
              >
                إضافة طالب جديد
              </Typography>
              <Typography
                variant="caption"
                color="stone.500"
                id="add-student-description"
              >
                أدخل بيانات الطالب لبدء التسجيل
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "stone.400",
              "&:hover": { color: "stone.600", bgcolor: "stone.100" },
            }}
            aria-label="إغلاق"
          >
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: "10px" }}>
                {error}
              </Alert>
            )}

            <Typography
              variant="subtitle2"
              fontWeight="700"
              color="stone.700"
              sx={{ mb: -1.5 }}
            >
              المعلومات الأساسية
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="الاسم الأول *"
                  {...register("first_name")}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  dir="rtl"
                  label="اسم الأب"
                  {...register("father_name")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="اسم الجد"
                  {...register("grandfather_name")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="اسم العائلة *"
                  {...register("family_name")}
                  error={!!errors.family_name}
                  helperText={errors.family_name?.message}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="تاريخ الميلاد"
                  InputLabelProps={{ shrink: true }}
                  {...register("birth_date")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="الجنس"
                  defaultValue="ذكر"
                  {...register("gender")}
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="العنوان"
                {...register("address")}
              />
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            <PhoneFieldList
              fields={fields}
              register={register}
              errors={errors}
              onAdd={() =>
                append({ phone: "", guardian_relation: "أب", label: "أساسي" })
              }
              onRemove={remove}
            />
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            gap: 2,
            borderTop: "1px solid",
            borderColor: "stone.100",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              py: 1.2,
              borderRadius: "10px",
              color: "stone.500",
              flex: 1,
              "&:hover": { bgcolor: "stone.100" },
            }}
          >
            إلغاء
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={isPending}
            sx={{
              py: 1.2,
              borderRadius: "10px",
              bgcolor: "emerald.600",
              boxShadow: "0 4px 6px -1px rgb(16 185 129 / 0.2)",
              flex: 2,
              "&:hover": { bgcolor: "emerald.700" },
            }}
          >
            {isPending ? "جاري الحفظ..." : "حفظ الطالب"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddStudentModal;
