import React from "react";
import { 
  Autocomplete, 
  TextField, 
  styled, 
  Box, 
  Typography,
  createFilterOptions
} from "@mui/material";

interface Option {
  label: string;
  value: any;
}

interface SearchableSelectProps {
  label?: string;
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  loading?: boolean;
}

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => {
  const stone = (theme.palette as any).stone;
  const emerald = (theme.palette as any).emerald;

  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "11px",
      backgroundColor: stone[50],
      transition: "all 0.15s ease",
      fontFamily: '"Tajawal", sans-serif',
      fontSize: "13.5px",
      padding: "2px 13px",
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

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder,
  loading 
}) => {
  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {label && <Label>{label}</Label>}
      <StyledAutocomplete
        options={options}
        getOptionLabel={(option: any) => option.label}
        value={selectedOption}
        onChange={(_, newValue: any) => {
          onChange(newValue ? newValue.value : null);
        }}
        loading={loading}
        renderInput={(params) => (
          <TextField 
            {...params} 
            placeholder={placeholder}
            variant="outlined"
            fullWidth
          />
        )}
        noOptionsText="لا يوجد نتائج"
        loadingText="جاري التحميل..."
      />
    </Box>
  );
};
