import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { useTeacherPerformance, useHalaqatStatus } from '../api/queries';

export const TeacherPerformanceCard: React.FC = () => {
  const { data: teachers, isLoading } = useTeacherPerformance();

  if (isLoading) return <CircularProgress />;

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>أداء وسجل المعلم</Typography>
      <List>
        {teachers?.map((t: any, idx: number) => (
          <React.Fragment key={t.teacher_id}>
            <ListItem alignItems="flex-start" sx={{ px: 0 }}>
              <ListItemText
                primary={`${t.first_name} ${t.family_name}`}
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" component="block">
                      الحلقات المسندة: {t.halaqat?.map((h: any) => h.name).join('، ') || 'لا يوجد'}
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight="bold">
                      إجمالي الطلاب: {t.halaqat?.reduce((sum: number, h: any) => sum + (h.students?.length || 0), 0) || 0}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {idx < (teachers.length - 1) && <Divider variant="inset" component="li" sx={{ ml: 0 }} />}
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export const HalaqatStatusCard: React.FC = () => {
  const { data: halaqat, isLoading } = useHalaqatStatus();

  if (isLoading) return <CircularProgress />;

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>حالة الحلقات</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {halaqat?.map((h: any) => (
          <Box key={h.halaqa_id} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">{h.name}</Typography>
              <Chip label={h.level} size="small" variant="outlined" />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">الإشغال:</Typography>
              <Typography variant="body2">{h.enrollments?.[0]?.count || 0} / {h.capacity}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};
