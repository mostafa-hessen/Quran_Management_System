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
  VisibilityOffRounded,
  VisibilityRounded,
  EmailRounded,
  LockRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "../features/auth/hooks";
import { useAuthStore } from "../features/auth/store";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  const signInMutation = useSignIn();

  // Redirect if already logged in
  useEffect(() => {
    if (initialized && user) {
      navigate("/", { replace: true });
    }
  }, [user, initialized, navigate]);

  const loading = signInMutation.isPending;
  const errorMsg = signInMutation.error?.message || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signInMutation.mutate(
      { email, password },
      { onSuccess: () => navigate("/") },
    );
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
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background circles */}
      <Box
        sx={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.04)",
          top: -100,
          right: -100,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.04)",
          bottom: -80,
          left: -80,
          pointerEvents: "none",
        }}
      />

      <Box sx={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              bgcolor: "rgba(255,255,255,0.12)",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            }}
          >
            <Typography variant="h3" sx={{ color: "#fbbf24", lineHeight: 1 }}>
              ☽
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              mb: 1,
              fontFamily: "Amiri Quran, serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            مكتب التحفيظ
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ color: "#a7f3d0", opacity: 0.85, letterSpacing: 0.5 }}
          >
            نظام الإدارة المتكامل
          </Typography>
        </Box>

        {/* Login Card */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: "28px",
            boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="h5"
              color="text.primary"
              fontWeight="bold"
              mb={0.5}
            >
              تسجيل الدخول
            </Typography>
            <Typography variant="body2" color="text.secondary">
              أدخل بيانات حسابك للمتابعة
            </Typography>
          </Box>

          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {errorMsg === "Invalid login credentials"
                ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
                : errorMsg}
            </Alert>
          )}

          <TextField
            label="البريد الإلكتروني"
            type="email"
            variant="outlined"
            fullWidth
            required
            autoComplete="email"
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
            autoComplete="current-password"
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
                    size="small"
                  >
                    {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 1,
              borderRadius: "14px",
              bgcolor: "#059669",
              color: "white",
              py: 1.6,
              fontWeight: "bold",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#047857" },
              textTransform: "none",
              boxShadow: "0 4px 20px rgba(5, 150, 105, 0.4)",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "دخول إلى النظام"
            )}
          </Button>

          <Typography
            variant="caption"
            color="text.disabled"
            textAlign="center"
            sx={{ mt: 1 }}
          >
            للحصول على حساب، تواصل مع مدير النظام
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
