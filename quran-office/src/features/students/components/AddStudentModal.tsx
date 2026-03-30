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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Close, PersonAdd, Add, Delete } from "@mui/icons-material";
import { useAddStudent } from "../hooks/useStudents";
import { Gender, StudentStatus } from "../types";
import { useStudentUIStore } from "../store/useStudendUiStore";

const AddStudentModal: React.FC = () => {
  const isOpen = useStudentUIStore((state) => state.isAddOpen);
  const close = useStudentUIStore((state) => state.closeAdd);
  const addStudentMutation = useAddStudent();

  const [formData, setFormData] = React.useState({
    first_name: "",
    father_name: "",
    grandfather_name: "",
    family_name: "",
    gender: "ذكر",
    birth_date: "",
    address: "",
    circle_id: "",
    status: StudentStatus.ACTIVE,
  });

  const [phones, setPhones] = React.useState<any[]>([
    { phone: "", guardian_relation: "أب", label: "أساسي" },
  ]);

  const addPhone = () => {
    setPhones([
      ...phones,
      { phone: "", guardian_relation: "أب", label: "أساسي" },
    ]);
  };

  const removePhone = (index: number) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handlePhoneChange = (index: number, field: string, value: string) => {
    const newPhones = [...phones];
    newPhones[index][field] = value;
    setPhones(newPhones);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudentMutation.mutate(
      { student: formData, phones },
      {
        onSuccess: () => {
          close();
          setFormData({
            first_name: "",
            father_name: "",
            grandfather_name: "",
            family_name: "",
            gender: "ذكر",
            birth_date: "",
            address: "",
            circle_id: "",
            status: StudentStatus.ACTIVE,
          });
          setPhones([{ phone: "", guardian_relation: "أب", label: "أساسي" }]);
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      maxWidth="sm"
      fullWidth
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
              <Typography variant="caption" color="stone.500">
                أدخل بيانات الطالب لبدء التسجيل
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={close}
            size="small"
            sx={{
              color: "stone.400",
              "&:hover": { color: "stone.600", bgcolor: "stone.100" },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={3}>
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
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="اسم الأب"
                  value={formData.father_name}
                  onChange={(e) =>
                    setFormData({ ...formData, father_name: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="اسم الجد"
                  value={formData.grandfather_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grandfather_name: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="اسم العائلة *"
                  value={formData.family_name}
                  onChange={(e) =>
                    setFormData({ ...formData, family_name: e.target.value })
                  }
                  required
                />
              </Grid>
            </Grid>

            {/* Birth and Gender */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="تاريخ الميلاد"
                  InputLabelProps={{ shrink: true }}
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="الجنس"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <MenuItem value="ذكر">ذكر</MenuItem>
                  <MenuItem value="أنثى">أنثى</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {/* Circle & Address */}
            <Stack spacing={2.5}>
        

              <TextField
                fullWidth
                multiline
                rows={2}
                label="العنوان"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            {/* Phones Section */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="700"
                    color="stone.700"
                  >
                    بيانات الاتصال
                  </Typography>
                  <Typography variant="caption" color="stone.500">
                    أضف أرقام هواتف أولياء الأمور
                  </Typography>
                </Box>
                <Button
                  startIcon={<Add />}
                  size="small"
                  onClick={addPhone}
                  variant="outlined"
                  sx={{
                    borderRadius: "8px",
                    color: "emerald.700",
                    borderColor: "emerald.200",
                    bgcolor: "emerald.50",
                    px: 1.5,
                    "&:hover": {
                      borderColor: "emerald.400",
                      bgcolor: "emerald.100",
                    },
                  }}
                >
                  إضافة هاتف
                </Button>
              </Stack>

              <Stack spacing={2}>
                {phones.map((phone, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <TextField
                      placeholder="05XXXXXXXX"
                      sx={{ flex: 1 }}
                      value={phone.phone}
                      onChange={(e) =>
                        handlePhoneChange(index, "phone", e.target.value)
                      }
                      slotProps={{ htmlInput: { dir: "ltr" } }}
                    />
                    <TextField
                      select
                      sx={{ width: 110 }}
                      value={phone.guardian_relation}
                      onChange={(e) =>
                        handlePhoneChange(
                          index,
                          "guardian_relation",
                          e.target.value,
                        )
                      }
                    >
                      <MenuItem value="أب">أب</MenuItem>
                      <MenuItem value="أم">أم</MenuItem>
                      <MenuItem value="جد">جد</MenuItem>
                      <MenuItem value="جدة">جدة</MenuItem>
                      <MenuItem value="ولي أمر">ولي أمر</MenuItem>
                      <MenuItem value="آخر">آخر</MenuItem>
                    </TextField>
                    <TextField
                      select
                      sx={{ width: 110 }}
                      value={phone.label}
                      onChange={(e) =>
                        handlePhoneChange(index, "label", e.target.value)
                      }
                    >
                      <MenuItem value="أساسي">أساسي</MenuItem>
                      <MenuItem value="واتساب">واتساب</MenuItem>
                      <MenuItem value="منزل">منزل</MenuItem>
                      <MenuItem value="أخرى">أخرى</MenuItem>
                    </TextField>
                    <IconButton
                      onClick={() => removePhone(index)}
                      disabled={phones.length === 1}
                      sx={{
                        color: "red.500",
                        border: "1px solid",
                        borderColor: "red.100",
                        borderRadius: "8px",
                        "&:hover": { bgcolor: "red.50" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                ))}
              </Stack>
            </Box>
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
            onClick={close}
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
            disabled={addStudentMutation.isPending}
            sx={{
              py: 1.2,
              borderRadius: "10px",
              bgcolor: "emerald.600",
              boxShadow: "0 4px 6px -1px rgb(16 185 129 / 0.2)",
              flex: 2,
              "&:hover": { bgcolor: "emerald.700" },
            }}
          >
            {addStudentMutation.isPending ? "جاري الحفظ..." : "حفظ الطالب"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddStudentModal;
