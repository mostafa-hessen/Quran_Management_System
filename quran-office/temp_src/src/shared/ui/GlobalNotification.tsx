import React from "react";
import { Snackbar, Alert, Slide, type SlideProps } from "@mui/material";
import { useNotification } from "@/shared/hooks/useNotification";

const SlideTransition = (props: SlideProps) => (
  <Slide {...props} direction="down" />
);

const GlobalNotification: React.FC = () => {
  const { open, message, severity, close } = useNotification();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={close}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={SlideTransition}
      sx={{ mb: 2 }}
    >
      <Alert
        onClose={close}
        severity={severity}
        variant="filled"
        sx={{
          color: "white",
          minWidth: 300,
          borderRadius: "14px",
          fontFamily: "inherit",
          fontSize: "0.9rem",
          fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          alignItems: "center",
          "& .MuiAlert-icon": { fontSize: "1.3rem" },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalNotification;
