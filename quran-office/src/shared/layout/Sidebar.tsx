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
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  SettingsRounded, 
  LogoutRounded, 
  ChevronRight, 
  Close 
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store";
import { usePermissions } from "../../features/auth/hooks";
import { menuItems } from "../../shared/utils/config/navigation";

const DRAWER_WIDTH = 280;

interface SidebarProps {
  mobileOpen?: boolean;
  handleDrawerToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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

  const drawerContent = (
    <Box 
      sx={{ 
        height: "100%", 
        display: "flex", 
        flexDirection: "column",
        background: (theme) => `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.success.dark} 100%)`,
        color: "primary.contrastText",
        boxShadow: "-4px 0 30px rgba(0,0,0,0.15)",
        overflowX: "hidden"
      }}
    >
      {/* Mobile Close Button */}
      {isMobile && (
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{ position: "absolute", top: 10, left: 10, color: "rgba(255,255,255,0.6)" }}
        >
          <Close />
        </IconButton>
      )}

      {/* Header / Logo */}
      <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box 
          component="img"
          src="/logo.png"
          alt="مكتب التحفيظ"
          sx={{ 
            width: 80, 
            height: 'auto', 
            objectFit: "contain",
            mb: 2
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Tajawal, sans-serif",
            fontWeight: 800,
            letterSpacing: 1,
            color: "secondary.main",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}
        >
          مكتب التحفيظ
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            opacity: 0.6, 
            mt: 0.5, 
            bgcolor: "rgba(255,255,255,0.08)", 
            px: 1.5, 
            borderRadius: 10,
            textTransform: "uppercase",
            letterSpacing: 1
          }}
        >
          نظام الإدارة المتكامل
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 3, mb: 2 }} />

      {/* Navigation Items */}
      <List sx={{ px: 2, flex: 1, "& .MuiListItem-root": { mb: 0.5 } }}>
        {filteredItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                borderRadius: "14px",
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease-in-out",
                "&.active": {
                  background: "rgba(255, 255, 255, 0.12)",
                  color: "secondary.main",
                  "& .MuiListItemIcon-root": { 
                    color: "secondary.main",
                    transform: "scale(1.1)"
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    right: -16,
                    height: "60%",
                    width: 4,
                    bgcolor: "secondary.main",
                    borderRadius: "4px 0 0 4px"
                  }
                },
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.05)",
                  transform: "translateX(-4px)"
                },
              }}
            >
              <ListItemIcon sx={{ color: "rgba(255,255,255,0.7)", minWidth: 44, transition: "0.2s" }}>
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
              <ChevronRight sx={{ fontSize: "1rem", opacity: 0.3 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* footer Section */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: 4, 
            bgcolor: "rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <ListItemButton
            sx={{ 
              borderRadius: 3, 
              color: "rgba(255,255,255,0.4)",
              mb: 1,
              "&:hover": { color: "white" }
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <SettingsRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="الإعدادات"
              primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 600 }}
            />
          </ListItemButton>

          <ListItemButton
            onClick={handleSignOut}
            sx={{
              borderRadius: 3,
              color: "#fca5a5",
              "&:hover": { 
                bgcolor: "rgba(239, 68, 68, 0.15)",
                color: "#f87171"
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <LogoutRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="تسجيل الخروج"
              primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: "bold" }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { md: DRAWER_WIDTH }, 
        flexShrink: { md: 0 },
        position: 'relative',
        zIndex: 1200 // Higher than content but same as AppBar standard
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            border: "none",
            backgroundColor: "transparent",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
