import React from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { useOverdueStudents } from '../api/queries';

const OverdueReport: React.FC = () => {
  const { data: overdue, isLoading } = useOverdueStudents();

  if (isLoading) return <CircularProgress />;

  if (!overdue || overdue.length === 0) {
    return (
      <Alert severity="success" sx={{ borderRadius: 3 }}>
        لا يوجد متأخرات مالية حالياً. جميع الطلاب دفعوا اشتراكاتهم!
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" color="error" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        تقرير المتأخرات المالية ({overdue.length} طالب)
      </Typography>
      
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #fee2e2' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#fef2f2' }}>
            <TableRow>
              <TableCell>اسم الطالب</TableCell>
              <TableCell>تاريخ الانتهاء</TableCell>
              <TableCell>أيام التأخير</TableCell>
              <TableCell>المبلغ المتبقي</TableCell>
              <TableCell>الإجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {overdue.map((item) => (
              <TableRow key={item.subscription_id}>
                <TableCell fontWeight="bold">{item.full_name}</TableCell>
                <TableCell>{item.end_date}</TableCell>
                <TableCell>
                  <Chip label={`${item.days_overdue} يوم`} size="small" color="error" variant="outlined" />
                </TableCell>
                <TableCell color="error.main" fontWeight="bold">{item.remaining}</TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">بانتظار التحصيل</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OverdueReport;
