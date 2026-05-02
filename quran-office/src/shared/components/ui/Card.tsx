import React from "react";
import  { Card as MuiCard, styled } from "@mui/material";
import type   {  CardProps as MuiCardProps } from "@mui/material";

interface CardProps extends MuiCardProps {
  hoverable?: boolean;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== "hoverable",
})<CardProps>(({ theme, hoverable }) => {
  const stone = (theme.palette as any).stone;

  return {
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    padding: "20px",
    border: `1px solid ${stone[100]}`,
    boxShadow: "none",
    transition: "all 0.2s ease",
    ...(hoverable && {
      cursor: "pointer",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 24px rgba(0, 0, 0, 0.08)",
      },
    }),
  };
});

export const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};
