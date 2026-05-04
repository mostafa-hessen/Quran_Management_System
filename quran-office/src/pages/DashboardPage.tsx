import React from "react";
import { Box, Card, Typography, LinearProgress, Chip } from "@mui/material";
import {
  PeopleAltRounded,
  MenuBookRounded,
  HexagonRounded,
  WarningRounded,
  CheckCircleRounded,
  NotificationsActiveRounded,
} from "@mui/icons-material";

import { useDashboardStats } from "@/features/payments/api/queries";
import { useAuthStore } from "@/features/auth/store";

const StatCard = ({ title, value, icon, color, loading }: any) => (
  <Card
    sx={{
      p: 3,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      height: "100%",
      borderRadius: 4,
      cursor: "pointer",
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-4px)", boxShadow: 3 },
    }}
  >
    <Box sx={{ color }}>{icon}</Box>
    <Typography variant="h4" fontWeight="900" sx={{ color, mt: 1 }}>
      {loading ? "..." : value}
    </Typography>
    <Typography variant="caption" color="text.secondary" fontWeight="bold">
      {title}
    </Typography>
  </Card>
);

const DashboardPage: React.FC = () => {
  const profile = useAuthStore(state => state.profile);
  const isTeacher = profile?.role === 'teacher';
  const { data: stats, isLoading } = useDashboardStats(isTeacher ? profile.teacher_id : undefined);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* 4 Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <StatCard
          title="الطلاب"
          value={stats?.total_students || 0}
          icon={<PeopleAltRounded fontSize="large" />}
          color="#047857"
          loading={isLoading}
        />
        {!isTeacher && (
          <StatCard
            title="المعلمون"
            value={stats?.total_teachers || 0}
            icon={<MenuBookRounded fontSize="large" />}
            color="#1d4ed8"
            loading={isLoading}
          />
        )}
        <StatCard
          title="الحلقات"
          value={stats?.total_halaqat || 0}
          icon={<HexagonRounded fontSize="large" />}
          color="#b45309"
          loading={isLoading}
        />
        {!isTeacher && (
          <StatCard
            title="متأخرات مالية"
            value={stats?.overdue_count || 0}
            icon={<WarningRounded fontSize="large" />}
            color="#b91c1c"
            loading={isLoading}
          />
        )}
      </Box>

          {/* Main Details */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {/* Attendance */}
        <Card sx={{ p: 3, height: "100%", borderRadius: 4 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
            mb={2}
          >
            نسبة الحضور الكلية
          </Typography>
          <Typography variant="h3" fontWeight="900" color="#047857" mb={2}>
            {isLoading ? "..." : `${stats?.attendance_rate || 0}%`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stats?.attendance_rate || 0}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "#ecfdf5",
              "& .MuiLinearProgress-bar": { bgcolor: "#10b981" },
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2 }}
          >
            {isLoading ? "..." : `${stats?.present_count || 0} حاضر من ${stats?.total_attendance_records || 0}`}
          </Typography>
        </Card>

        {/* Sessions */}
        <Card sx={{ p: 3, height: "100%", borderRadius: 4 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
            mb={2}
          >
            جلسات مجدولة
          </Typography>
          <Typography variant="h3" fontWeight="900" color="#1d4ed8" mb={2}>
            {isLoading ? "..." : (stats?.scheduled_sessions || 0)}
          </Typography>
          <Box mt={2}>
            <Chip
              label="عرض الجلسات"
              sx={{
                bgcolor: "#dbeafe",
                color: "#1d4ed8",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            />
          </Box>
        </Card>

        {/* Homework */}
        <Card sx={{ p: 3, height: "100%", borderRadius: 4 }}>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            color="text.secondary"
            mb={2}
          >
            واجبات تنتظر تصحيح
          </Typography>
          <Typography variant="h3" fontWeight="900" color="#b45309" mb={2}>
            {isLoading ? "..." : (stats?.pending_homework || 0)}
          </Typography>
          <Box mt={2}>
            <Chip
              label="تصحيح الواجبات"
              sx={{
                bgcolor: "#fef3c7",
                color: "#b45309",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            />
          </Box>
        </Card>
      </Box>

      {/* Notifications Map */}
      <Card sx={{ p: 3, borderRadius: 4 }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="text.primary"
          mb={2}
        >
          تنبيهات
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!isTeacher && stats?.overdue_count > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "#fef2f2",
                border: "1px solid #fee2e2",
                borderRadius: 3,
                gap: 2,
              }}
            >
              <WarningRounded color="error" />
              <Typography
                variant="body2"
                color="error.main"
                fontWeight="bold"
                flexGrow={1}
              >
                {stats.overdue_count} طلاب لم يدفعوا اشتراكهم أو اشتراكهم منتهي
              </Typography>
              <Chip
                label="عرض"
                size="small"
                sx={{
                  bgcolor: "#fee2e2",
                  color: "#b91c1c",
                  fontWeight: "bold",
                }}
                clickable
                component="a"
                href="/payments?tab=overdue"

              />

            </Box>
          )}

          {stats?.pending_homework > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "#fffbeb",
                border: "1px solid #fef3c7",
                borderRadius: 3,
                gap: 2,
              }}
            >
              <NotificationsActiveRounded sx={{ color: "#d97706" }} />
              <Typography
                variant="body2"
                sx={{ color: "#b45309" }}
                fontWeight="bold"
                flexGrow={1}
              >
                {stats.pending_homework} واجب لم يُصحَّح بعد
              </Typography>
              <Chip
                label="تصحيح"
                size="small"
                sx={{ bgcolor: "#fef3c7", color: "#b45309", fontWeight: "bold" }}
                clickable
              />
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 2,
              bgcolor: "#f0fdf9",
              border: "1px solid #d1fae5",
              borderRadius: 3,
              gap: 2,
            }}
          >
            <CheckCircleRounded color="success" />
            <Typography
              variant="body2"
              color="success.main"
              fontWeight="bold"
              flexGrow={1}
            >
              النظام يعمل بشكل طبيعي
            </Typography>
          </Box>
        </Box>
      </Card>

    </Box>
  );
};

export default DashboardPage;
