import React from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  School,
} from "@mui/icons-material";
import { Card, Button } from "@/shared/components/ui";
import type { Halaqa } from "../types";
import { useHalaqatStore } from "../store";

interface HalaqaDetailsSidebarProps {
  halaqa: Halaqa;
  studentCount: number;
}

const HalaqaDetailsSidebar: React.FC<HalaqaDetailsSidebarProps> = ({
  halaqa,
  studentCount,
}) => {
  const { openEditForm } = useHalaqatStore();
  const progress = (studentCount / (halaqa.capacity || 1)) * 100;

  return (
    <Stack spacing={3}>
      <Card>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: "stone.700" }}>
          إحصائيات الحلقة
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "stone.500" }}>
              نسبة الإشغال
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {studentCount} / {halaqa.capacity}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "stone.100",
              "& .MuiLinearProgress-bar": { bgcolor: "emerald.500", borderRadius: 4 },
            }}
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "stone.100", color: "stone.600" }}>
            <School />
          </Avatar>
          <Box>
            <Typography variant="caption" sx={{ color: "stone.400", display: "block" }}>
              المعلم المسؤول
            </Typography>
            <Typography sx={{ fontWeight: 700, color: "stone.700" }}>
              {halaqa.teacher?.full_name || "غير معين"}
            </Typography>
          </Box>
          <Button 
            size="small" 
            colorType="ghost" 
            sx={{ ml: "auto" }}
            onClick={() => openEditForm(halaqa)}
          >
            تغيير
          </Button>
        </Box>
      </Card>

      <Card>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: "stone.700" }}>
          الجدول الزمني
        </Typography>
        <Stack spacing={1}>
          {halaqa.schedules?.map((s, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                p: 1.5,
                bgcolor: "emerald.50",
                borderRadius: "10px",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: "emerald.800" }}>
                {s.day_of_week}
              </Typography>
              <Typography variant="body2" sx={{ color: "emerald.600" }}>
                {s.start_time} - {s.end_time}
              </Typography>
            </Box>
          )) || (
            <Typography variant="body2" sx={{ color: "stone.400", fontStyle: "italic" }}>
              لا يوجد مواعيد محددة
            </Typography>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};

export default HalaqaDetailsSidebar;
