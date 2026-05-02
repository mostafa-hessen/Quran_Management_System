import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  MenuRounded,
  NotificationsNoneRounded,
  SearchRounded,
} from "@mui/icons-material";
import { useAuthStore } from "../../features/auth/store";
import { useLocation } from "react-router-dom";

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuthStore();
  const location = useLocation();

  // Get current page title from path
  const getPageTitle = (path: string) => {
    switch (path) {
      case "/":
        return "لوحة التحكم";
      case "/teachers":
        return "المعلمون المعلمات";
      case "/students":
        return "الطلاب والطالبات";
      case "/staff":
        return "إدارة الموظفين";
      case "/enrollments":
        return "التسجيل والطلبات";
      default:
        return "علمه البيان";
    }
  };

  const currentDate = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        color: "text.primary",
        boxShadow: "none",
        borderBottom: "1px solid #F1F5F9",
        zIndex: 1100,
        height: 72,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {isMobile && (
            <IconButton onClick={onMenuClick} sx={{ color: "#6B7280" }}>
              <MenuRounded />
            </IconButton>
          )}
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#1F2937" }}
            >
              {getPageTitle(location.pathname)}
            </Typography>
            {!isMobile && (
              <Typography
                variant="caption"
                sx={{ color: "#9CA3AF", fontWeight: 600 }}
              >
                {currentDate}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}
        >
          <Tooltip title="بحث سريع">
            <IconButton sx={{ color: "#6B7280", bgcolor: "#F8FAFC" }}>
              <SearchRounded fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="التنبيهات">
            <IconButton sx={{ color: "#6B7280", bgcolor: "#F8FAFC" }}>
              <Badge badgeContent={0} color="error" variant="dot">
                <NotificationsNoneRounded fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Box
            sx={{ width: "1px", height: "24px", bgcolor: "#E5E7EB", mx: 1 }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 1 }}>
            <Box
              sx={{ textAlign: "left", display: { xs: "none", sm: "block" } }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, lineHeight: 1, textAlign: "left" }}
              >
                {user?.email?.split("@")[0] || "المستخدم"}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "#9CA3AF", fontSize: "11px" }}
              >
                متصل الآن
              </Typography>
            </Box>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "#F1F5F9",
                color: "#1F7A63",
                fontSize: "1rem",
                fontWeight: 800,
                border: "2px solid #FFFFFF",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              {user?.email?.[0].toUpperCase() || "م"}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
