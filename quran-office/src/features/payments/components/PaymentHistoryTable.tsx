import React from 'react';
import { 
  Typography, Box, IconButton, Tooltip, Stack, alpha, useTheme, Avatar
} from '@mui/material';
import { usePayments } from '../hooks/usePayments';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ReceiptLongRounded, InfoOutlined, LocalPrintshopRounded, PersonRounded } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { DataTable, StatusChip, LoadingSkeleton } from '@/shared/components/ui';

export const PaymentHistoryTable: React.FC = () => {
  const { data: payments, isLoading } = usePayments();
  const theme = useTheme();

  const handlePrint = (payment: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const content = `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 40px; border: 2px solid #10b981; border-radius: 15px; max-width: 600px; margin: auto;">
        <h2 style="text-align: center; color: #10b981; margin-bottom: 30px;">إيصال استلام نقدية</h2>
        <div style="margin-bottom: 15px;"><strong>اسم الطالب:</strong> ${payment.student_name}</div>
        <div style="margin-bottom: 15px;"><strong>المبلغ المسدد:</strong> <span style="font-size: 1.2em; color: #10b981;">${payment.amount} ج.م</span></div>
        <div style="margin-bottom: 15px;"><strong>تاريخ الدفع:</strong> ${format(new Date(payment.payment_date), 'dd MMMM yyyy', { locale: ar })}</div>
        <div style="margin-bottom: 15px;"><strong>وسيلة الدفع:</strong> ${payment.method}</div>
        ${payment.receipt_number ? `<div style="margin-bottom: 15px;"><strong>رقم الإيصال:</strong> ${payment.receipt_number}</div>` : ''}
        ${payment.notes ? `<div style="margin-bottom: 15px;"><strong>ملاحظات:</strong> ${payment.notes}</div>` : ''}
        <div style="margin-top: 60px; display: flex; justify-content: space-between;">
          <span>توقيع المحصل: ...................</span>
          <span>ختم الإدارة: ...................</span>
        </div>
      </div>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  const handleViewDetails = (payment: any) => {
    toast(`تفاصيل الدفعة: ${payment.student_name} - ${payment.amount} ج.م`, {
      icon: 'ℹ️',
      style: { borderRadius: '12px', background: '#333', color: '#fff' }
    });
  };

  if (isLoading) return <LoadingSkeleton type="table" />;

  const columns = [
    {
      id: 'student_name',
      label: 'الطالب',
      render: (value: string) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'surface.subtle', color: 'text.secondary' }}>
            <PersonRounded sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Stack>
      )
    },
    {
      id: 'amount',
      label: 'المبلغ',
      render: (value: number) => (
        <Typography variant="body2" color="success.main" sx={{ fontWeight: 800 }}>
          {value.toLocaleString()} ج.م
        </Typography>
      )
    },
    {
      id: 'payment_date',
      label: 'التاريخ',
      render: (value: string) => (
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {format(new Date(value), 'dd MMMM yyyy', { locale: ar })}
        </Typography>
      )
    },
    {
      id: 'method',
      label: 'وسيلة الدفع',
      render: (value: string) => (
        <StatusChip label={value} type="neutral" />
      )
    },
    {
      id: 'receipt_number',
      label: 'رقم الإيصال',
      render: (value: string) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
          {value || '---'}
        </Typography>
      )
    },
    {
      id: 'actions',
      label: 'إجراءات',
      align: 'center' as const,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="طباعة الإيصال">
            <IconButton 
              size="small" 
              onClick={() => handlePrint(row)}
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) } }}
            >
              <LocalPrintshopRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="التفاصيل">
            <IconButton 
              size="small" 
              onClick={() => handleViewDetails(row)}
              sx={{ color: 'text.secondary', '&:hover': { color: 'info.main', bgcolor: alpha(theme.palette.info.main, 0.1) } }}
            >
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )
    }
  ];

  return (
    <DataTable 
      columns={columns} 
      data={payments || []} 
    />
  );
};
