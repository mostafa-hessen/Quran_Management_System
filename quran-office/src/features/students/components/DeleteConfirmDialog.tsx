import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Alert,
} from "@mui/material";
import { DeleteOutline, WarningAmber } from "@mui/icons-material";
import { useDeleteStudent } from "../hooks/useDeleteStudent";
import type { FullStudentData } from "../types";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  student: FullStudentData;
}

/**
 * Premium Delete Confirmation Dialog.
 * Uses warning aesthetic and provides clear impact description.
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  student,
}) => {
  const deleteMutation = useDeleteStudent();

  const handleDelete = () => {
    deleteMutation.mutate({
      studentId: student.student_id,
      snapshot: student,
    }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          p: 1,
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              bgcolor: "error.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "error.600",
            }}
          >
            <WarningAmber />
          </Box>
          <Typography variant="h6" fontWeight="800">
            حذف بيانات الطالب
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body1" color="stone.600">
            هل أنت متأكد من حذف الطالب <strong>{student.first_name} {student.family_name}</strong>؟ 
            لا يمكن التراجع عن هذا الإجراء وسيتم حذف كافة السجلات المرتبطة به.
          </Typography>
          
          {deleteMutation.error && (
            <Alert severity="error" sx={{ borderRadius: "10px" }}>
              {deleteMutation.error.message}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1.5 }}>
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            py: 1,
            borderRadius: "10px",
            color: "stone.500",
            "&:hover": { bgcolor: "stone.100" },
          }}
        >
          إلغاء
        </Button>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          startIcon={!deleteMutation.isPending && <DeleteOutline />}
          sx={{
            py: 1,
            borderRadius: "10px",
            boxShadow: "none",
            "&:hover": { bgcolor: "error.700", boxShadow: "none" },
          }}
        >
          {deleteMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
