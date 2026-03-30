import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/features/auth/store";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useAuthStore((state) => state.initialized);
  const loading = useAuthStore((state) => state.loading);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    if (!initialized) {
      initialize();
    }

    console.log(initialized, loading);
  }, []);

  if (!initialized || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f0fdf4", // خلفية Emerald هادئة
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return <>{children}</>;
}
