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
  NotificationsRounded,
} from "@mui/icons-material";
import { useAuthStore } from "../../features/auth/store";

interface TopbarProps {
  onMenuClick?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuthStore();

  // Get current date in Arabic
  const currentDate = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        color: "text.primary",
        boxShadow: "none",
        borderBottom: "1px solid #f1f1f1",
        zIndex: 1100,
        height: 64,
        justifyContent: "center"
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onMenuClick} sx={{ color: "#a8a29e" }}>
              <MenuRounded />
            </IconButton>
          )}
          <Typography variant="h6" fontWeight="800" color="#292524" sx={{ fontSize: "1.1rem" }}>
            الطلاب
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 3 } }}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: "#a8a29e", 
              display: { xs: "none", sm: "block" },
              fontWeight: 500
            }}
          >
            {currentDate}
          </Typography>

          <Tooltip title="التنبيهات">
            <IconButton sx={{ color: "#a8a29e", p: 1 }}>
              <Badge 
                badgeContent={0} 
                color="error" 
                sx={{ "& .MuiBadge-badge": { fontSize: 10, height: 16, minWidth: 16 } }}
              >
                <NotificationsRounded sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: "#f5f5f4",
              color: "#57534e",
              fontSize: "0.9rem",
              fontWeight: "bold",
              border: "1px solid #e7e5e4",
              borderRadius: "10px"
            }}
          >
            {user?.email?.[0].toUpperCase() || "م"}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
