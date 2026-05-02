import React from "react";
import { Button as MuiButton, styled } from "@mui/material";
import type { ButtonProps as MuiButtonProps } from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  variant?: "contained" | "outlined" | "text";
  colorType?: "primary" | "secondary" | "danger" | "ghost";
}

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== "colorType",
})<ButtonProps>(({ theme, colorType }) => {
  const stone = (theme.palette as any).stone;
  const emerald = (theme.palette as any).emerald;

  const baseStyle = {
    borderRadius: "11px",
    fontWeight: 700,
    fontSize: "13.5px",
    textTransform: "none" as const,
    padding: "9px 18px",
    fontFamily: '"Tajawal", sans-serif',
    transition: "all 0.15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
    },
  };

  if (colorType === "primary") {
    return {
      ...baseStyle,
      backgroundColor: emerald[800],
      color: "#FFFFFF",
      "&:hover": {
        ...baseStyle["&:hover"],
        backgroundColor: emerald[700],
      },
    };
  }

  if (colorType === "danger") {
    return {
      ...baseStyle,
      backgroundColor: "#dc2626",
      color: "#FFFFFF",
      "&:hover": {
        ...baseStyle["&:hover"],
        backgroundColor: "#b91c1c",
      },
    };
  }

  if (colorType === "ghost") {
    return {
      ...baseStyle,
      backgroundColor: "transparent",
      color: stone[500],
      border: `1.5px solid ${stone[200]}`,
      "&:hover": {
        ...baseStyle["&:hover"],
        backgroundColor: stone[50],
      },
    };
  }

  return baseStyle;
});

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};
