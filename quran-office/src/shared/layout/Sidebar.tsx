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
  useTheme,
  useMediaQuery,
  alpha,
  Divider,
} from "@mui/material";
import {
  SettingsRounded,
  LogoutRounded,
  AutoStoriesRounded,
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

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
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
        bgcolor: 'background.paper',
        borderLeft: isMobile ? "none" : `1px solid ${theme.palette.stone[200]}`,
        overflowX: "hidden",
      }}
    >
      {/* Header / Logo */}
      <Box sx={{ p: 3, pt: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            background: `linear-gradient(135deg, ${theme.palette.emerald[600]} 0%, ${theme.palette.emerald[400]} 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            boxShadow: `0 8px 16px ${alpha(theme.palette.emerald.main, 0.2)}`,
          }}
        >
          <AutoStoriesRounded fontSize="small" />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.15rem",
              color: 'stone.900',
              lineHeight: 1.2,
              letterSpacing: '-0.02em'
            }}
          >
            علمه البيان
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'stone.500',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          >
            نظام الإدارة الشامل
          </Typography>
        </Box>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 2, mt: 3, flex: 1, "& .MuiListItem-root": { mb: 0.5 } }}>
        <Typography
          variant="caption"
          sx={{
            px: 2,
            mb: 1.5,
            display: "block",
            color: 'stone.400',
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: '0.65rem'
          }}
        >
          القائمة الرئيسية
        </Typography>
        {filteredItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                borderRadius: "12px",
                py: 1.25,
                px: 2,
                color: 'stone.600',
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&.active": {
                  background: alpha(theme.palette.emerald.main, 0.08),
                  color: 'emerald.700',
                  "& .MuiListItemIcon-root": {
                    color: 'emerald.600',
                  },
                },
                "&:hover:not(.active)": {
                  background: 'stone.50',
                  color: 'stone.900',
                  "& .MuiListItemIcon-root": {
                    color: 'stone.900',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{ color: "inherit", minWidth: 38, transition: "0.2s" }}
              >
                {React.isValidElement(item.icon)
                  ? React.cloneElement(item.icon as any, { fontSize: "small" })
                  : item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Section */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.stone[100]}` }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate("/settings")}
            sx={{
              borderRadius: "10px",
              py: 1,
              color: 'stone.500',
              "&:hover": { color: 'stone.900', bgcolor: 'stone.50' },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
              <SettingsRounded sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="الإعدادات"
              primaryTypographyProps={{
                fontSize: "0.8125rem",
                fontWeight: 700,
              }}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              borderRadius: "10px",
              py: 1,
              color: 'stone.500',
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
                color: 'error.main',
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
              <LogoutRounded sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText
              primary="تسجيل الخروج"
              primaryTypographyProps={{
                fontSize: "0.8125rem",
                fontWeight: 700,
              }}
            />
          </ListItemButton>
        </ListItem>

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            bgcolor: 'stone.50',
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            border: `1px solid ${theme.palette.stone[100]}`
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: `linear-gradient(45deg, ${theme.palette.stone[200]}, ${theme.palette.stone[100]})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                textAlign: "center",
                fontSize: "12px",
                fontWeight: 800,
                color: 'stone.600'
              }}
            >
              {userRole[0].toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 800,
                lineHeight: 1.2,
                color: 'stone.900',
                fontSize: '0.8rem'
              }}
            >
              {userRole === "admin" ? "مدير النظام" : "معلم"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", color: 'stone.500', fontSize: "10px", fontWeight: 600 }}
            >
              {userRole.toUpperCase()}
            </Typography>
          </Box>
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
            borderLeft: "none",
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
            borderRight: "none",
            borderLeft: `1px solid ${theme.palette.stone[200]}`,
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

