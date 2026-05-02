import React from "react";
import { Box, Button, Tooltip, useTheme, alpha } from "@mui/material";
import { 
  Assignment as TaskIcon, 
  Group as StudentsIcon, 
  Edit as EditIcon, 
  DeleteOutline as DeleteIcon,
  Visibility as ViewIcon
} from "@mui/icons-material";

interface ActionButtonsGroupProps {
  onTasks: () => void;
  onStudents: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

export const ActionButtonsGroup: React.FC<ActionButtonsGroupProps> = ({
  onTasks,
  onStudents,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const theme = useTheme();

  const buttonStyle = {
    minWidth: 0,
    width: 42,
    height: 42,
    borderRadius: "12px",
  };

  return (
    <Box sx={{ display: "flex", gap: 1, width: "100%", mt: 2 }}>
      <Tooltip title="التفاصيل">
        <Button
          variant="contained"
          onClick={onViewDetails}
          sx={{
            ...buttonStyle,
            bgcolor: theme.palette.primary.main,
            color: "white",
            minWidth: "auto",
            "&:hover": { bgcolor: theme.palette.primary.dark }
          }}
        >
          <ViewIcon sx={{ fontSize: 20 }} />
        </Button>
      </Tooltip>

      <Tooltip title="واجب جديد">
        <Button
          variant="outlined"
          onClick={onTasks}
          sx={{
            ...buttonStyle,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            color: theme.palette.primary.main,
            flex: 1,
            gap: 1,
            minWidth: "auto",
            "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.05) }
          }}
        >
          <TaskIcon sx={{ fontSize: 20 }} />
          واجب
        </Button>
      </Tooltip>

      <Tooltip title="الطلاب">
        <Button
          variant="outlined"
          onClick={onStudents}
          sx={{
            ...buttonStyle,
            borderColor: alpha(theme.palette.sky.main, 0.2),
            color: theme.palette.sky.main,
            flex: 1,
            gap: 1,
            "&:hover": { bgcolor: alpha(theme.palette.sky.main, 0.05) }
          }}
        >
          <StudentsIcon sx={{ fontSize: 20 }} />
          الطلاب
        </Button>
      </Tooltip>

      <Tooltip title="تعديل">
        <Button
          variant="outlined"
          onClick={onEdit}
          sx={{
            ...buttonStyle,
            borderColor: alpha(theme.palette.stone[300], 0.5),
            color: theme.palette.stone[600],
            "&:hover": { bgcolor: theme.palette.stone[50] }
          }}
        >
          <EditIcon sx={{ fontSize: 20 }} />
        </Button>
      </Tooltip>

      <Tooltip title="حذف">
        <Button
          variant="outlined"
          onClick={onDelete}
          sx={{
            ...buttonStyle,
            borderColor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            "&:hover": { 
              bgcolor: alpha(theme.palette.error.main, 0.05),
              borderColor: alpha(theme.palette.error.main, 0.3)
            }
          }}
        >
          <DeleteIcon sx={{ fontSize: 20 }} />
        </Button>
      </Tooltip>
    </Box>
  );
};
