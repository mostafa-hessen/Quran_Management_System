import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { SettingsRounded, LogoutRounded } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import { usePermissions } from "../../features/auth/hooks";
import { menuItems } from "../../shared/utils/config/navigation";

const DRAWER_WIDTH = 280;

const Sidebar: React.FC = () => {
  const { signOut } = useAuthStore();
  const { role } = usePermissions();
  const userRole = role || "teacher";
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          backgroundColor: "#064e3b", // Deep Emerald
          color: "#ecfdf5",
          borderRight: "none",
          boxShadow: "-4px 0 10px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Logo Section */}
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Tajawal, sans-serif",
            fontWeight: 800,
            color: "#fbbf24", // Golden
            mb: 1,
          }}
        >
          ☽ مكتب التحفيظ
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              opacity: 0.8,
              bgcolor: "rgba(255,255,255,0.1)",
              px: 1,
              borderRadius: 1,
            }}
          >
            {userRole === "admin"
              ? "مدير"
              : userRole === "supervisor"
                ? "سكرتارية"
                : "معلم"}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{ backgroundColor: "rgba(255,255,255,0.1)", mx: 2, mb: 2 }}
      />

      <List sx={{ px: 2, flex: 1 }}>
        {filteredItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: "12px",
                py: 1.5,
                "&.active": {
                  backgroundColor: "rgba(251, 191, 36, 0.15)",
                  color: "#fbbf24",
                  "& .MuiListItemIcon-root": { color: "#fbbf24" },
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#ecfdf5", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  fontFamily: "Tajawal, sans-serif",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Section */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <ListItemButton
          sx={{ borderRadius: "12px", color: "rgba(255,255,255,0.5)" }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <SettingsRounded />
          </ListItemIcon>
          <ListItemText
            primary="الإعدادات العامة"
            primaryTypographyProps={{ fontSize: "0.85rem" }}
          />
        </ListItemButton>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.1)", my: 1 }} />

        <ListItemButton
          onClick={handleSignOut}
          sx={{
            borderRadius: "12px",
            color: "#fca5a5",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText
            primary="تسجيل الخروج"
            primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: "bold" }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
