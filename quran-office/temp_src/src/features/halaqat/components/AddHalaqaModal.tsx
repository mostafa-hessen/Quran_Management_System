import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useCreateHalaqa } from "../hooks/useHalaqat";
import type { CreateHalaqaInput } from "../types";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface AddHalaqaModalProps {
  open: boolean;
  onClose: () => void;
}

const AddHalaqaModal: React.FC<AddHalaqaModalProps> = ({ open, onClose }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, handleSubmit, reset } = useForm<CreateHalaqaInput>({
    defaultValues: {
      name: "",
      level: "مبتدئ",
      capacity: 15,
      location: "",
      description: "",
      status: "active",
      teacher_id: null,
    },
  });

  const createHalaqaMutation = useCreateHalaqa();

  const onSubmit = async (data: CreateHalaqaInput) => {
    try {
      setErrorMessage(null);
      await createHalaqaMutation.mutateAsync(data);
      reset();
      onClose();
    } catch (err: any) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          p: 1,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid #f5f5f4",
        }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        pb: 1,
        fontFamily: "'Tajawal', sans-serif",
        fontWeight: 800,
        color: "stone.800"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "emerald.500" }} />
          إضافة حلقة جديدة
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "stone.400", "&:hover": { color: "stone.600", bgcolor: "stone.100" } }}>
          <Close sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pb: 3, pt: 2 }}>
          {errorMessage && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "error.light",
                bgcolor: "error.soft"
              }}
            >
              {errorMessage}
            </Alert>
          )}
          
          <Grid container spacing={2.5}>
            {/* Name Field */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ 
                  required: "اسم الحلقة مطلوب",
                  minLength: { value: 3, message: "يجب أن يكون الاسم 3 أحرف على الأقل" }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="اسم الحلقة"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    placeholder="مثال: حلقة الفجر"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "stone.50",
                        "&:hover": { bgcolor: "stone.100/50" },
                        "& fieldset": { borderColor: "stone.200" },
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Level Field */}
            <Grid item xs={12}>
              <Controller
                name="level"
                control={control}
                rules={{ required: "يرجى اختيار المستوى" }}
                render={({ field, fieldState }) => (
                  <TextField 
                    {...field} 
                    select 
                    label="المستوى" 
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "stone.50",
                        "& fieldset": { borderColor: "stone.200" },
                      }
                    }}
                  >
                    <MenuItem value="مبتدئ">مبتدئ</MenuItem>
                    <MenuItem value="متوسط">متوسط</MenuItem>
                    <MenuItem value="متقدم">متقدم</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            
            {/* Capacity Field */}
            <Grid item xs={12}>
              <Controller
                name="capacity"
                control={control}
                rules={{ 
                  required: "السعة مطلوبة", 
                  min: { value: 1, message: "يجب أن تكون السعة 1 على الأقل" },
                  max: { value: 100, message: "السعة القصوى هي 100" }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="السعة الاستيعابية"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "stone.50",
                        "& fieldset": { borderColor: "stone.200" },
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Location Field */}
            <Grid item xs={12}>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    label="الموقع" 
                    fullWidth 
                    placeholder="مثال: القاعة الكبرى"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "stone.50",
                        "& fieldset": { borderColor: "stone.200" },
                      }
                    }}
                  />
                )}
              />
            </Grid>
            
            {/* Status Field */}
            <Grid item xs={12}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    select 
                    label="الحالة" 
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "stone.50",
                        "& fieldset": { borderColor: "stone.200" },
                      }
                    }}
                  >
                    <MenuItem value="active">نشطة</MenuItem>
                    <MenuItem value="inactive">غير نشطة</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            
            {/* Description Field */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="وصف إضافي"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="تفاصيل إضافية عن الحلقة..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "stone.50",
                        "& fieldset": { borderColor: "stone.200" },
                      }
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={onClose} 
            sx={{ 
              color: "stone.500",
              fontWeight: 600,
              borderRadius: "12px",
              px: 3,
              "&:hover": { bgcolor: "stone.100", color: "stone.700" }
            }}
          >
            إلغاء
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            loading={createHalaqaMutation.isPending}
            sx={{
              bgcolor: "emerald.600",
              "&:hover": { bgcolor: "emerald.700" },
              borderRadius: "12px",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
              fontFamily: "'Tajawal', sans-serif",
            }}
          >
            إضافة الحلقة
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddHalaqaModal;
