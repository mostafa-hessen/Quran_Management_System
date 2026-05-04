import React, { useState } from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  Edit,
  DeleteOutline,
  Groups,
  Schedule,
} from "@mui/icons-material";
import { useHalaqat, useDeleteHalaqa } from "../hooks/useHalaqat";
import type { Halaqa } from "../types";
import HalaqaSchedulesModal from "./HalaqaSchedulesModal";
import { useHalaqatStore } from "../store";
import { useAuthStore } from "../../auth/store";

interface HalaqatListProps {
  searchTerm: string;
}

const HalaqatList: React.FC<HalaqatListProps> = ({ searchTerm }) => {
  const { data: halaqat, isLoading, error } = useHalaqat();
  const [selectedHalaqa, setSelectedHalaqa] = useState<Halaqa | null>(null);
  const [isSchedulesModalOpen, setIsSchedulesModalOpen] = useState(false);
  const { openEditForm, openDeleteConfirm } = useHalaqatStore();

  const profile = useAuthStore((state) => state.profile);

  const filteredHalaqat = halaqat?.filter((halaqa) => {
    const matchesSearch = halaqa.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (profile?.role === 'teacher') {
      return matchesSearch && halaqa.teacher_id === profile.teacher_id;
    }
    return matchesSearch;
  });

  const handleDelete = (halaqaId: string) => {
    const halaqa = halaqat?.find(h => h.halaqa_id === halaqaId);
    if (halaqa) openDeleteConfirm(halaqa);
  };

  const handleOpenSchedules = (halaqa: Halaqa) => {
    setSelectedHalaqa(halaqa);
    setIsSchedulesModalOpen(true);
  };

  const handleOpenEdit = (halaqa: Halaqa) => {
    openEditForm(halaqa);
  };

  if (isLoading) return <Typography sx={{ p: 4, textAlign: "center", color: "stone.500" }}>جاري التحميل...</Typography>;
  if (error) return <Typography color="error" sx={{ p: 4, textAlign: "center" }}>حدث خطأ أثناء تحميل البيانات</Typography>;

  if (!filteredHalaqat || filteredHalaqat.length === 0) {
    return (
      <Card sx={{ 
        p: 8, 
        textAlign: "center", 
        borderRadius: "24px", 
        border: "2px dashed #e7e5e4", 
        bgcolor: "transparent",
        boxShadow: "none"
      }}>
        <Groups sx={{ fontSize: 64, color: "stone.300", mb: 2 }} />
        <Typography variant="h6" color="stone.600" gutterBottom>
          لا يوجد حلقات
        </Typography>
        <Typography variant="body2" color="stone.400">
          لم يتم العثور على أي حلقات تطابق بحثك أو لم يتم إضافة حلقات بعد.
        </Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: "16px", border: "1px solid #f5f5f4", boxShadow: "0 1px 2px rgba(0,0,0,0.02)", overflow: "hidden" }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "primary.main" }}>
            <TableRow>
              <TableCell>اسم الحلقة</TableCell>
              <TableCell>المعلم</TableCell>
              <TableCell>المستوى</TableCell>
              <TableCell>السعة</TableCell>
              <TableCell>الموقع</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell align="center">إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHalaqat?.map((halaqa) => (
              <TableRow key={halaqa.halaqa_id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {halaqa.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  {halaqa.teacher?.full_name || (halaqa.teacher_id ? "جاري التحميل..." : "غير معين")}
                </TableCell>
                <TableCell>{halaqa.level || "—"}</TableCell>
                <TableCell>{halaqa.capacity}</TableCell>
                <TableCell>{halaqa.location || "—"}</TableCell>
                <TableCell>
                  <Chip
                    label={halaqa.status === "active" ? "نشطة" : "غير نشطة"}
                    size="small"
                    color={halaqa.status === "active" ? "success" : "default"}
                  />
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                    <Tooltip title="المواعيد">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenSchedules(halaqa)}
                        sx={{ bgcolor: "emerald.50", color: "emerald.700", borderRadius: "8px", "&:hover": { bgcolor: "emerald.100" } }}
                      >
                        <Schedule sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="تعديل">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenEdit(halaqa)}
                        sx={{ bgcolor: "sky.50", color: "sky.700", borderRadius: "8px", "&:hover": { bgcolor: "sky.100" } }}
                      >
                        <Edit sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="حذف">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDelete(halaqa.halaqa_id)}
                        sx={{ bgcolor: "rose.50", color: "rose.700", borderRadius: "8px", "&:hover": { bgcolor: "rose.100" } }}
                      >
                        <DeleteOutline sx={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedHalaqa && (
        <HalaqaSchedulesModal
          open={isSchedulesModalOpen}
          onClose={() => setIsSchedulesModalOpen(false)}
          halaqa={selectedHalaqa}
        />
      )}
    </Card>
  );
};

export default HalaqatList;
