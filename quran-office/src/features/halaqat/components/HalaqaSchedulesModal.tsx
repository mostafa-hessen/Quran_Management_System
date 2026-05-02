import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  MenuItem,
  Stack,
  Divider,
  Alert,
  Paper,
} from "@mui/material";
import {
  Delete,
  Add,
  Schedule as ScheduleIcon,
  Close,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as schedulesApi from "../api/schedulesApi";
import type { Halaqa } from "../types";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface HalaqaSchedulesModalProps {
  open: boolean;
  onClose: () => void;
  halaqa: Halaqa;
}

const DAYS = [
  { value: "Sunday", label: "الأحد" },
  { value: "Monday", label: "الاثنين" },
  { value: "Tuesday", label: "الثلاثاء" },
  { value: "Wednesday", label: "الأربعاء" },
  { value: "Thursday", label: "الخميس" },
  { value: "Friday", label: "الجمعة" },
  { value: "Saturday", label: "السبت" },
];

const HalaqaSchedulesModal: React.FC<HalaqaSchedulesModalProps> = ({
  open,
  onClose,
  halaqa,
}) => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ["schedules", halaqa.halaqa_id],
    queryFn: () => schedulesApi.fetchHalaqaSchedules(halaqa.halaqa_id),
    enabled: open,
  });

  const [newSchedule, setNewSchedule] = useState({
    day_of_week: "Sunday",
    start_time: "16:00",
    end_time: "18:00",
  });

  const createMutation = useMutation({
    mutationFn: schedulesApi.createSchedule,
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({
        queryKey: ["schedules", halaqa.halaqa_id],
      });
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: schedulesApi.deleteSchedule,
    onSuccess: () => {
      setErrorMessage(null);
      queryClient.invalidateQueries({
        queryKey: ["schedules", halaqa.halaqa_id],
      });
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const handleAdd = async () => {
    try {
      await createMutation.mutateAsync({
        halaqa_id: halaqa.halaqa_id,
        ...newSchedule,
      });
    } catch (e) {
      // Handled by onError
    }
  };

  const handleDelete = async (scheduleId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الموعد؟")) {
      try {
        await deleteMutation.mutateAsync(scheduleId);
      } catch (e) {
        // Handled by onError
      }
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
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "'Tajawal', sans-serif",
          fontWeight: 800,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ScheduleIcon sx={{ color: "emerald.600" }} />
          مواعيد حلقة: {halaqa.name}
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "stone.400" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {errorMessage}
          </Alert>
        )}

        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: "16px",
            bgcolor: "stone.50",
            borderStyle: "dashed",
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            fontWeight="bold"
            color="stone.700"
          >
            إضافة موعد جديد
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              select
              label="اليوم"
              value={newSchedule.day_of_week}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, day_of_week: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "white",
                },
              }}
            >
              {DAYS.map((day) => (
                <MenuItem key={day.value} value={day.value}>
                  {day.label}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2}>
              <TextField
                type="time"
                label="من"
                value={newSchedule.start_time}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, start_time: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
              <TextField
                type="time"
                label="إلى"
                value={newSchedule.end_time}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, end_time: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    bgcolor: "white",
                  },
                }}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={createMutation.isPending}
              startIcon={<Add />}
              fullWidth
              sx={{
                borderRadius: "12px",
                py: 1.2,
                bgcolor: "emerald.600",
                "&:hover": { bgcolor: "emerald.700" },
              }}
            >
              إضافة الموعد
            </Button>
          </Stack>
        </Paper>

        <Typography
          variant="subtitle2"
          gutterBottom
          fontWeight="bold"
          color="stone.700"
        >
          المواعيد الحالية
        </Typography>
        {isLoading ? (
          <Typography sx={{ py: 2, textAlign: "center" }}>
            جاري التحميل...
          </Typography>
        ) : schedules?.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
              bgcolor: "stone.50",
              borderRadius: "16px",
              border: "1px solid #f5f5f4",
            }}
          >
            <Typography color="stone.400">
              لا توجد مواعيد مضافة لهذه الحلقة.
            </Typography>
          </Box>
        ) : (
          <List sx={{ px: 0 }}>
            {schedules?.map((schedule, index) => (
              <React.Fragment key={schedule.schedule_id}>
                {index > 0 && (
                  <Divider variant="inset" component="li" sx={{ my: 0.5 }} />
                )}
                <ListItem
                  sx={{
                    borderRadius: "12px",
                    "&:hover": { bgcolor: "stone.50" },
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => handleDelete(schedule.schedule_id)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  }
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "10px",
                      bgcolor: "emerald.50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <ScheduleIcon sx={{ fontSize: 20, color: "emerald.600" }} />
                  </Box>
                  <ListItemText
                    primary={
                      DAYS.find((d) => d.value === schedule.day_of_week)?.label
                    }
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: "stone.800",
                    }}
                    secondary={`${schedule.start_time} - ${schedule.end_time}`}
                    secondaryTypographyProps={{ color: "stone.500" }}
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          fullWidth
          variant="outlined"
          sx={{
            borderRadius: "12px",
            color: "stone.600",
            borderColor: "stone.200",
          }}
        >
          إغلاق النافذة
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HalaqaSchedulesModal;
