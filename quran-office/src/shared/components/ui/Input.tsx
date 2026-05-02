import React from "react";
import { TextField, styled, Box, Typography, type TextFieldProps } from "@mui/material";


interface InputProps extends Omit<TextFieldProps, "variant"> {
  label?: string;
  variant?: "outlined";
}

const StyledTextField = styled(TextField)(({ theme }) => {
  const stone = (theme.palette as any).stone;
  const emerald = (theme.palette as any).emerald;

  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "11px",
      backgroundColor: stone[50],
      transition: "all 0.15s ease",
      fontFamily: '"Tajawal", sans-serif',
      fontSize: "13.5px",
      "& fieldset": {
        borderColor: stone[200],
        borderWidth: "1.5px",
      },
      "&:hover fieldset": {
        borderColor: stone[400],
      },
      "&.Mui-focused": {
        backgroundColor: "#FFFFFF",
        "& fieldset": {
          borderColor: emerald[600],
        },
      },
    },
    "& .MuiInputBase-input": {
      padding: "9px 13px",
      color: stone[800],
      "&::placeholder": {
        color: stone[400],
        opacity: 1,
      },
    },
  };
});

const Label = styled(Typography)(({ theme }) => {
  const stone = (theme.palette as any).stone;
  return {
    fontSize: "12.5px",
    fontWeight: 600,
    color: stone[600],
    marginBottom: "5px",
    fontFamily: '"Tajawal", sans-serif',
  };
});

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {label && <Label>{label}</Label>}
      <StyledTextField {...props} variant="outlined" fullWidth />
    </Box>
  );
};
