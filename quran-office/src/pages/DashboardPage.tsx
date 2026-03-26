import React from 'react';
import { Box, Card, Typography, LinearProgress, Chip } from '@mui/material';
import { 
  PeopleAltRounded, 
  MenuBookRounded, 
  HexagonRounded, 
  WarningRounded,
  CheckCircleRounded,
  NotificationsActiveRounded,
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', borderRadius: 4, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
    <Box sx={{ color }}>
      {icon}
    </Box>
    <Typography variant="h4" fontWeight="900" sx={{ color, mt: 1 }}>
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary" fontWeight="bold">
      {title}
    </Typography>
  </Card>
);

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 4 Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        <StatCard title="الطلاب" value="84" icon={<PeopleAltRounded fontSize="large" />} color="#047857" />
        <StatCard title="المعلمون" value="12" icon={<MenuBookRounded fontSize="large" />} color="#1d4ed8" />
        <StatCard title="الحلقات" value="7" icon={<HexagonRounded fontSize="large" />} color="#b45309" />
        <StatCard title="غير مدفوع" value="14" icon={<WarningRounded fontSize="large" />} color="#b91c1c" />
      </Box>

      {/* Main Details */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {/* Attendance */}
        <Card sx={{ p: 3, height: '100%', borderRadius: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" mb={2}>
            نسبة الحضور الكلية
          </Typography>
          <Typography variant="h3" fontWeight="900" color="#047857" mb={2}>
            88%
          </Typography>
          <LinearProgress variant="determinate" value={88} sx={{ height: 8, borderRadius: 4, bgcolor: '#ecfdf5', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            150 حاضر من 170
          </Typography>
        </Card>
        
        {/* Sessions */}
        <Card sx={{ p: 3, height: '100%', borderRadius: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" mb={2}>
            جلسات مجدولة
          </Typography>
          <Typography variant="h3" fontWeight="900" color="#1d4ed8" mb={2}>
            5
          </Typography>
          <Box mt={2}>
            <Chip label="عرض الجلسات" sx={{ bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 'bold', cursor: 'pointer' }} />
          </Box>
        </Card>
        
        {/* Homework */}
        <Card sx={{ p: 3, height: '100%', borderRadius: 4 }}>
          <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" mb={2}>
            واجبات تنتظر تصحيح
          </Typography>
          <Typography variant="h3" fontWeight="900" color="#b45309" mb={2}>
            23
          </Typography>
          <Box mt={2}>
            <Chip label="تصحيح الواجبات" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 'bold', cursor: 'pointer' }} />
          </Box>
        </Card>
      </Box>

      {/* Notifications Map */}
      <Card sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={2}>
          تنبيهات
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 3, gap: 2 }}>
            <WarningRounded color="error" />
            <Typography variant="body2" color="error.main" fontWeight="bold" flexGrow={1}>
              14 طلاب لم يدفعوا اشتراك هذا الشهر
            </Typography>
            <Chip label="عرض" size="small" sx={{ bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 'bold' }} clickable />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 3, gap: 2 }}>
            <NotificationsActiveRounded sx={{ color: '#d97706' }} />
            <Typography variant="body2" sx={{ color: '#b45309' }} fontWeight="bold" flexGrow={1}>
              23 واجب لم يُصحَّح بعد
            </Typography>
            <Chip label="تصحيح" size="small" sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 'bold' }} clickable />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f0fdf9', border: '1px solid #d1fae5', borderRadius: 3, gap: 2 }}>
            <CheckCircleRounded color="success" />
            <Typography variant="body2" color="success.main" fontWeight="bold" flexGrow={1}>
              النظام يعمل بشكل طبيعي
            </Typography>
          </Box>

        </Box>
      </Card>
    </Box>
  );
};

export default DashboardPage;
