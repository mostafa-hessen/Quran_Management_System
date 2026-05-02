import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import { Warning as WarningIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useHalaqatStore } from "../store";
import { useDeleteHalaqa } from "../hooks/useHalaqat";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils/errorHandler";

export const HalaqaDeleteConfirmModal: React.FC = () => {
  const theme = useTheme();
  const { isDeleteConfirmOpen, closeDeleteConfirm, selectedHalaqa } = useHalaqatStore();
  const deleteHalaqaMutation = useDeleteHalaqa();

  const handleDelete = async () => {
    if (!selectedHalaqa) return;
    
    try {
      await deleteHalaqaMutation.mutateAsync(selectedHalaqa.halaqa_id);
      toast.success("تم حذف الحلقة بنجاح");
      closeDeleteConfirm();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Dialog
      open={isDeleteConfirmOpen}
      onClose={closeDeleteConfirm}
      PaperProps={{
        sx: { borderRadius: "20px", p: 1, maxWidth: "400px" },
      }}
    >
      <DialogContent sx={{ textAlign: "center", pt: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
            mb: 2,
          }}
        >
          <WarningIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          تأكيد الحذف
        </Typography>
        <Typography variant="body2" color="text.secondary">
          هل أنت متأكد من رغبتك في حذف حلقة{" "}
          <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
            "{selectedHalaqa?.name}"
          </Box>
          ؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع البيانات المرتبطة بها.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={closeDeleteConfirm}
          sx={{ borderRadius: "12px", py: 1 }}
        >
          إلغاء
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
          disabled={deleteHalaqaMutation.isPending}
          sx={{ borderRadius: "12px", py: 1 }}
        >
          {deleteHalaqaMutation.isPending ? "جاري الحذف..." : "حذف الآن"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
