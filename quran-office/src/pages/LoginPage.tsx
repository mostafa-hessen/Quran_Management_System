import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  AdminPanelSettingsRounded,
  MenuBookRounded,
  AssignmentIndRounded,
  VisibilityOffRounded,
  VisibilityRounded,
  EmailRounded,
  LockRounded,
  PersonRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSignIn, useSignUp } from "../features/auth/hooks";
import { useAuthStore } from "../features/auth/store";
import { Role } from "../features/auth/types";

const LoginPage: React.FC = () => {
  
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>(Role.TEACHER);

  const [showPassword, setShowPassword] = useState(false);

  // Selective subscriptions
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      navigate("/", { replace: true });
    }
  }, [user, initialized, navigate]);

  const loading = signInMutation.isPending || signUpMutation.isPending;
  const errorMsg =
    signInMutation.error?.message || signUpMutation.error?.message || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      signInMutation.mutate(
        { email, password },
        {
          onSuccess: () => navigate("/"),
        },
      );
    } else {
      signUpMutation.mutate(
        { email, password, role, fullName },
        {
          onSuccess: () => {
            alert(
              "تم إنشاء الحساب بنجاح! إذا كانت هناك رسالة تفعيل يرجى مراجعة بريدك.",
            );
            setIsLogin(true);
          },
        },
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 450 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              width: 72,
              height: 72,
              bgcolor: "rgba(255,255,255,0.15)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              backdropFilter: "blur(8px)",
            }}
          >
            <Typography variant="h3" sx={{ color: "#fbbf24" }}>
              ☽
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{ color: "#fff", mb: 1, fontFamily: "Amiri Quran, serif" }}
          >
            مكتب التحفيظ
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#a7f3d0", opacity: 0.8 }}
          >
            نظام الإدارة المتكامل
          </Typography>
        </Box>

        {/* Auth Card */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 6,
            boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Typography
            variant="h5"
            color="text.primary"
            textAlign="center"
            fontWeight="bold"
          >
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {!isLogin && (
            <TextField
              label="الاسم الكامل"
              variant="outlined"
              fullWidth
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonRounded color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <TextField
            label="البريد الإلكتروني"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailRounded color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="كلمة المرور"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRounded color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOffRounded />
                    ) : (
                      <VisibilityRounded />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                mb={1}
                display="block"
              >
                اختر نوع الحساب:
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  {
                    id: "teacher",
                    label: "معلم",
                    icon: <MenuBookRounded fontSize="small" />,
                  },
                  {
                    id: "supervisor",
                    label: "سكرتيرة",
                    icon: <AssignmentIndRounded fontSize="small" />,
                  },
                  {
                    id: "admin",
                    label: "إدارة",
                    icon: <AdminPanelSettingsRounded fontSize="small" />,
                  },
                ].map((item) => (
                  <Button
                    key={item.id}
                    variant={role === item.id ? "contained" : "outlined"}
                    color={role === item.id ? "primary" : "inherit"}
                    onClick={() => setRole(item.id as Role)}
                    sx={{ flex: 1, textTransform: "none", py: 1 }}
                    startIcon={item.icon}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
              borderRadius: 3,
              bgcolor: "#059669",
              color: "white",
              py: 1.5,
              fontWeight: "bold",
              "&:hover": { bgcolor: "#047857" },
              textTransform: "none",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isLogin ? (
              "دخول"
            ) : (
              "تسجيل"
            )}
          </Button>

          <Button
            variant="text"
            onClick={() => setIsLogin(!isLogin)}
            sx={{ color: "#475569", textTransform: "none" }}
          >
            {isLogin
              ? "ليس لديك حساب؟ إنشاء حساب جديد"
              : "لديك حساب بالفعل؟ تسجيل الدخول"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
