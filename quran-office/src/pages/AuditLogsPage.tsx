import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Stack
} from "@mui/material";
import { Button } from "@/shared/components/ui";
import { 
  Close as CloseIcon, 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/shared/api/auditLogsApi";
import { Card } from "@/shared/components/ui";

const AuditLogsPage: React.FC = () => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["audit_logs"],
    queryFn: getAuditLogs,
  });

  const [selectedLog, setSelectedLog] = useState<any>(null);

  const getActionStyles = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("INSERT")) {
      return { 
        bg: "#ecfdf5",
        color: "#059669",
        label: "إضافة",
        icon: <AddIcon sx={{ fontSize: 14 }} />
      };
    }
    if (act.includes("UPDATE")) {
      return { 
        bg: "#eff6ff",
        color: "#2563eb",
        label: "تعديل",
        icon: <EditIcon sx={{ fontSize: 14 }} />
      };
    }
    if (act.includes("DELETE")) {
      return { 
        bg: "#fff1f2",
        color: "#e11d48",
        label: "حذف",
        icon: <DeleteIcon sx={{ fontSize: 14 }} />
      };
    }
    return { 
      bg: "#f5f5f4",
      color: "#57534e",
      label: action,
      icon: null
    };
  };

  const getTableLabel = (tableName: string) => {
    switch (tableName) {
      case "students": return "الطلاب";
      case "teachers": return "المعلمون";
      case "profiles": return "الحسابات";
      case "halaqat": return "الحلقات";
      case "enrollments": return "التسجيلات";
      case "schedules": return "المواعيد";
      case "subscriptions": return "الاشتراكات";
      case "payments": return "المدفوعات";
      case "report_cards": return "التقارير";
      case "student_guardian_phones": return "هواتف أولياء الأمور";
      case "teacher_phones": return "هواتف المعلمين";
      case "teacher_emails": return "إيميلات المعلمين";
      case "teacher_specializations": return "تخصصات المعلمين";
      case "sessions": return "الحلقات (جلسات)";
      case "homework": return "الواجبات";
      default: return tableName;
    }
  };

  const fieldTranslations: Record<string, string> = {
    teacher_id: "المعلم المسئول",
    student_id: "الطالب",
    halaqa_id: "الحلقة",
    day_of_week: "اليوم",
    start_time: "وقت البدء",
    end_time: "وقت الانتهاء",
    total_amount: "المبلغ",
    type: "نوع الاشتراك",
    status: "الحالة",
    name: "الاسم",
    phone: "رقم الهاتف",
    father_name: "اسم الأب",
    family_name: "اسم العائلة",
    first_name: "الاسم الأول",
    gender: "الجنس",
    birth_date: "تاريخ الميلاد",
    start_date: "تاريخ البدء",
    end_date: "تاريخ الانتهاء",
    amount: "المبلغ",
    payment_method: "طريقة الدفع",
    method: "طريقة الدفع",
    payment_date: "تاريخ الدفع",
    receipt_number: "رقم الإيصال",
    notes: "ملاحظات",
    grade: "الدرجة",
    subject: "المادة",
    evaluation: "التقييم",
    full_name: "الاسم الكامل",
    join_date: "تاريخ الانضمام",
    subscription_status: "حالة الاشتراك",
    guardian_relation: "صلة القرابة",
    label: "التصنيف",
    address: "العنوان",
    capacity: "السعة",
    location: "الموقع",
    description: "الوصف",
    surah: "السورة",
    ayah: "الآية",
    pages_count: "عدد الصفحات",
    quality: "الجودة",
    day_of_week: "اليوم",
    start_time: "وقت البدء",
    end_time: "وقت الانتهاء",
  };

  const valueTranslations: Record<string, string> = {
    INSERT: "إضافة جديد",
    UPDATE: "تعديل بيانات",
    DELETE: "حذف",
    cash: "نقدي",
    transfer: "تحويل",
    active: "نشط",
    inactive: "غير نشط",
    suspended: "موقوف",
    'أب': "أب",
    'أم': "أم",
    'جد': "جد",
    'جدة': "جدة",
    'أخ': "أخ",
    'أخت': "أخت",
    'ولي أمر': "ولي أمر",
    'آخر': "آخر",
    'شخصي': "شخصي",
    'عمل': "عمل",
    'واتساب': "واتساب",
    'منزل': "منزل",
    'أساسي': "أساسي",
    'أخرى': "أخرى",
    'ذكر': "ذكر",
    'أنثى': "أنثى",
    'شهري': "شهري",
    'سنوي': "سنوي",
  };

  const renderDiff = (log: any) => {
    const oldData = log.old_data || log.changes?.previous_data;
    const newData = log.new_data || log.changes?.new_data;
    const action = (log.action_type || log.action).toUpperCase();

    const translateKey = (key: string) => fieldTranslations[key] || key;
    
    const formatValue = (key: string, val: any) => {
      if (val === null || val === undefined) return "فارغ";
      
      // Automatic date detection and formatting
      if (typeof val === 'string' && (key.includes('date') || key.includes('_at') || val.match(/^\d{4}-\d{2}-\d{2}T/))) {
        try {
          const d = new Date(val);
          if (!isNaN(d.getTime())) {
            return new Intl.DateTimeFormat('ar-EG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'Africa/Cairo'
            }).format(d);
          }
        } catch (e) {
          // Fallback to original
        }
      }

      return valueTranslations[String(val)] || String(val);
    };

    const summary = log.summary;

    if (action.includes("DELETE")) {
      return (
        <Box sx={{ p: 2, bgcolor: '#fff1f2', borderRadius: 3, border: '1px solid', borderColor: '#ffe4e6' }}>
          <Typography variant="subtitle2" color="#e11d48" fontWeight="800" gutterBottom sx={{ lineHeight: 1.6 }}>
            {summary || "تم حذف السجل"}
          </Typography>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed', borderColor: '#fecdd3' }}>
            {Object.entries(oldData || {}).map(([key, value]) => {
              if (key.includes('_id') || ['id', 'created_at', 'updated_at'].includes(key)) return null;
              if (value === null || value === undefined) return null;
              return (
                <Typography key={key} variant="caption" sx={{ display: 'block', color: '#4c0519', mb: 0.5, fontWeight: 500 }}>
                  • <strong>{translateKey(key)}:</strong> {formatValue(key, value)}
                </Typography>
              );
            })}
          </Box>
        </Box>
      );
    }

    if (action.includes("INSERT") || action.includes("CREATE")) {
      return (
        <Box sx={{ p: 2.5, bgcolor: '#ecfdf5', borderRadius: 3, border: '1px solid', borderColor: '#d1fae5' }}>
          <Typography variant="subtitle2" color="#059669" fontWeight="800" gutterBottom sx={{ lineHeight: 1.6 }}>
            {summary || "إضافة سجل جديد:"}
          </Typography>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: '#a7f3d0' }}>
            {Object.entries(newData || {}).map(([key, value]) => {
              if (key.includes('_id') || ['id', 'created_at', 'updated_at'].includes(key)) return null;
              if (value === null || value === undefined) return null;
              return (
                <Typography key={key} variant="body2" sx={{ color: 'stone.700', mb: 0.8 }}>
                  <strong>{translateKey(key)}:</strong> {formatValue(key, value)}
                </Typography>
              );
            })}
          </Box>
        </Box>
      );
    }

    // Update case - show diff
    const changes: any[] = [];
    if (oldData && newData) {
      const allKeys = new Set([...Object.keys(oldData), ...Object.keys(newData)]);
      allKeys.forEach(key => {
        if (key.includes('_id') || ['updated_at', 'created_at'].includes(key)) return;
        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
          changes.push({ key, old: oldData[key], new: newData[key] });
        }
      });
    }

    return (
      <Stack spacing={2}>
        <Box sx={{ p: 2.5, bgcolor: '#eff6ff', borderRadius: 3, border: '1px solid', borderColor: '#dbeafe' }}>
          <Typography variant="subtitle1" color="#1e40af" fontWeight={800} sx={{ textAlign: 'center', lineHeight: 1.6 }}>
            {summary || "تم تعديل البيانات"}
          </Typography>
        </Box>

        {changes.length > 0 ? (
          <>
            <Typography variant="subtitle2" color="stone.500" fontWeight="800" sx={{ px: 0.5 }}>التغييرات المكتشفة:</Typography>
            {changes.map((change, idx) => (
              <Box key={idx} sx={{ p: 2, bgcolor: '#fafaf9', borderRadius: 3, border: '1px solid', borderColor: '#e7e5e4', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: '#2563eb' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'stone.500', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {translateKey(change.key)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: '120px', p: 1.5, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid', borderColor: '#fee2e2' }}>
                    <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700, display: 'block', mb: 0.5 }}>القيمة السابقة</Typography>
                    <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 500, fontFamily: 'monospace' }}>
                      {formatValue(change.key, change.old)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'stone.300', transform: 'rotate(180deg)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: '120px', p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid', borderColor: '#dcfce7' }}>
                    <Typography variant="caption" sx={{ color: '#166534', fontWeight: 700, display: 'block', mb: 0.5 }}>القيمة الجديدة</Typography>
                    <Typography variant="body2" sx={{ color: '#16a34a', fontWeight: 800, fontFamily: 'monospace' }}>
                      {formatValue(change.key, change.new)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </>
        ) : (
          <Typography variant="body2" color="stone.500" sx={{ textAlign: 'center', py: 1 }}>
            تم تعديل حقول تقنية فقط.
          </Typography>
        )}
      </Stack>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>جاري تحميل السجلات...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "stone.800", fontFamily: "Tajawal" }}>
            سجل العمليات
          </Typography>
          <Typography variant="body1" sx={{ color: "stone.500", mt: 1 }}>
            مراقبة وتتبع جميع التغييرات في النظام بدقة
          </Typography>
        </Box>
        <Chip label={`${logs?.length || 0} عملية`} variant="outlined" sx={{ fontWeight: 700, borderRadius: '8px' }} />
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>التاريخ والوقت</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>المستخدم</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>العملية</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>القسم المتأثر</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#64748b", textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', textAlign: 'center' }}>التفاصيل</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Typography color="stone.400">لا توجد سجلات حالياً</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs?.map((log: any) => {
                  const styles = getActionStyles(log.action_type || log.action);
                  return (
                    <TableRow key={log.log_id || log.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ color: 'stone.600', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {new Date(log.created_at).toLocaleString("ar-SA", {
                          dateStyle: 'short',
                          timeStyle: 'short'
                        })}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>{log.user_name}</Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: '300px' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Chip 
                            label={styles.label}
                            icon={styles.icon as any}
                            size="small"
                            sx={{
                              bgcolor: styles.bg,
                              color: styles.color,
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              height: 24,
                              px: 0.5,
                              borderRadius: '6px',
                              border: '1px solid',
                              borderColor: 'rgba(0,0,0,0.05)',
                              '& .MuiChip-icon': {
                                color: 'inherit',
                                marginLeft: '4px',
                                marginRight: '-4px'
                              }
                            }}
                          />
                          <Typography variant="body2" fontWeight={600} color="stone.700" sx={{ letterSpacing: '-0.01em' }}>
                            {log.summary || "تعديل غير محدد"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getTableLabel(log.table_name)}
                          size="small"
                          sx={{
                            bgcolor: `#f5f5f4`,
                            color: `stone.600`,
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e7e5e4',
                            px: 0.5
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          colorType="ghost"
                          onClick={() => setSelectedLog(log)}
                          sx={{ fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          عرض
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog 
        open={!!selectedLog} 
        onClose={() => setSelectedLog(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '20px', p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'stone.800' }}>تفاصيل العملية</Typography>
            <Typography variant="caption" color="stone.500">
              قسم {getTableLabel(selectedLog?.table_name)} • {new Date(selectedLog?.created_at).toLocaleString("ar-SA")}
            </Typography>
          </Box>
          <IconButton onClick={() => setSelectedLog(null)} sx={{ bgcolor: 'stone.50' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {selectedLog && renderDiff(selectedLog)}
        </DialogContent>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button fullWidth colorType="primary" onClick={() => setSelectedLog(null)}>إغلاق</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AuditLogsPage;
