import React from 'react';
import { 
  List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  Typography, Card, CardHeader, Box, alpha, useTheme
} from '@mui/material';
import { Timer, Person } from '@mui/icons-material';
import { useExpiringSubscriptions } from '../hooks/useReports';
import { StatusChip, LoadingSkeleton } from '@/shared/components/ui';

export const ExpiringSubsList: React.FC = () => {
  const { data: expiring, isLoading } = useExpiringSubscriptions();
  const theme = useTheme();

  if (isLoading) return <LoadingSkeleton type="cards" />;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader 
        title="اشتراكات تنتهي قريباً" 
        subheader="خلال 7 أيام القادمة"
        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <List sx={{ flexGrow: 1, overflow: 'auto', maxHeight: 400 }}>
        {expiring?.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              لا توجد اشتراكات شارفت على الانتهاء
            </Typography>
          </Box>
        ) : (
          expiring?.map((sub) => (
            <ListItem key={sub.subscription_id} divider sx={{ '&:last-child': { borderBottom: 'none' } }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'surface.subtle', color: 'secondary.main' }}>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {sub.student_name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    تنتهي في {sub.end_date}
                  </Typography>
                }
              />
              <StatusChip 
                label={`${sub.days_left} يوم`} 
                type="warning"
                icon={<Timer sx={{ fontSize: '14px !important' }} />}
              />
            </ListItem>
          ))
        )}
      </List>
    </Card>
  );
};
