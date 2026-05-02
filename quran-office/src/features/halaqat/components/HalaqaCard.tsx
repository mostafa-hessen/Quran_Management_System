import React from "react";
import { 
  Card, 
  Box, 
  Typography, 
  Avatar, 
  Chip, 
  Stack, 
  useTheme, 
  alpha, 
  Divider 
} from "@mui/material";
import { 
  LocationOn as LocationIcon, 
  School as LevelIcon, 
  Person as TeacherIcon 
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import type { Halaqa } from "../types";
import { SchedulePill } from "./ui/SchedulePill";
import { EnrollmentProgress } from "./ui/EnrollmentProgress";
import { ActionButtonsGroup } from "./ui/ActionButtonsGroup";
import { useHalaqatStore } from "../store";

interface HalaqaCardProps {
  halaqa: Halaqa;
}

export const HalaqaCard: React.FC<HalaqaCardProps> = ({ halaqa }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { openEditForm, openDeleteConfirm, openStudentsDrawer } = useHalaqatStore();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 24px -10px ${alpha(theme.palette.stone[900], 0.1)}`,
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
            {halaqa.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary" }}>
            <LocationIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption">{halaqa.location || "غير محدد"}</Typography>
          </Box>
        </Box>
        <Chip
          icon={<LevelIcon sx={{ fontSize: "14px !important" }} />}
          label={halaqa.level || "مستوى غير محدد"}
          size="small"
          sx={{
            fontWeight: 700,
            bgcolor: alpha(theme.palette.sky.main, 0.08),
            color: theme.palette.sky.dark,
            border: `1px solid ${alpha(theme.palette.sky.main, 0.1)}`,
          }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar 
            src={halaqa.teacher?.avatar_url} 
            sx={{ width: 32, height: 32, bgcolor: theme.palette.stone[100], color: theme.palette.stone[600] }}
          >
            <TeacherIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box>
            <Typography variant="caption" display="block" sx={{ color: "text.secondary", lineHeight: 1 }}>
              المعلم
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {halaqa.teacher?.full_name || "لم يتم التعيين"}
            </Typography>
          </Box>
        </Stack>

        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary", 
            mb: 2, 
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            height: 40,
          }}
        >
          {halaqa.description || "لا يوجد وصف لهذه الحلقة."}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mb: 1, fontWeight: 700 }}>
            المواعيد
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
            {halaqa.schedules && halaqa.schedules.length > 0 ? (
              halaqa.schedules.map((s) => (
                <SchedulePill 
                  key={s.schedule_id} 
                  day={s.day_of_week} 
                  startTime={s.start_time} 
                  endTime={s.end_time} 
                />
              ))
            ) : (
              <Typography variant="caption" sx={{ fontStyle: "italic", color: "stone.400" }}>
                لا توجد مواعيد مجدولة
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, borderStyle: "dashed" }} />

      {/* Footer */}
      <Box>
        <EnrollmentProgress 
          current={halaqa.student_count || 0} 
          capacity={halaqa.capacity || 20} 
        />
        <ActionButtonsGroup
          onTasks={() => {}} // TODO: Connect to tasks
          onStudents={() => openStudentsDrawer(halaqa)}
          onEdit={() => openEditForm(halaqa)}
          onDelete={() => openDeleteConfirm(halaqa)}
          onViewDetails={() => navigate(`/halaqat/${halaqa.halaqa_id}`)}
        />
      </Box>
    </Card>
  );
};
