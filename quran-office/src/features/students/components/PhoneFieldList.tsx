import React from "react";
import {
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { RELATION_OPTIONS, PHONE_LABEL_OPTIONS } from "../types";
import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";

interface PhoneFieldListProps {
  fields: any[];
  register: UseFormRegister<any>;
  errors?: FieldErrors<any>;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export const PhoneFieldList: React.FC<PhoneFieldListProps> = ({
  fields,
  register,
  errors,
  onAdd,
  onRemove,
}) => {
  const phoneErrors = errors?.phones as any;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight="700" color="stone.700">
            بيانات الاتصال
          </Typography>
          <Typography variant="caption" color="stone.500">
            أضف أرقام هواتف أولياء الأمور (يجب أن يبدأ بـ 05 ويتكون من 10 أرقام)
          </Typography>
        </Box>
        <Button
          startIcon={<Add />}
          size="small"
          onClick={onAdd}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            color: "emerald.700",
            borderColor: "emerald.200",
            bgcolor: "emerald.50",
            px: 1.5,
            "&:hover": {
              borderColor: "emerald.400",
              bgcolor: "emerald.100",
            },
          }}
          aria-label="إضافة رقم هاتف جديد"
        >
          إضافة هاتف
        </Button>
      </Stack>

      <Stack spacing={2}>
        {fields.map((field, index) => (
          <Stack
            key={field.id}
            direction="row"
            spacing={1}
            alignItems="flex-start"
          >
            <TextField
              placeholder="05XXXXXXXX"
              sx={{ flex: 1 }}
              {...register(`phones.${index}.phone`)}
              error={!!phoneErrors?.[index]?.phone}
              helperText={phoneErrors?.[index]?.phone?.message}
              slotProps={{ htmlInput: { dir: "ltr" } }}
              aria-label={`رقم الهاتف ${index + 1}`}
            />
            <TextField
              select
              sx={{ width: 110 }}
              {...register(`phones.${index}.guardian_relation`)}
              defaultValue={field.guardian_relation}
              aria-label={`صلة القرابة ${index + 1}`}
            >
              {RELATION_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              sx={{ width: 110 }}
              {...register(`phones.${index}.label`)}
              defaultValue={field.label}
              aria-label={`تسمية الرقم ${index + 1}`}
            >
              {PHONE_LABEL_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <IconButton
              onClick={() => onRemove(index)}
              disabled={fields.length === 1}
              sx={{
                color: "red.500",
                border: "1px solid",
                borderColor: "red.100",
                borderRadius: "8px",
                mt: 0.5,
                "&:hover": { bgcolor: "red.50" },
              }}
              aria-label={`حذف رقم الهاتف ${index + 1}`}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
