import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  MenuItem,
  Box,
  CircularProgress
} from "@mui/material";
import { useMoveStudent } from "../hooks/useEnrollment";
import { useHalaqat } from "@/features/halaqat/hooks/useHalaqat";
import { useNotification } from "@/shared/hooks/useNotification";

interface TransferStudentModalProps {
  open: boolean;
  onClose: () => void;
  enrollmentId: string;
  currentHalaqaId: string;
}

const TransferStudentModal: React.FC<TransferStudentModalProps> = ({
  open,
  onClose,
  enrollmentId,
  currentHalaqaId,
}) => {
  const { data: halaqat, isLoading: isHalaqatLoading } = useHalaqat();
  const moveStudentMutation = useMoveStudent();
  const { notify } = useNotification();
  const [selectedHalaqaId, setSelectedHalaqaId] = useState<string>("");

  const availableHalaqat = halaqat?.filter((h) => h.halaqa_id !== currentHalaqaId) || [];

  const handleTransfer = () => {
    if (!selectedHalaqaId) {
      notify("الرجاء اختيار حلقة لنقل الطالب إليها", "error");
      return;
    }

    moveStudentMutation.mutate(
      { enrollmentId, newHalaqaId: selectedHalaqaId },
      {
        onSuccess: () => {
          notify("تم نقل الطالب بنجاح", "success");
          onClose();
        },
        onError: () => {
          notify("حدث خطأ أثناء نقل الطالب", "error");
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          نقل الطالب إلى حلقة أخرى
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {isHalaqatLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TextField
              select
              label="اختر الحلقة الجديدة"
              fullWidth
              value={selectedHalaqaId}
              onChange={(e) => setSelectedHalaqaId(e.target.value)}
            >
              {availableHalaqat.length === 0 ? (
                <MenuItem disabled value="">
                  لا توجد حلقات أخرى متاحة
                </MenuItem>
              ) : (
                availableHalaqat.map((h) => (
                  <MenuItem key={h.halaqa_id} value={h.halaqa_id}>
                    {h.name} {h.teacher ? `(${h.teacher.full_name})` : ""}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button
          onClick={handleTransfer}
          variant="contained"
          disabled={!selectedHalaqaId || moveStudentMutation.isPending}
        >
          {moveStudentMutation.isPending ? "جاري النقل..." : "تأكيد النقل"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferStudentModal;
