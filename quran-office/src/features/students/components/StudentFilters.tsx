import React from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  IconButton, 
  Tooltip, 
  Grid, 
  Paper,
  InputAdornment,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import PhoneIcon from '@mui/icons-material/Phone';
import { StudentStatus, GENDER_OPTIONS } from '../types';
import type { StudentFilterState } from '../types';

interface StudentFiltersProps {
  filters: StudentFilterState;
  onFilterChange: (key: keyof StudentFilterState, value: any) => void;
  onReset: () => void;
  halaqat?: { id: string, name: string }[];
  teachers?: { id: string, name: string }[];
}

const StudentFiltersBar: React.FC<StudentFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onReset,
  halaqat = [],
  teachers = []
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 3, 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Name Search */}
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="البحث بالاسم..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Phone Search */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="رقم الهاتف..."
            value={filters.phoneTerm}
            onChange={(e) => onFilterChange('phoneTerm', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Status Select */}
        <Grid item xs={6} sm={4} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="الحالة"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">الكل</MenuItem>
            <MenuItem value={StudentStatus.ACTIVE}>نشط</MenuItem>
            <MenuItem value={StudentStatus.INACTIVE}>غير نشط</MenuItem>
            <MenuItem value={StudentStatus.SUSPENDED}>موقوف</MenuItem>
          </TextField>
        </Grid>

        {/* Gender Select */}
        <Grid item xs={6} sm={4} md={1.5}>
          <TextField
            select
            fullWidth
            size="small"
            label="الجنس"
            value={filters.gender}
            onChange={(e) => onFilterChange('gender', e.target.value)}
          >
            <MenuItem value="all">الكل</MenuItem>
            {GENDER_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Halaqa Select */}
        <Grid item xs={12} sm={4} md={2}>
          <TextField
            select
            fullWidth
            size="small"
            label="الحلقة"
            value={filters.halaqaId}
            onChange={(e) => onFilterChange('halaqaId', e.target.value)}
          >
            <MenuItem value="all">كل الحلقات</MenuItem>
            {halaqat.map(h => (
              <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<RestartAltIcon />}
            onClick={onReset}
            size="medium"
            fullWidth
          >
            إعادة ضبط
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StudentFiltersBar;
