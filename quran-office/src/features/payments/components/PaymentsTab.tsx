import React from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  useTheme,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  LocalPrintshopRounded,
  InfoOutlined,
  PersonRounded,
  SearchRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";
import { usePayments } from "../hooks/usePayments";
import { DataTable, StatusChip, LoadingSkeleton } from "@/shared/components/ui";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { printPaymentReceipt } from "../utils/printUtils";

const PaymentsTab: React.FC = () => {
  const theme = useTheme();
  const { data: payments, isLoading } = usePayments();
  const [search, setSearch] = React.useState("");

  const filteredPayments = payments?.filter((p) =>
    p.student_name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      id: "student_name",
      label: "الطالب",
      render: (value: string) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: "surface.subtle",
              color: "text.secondary",
            }}
          >
            <PersonRounded sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="body2" fontWeight={700}>
            {value}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "amount",
      label: "المبلغ",
      render: (value: number) => (
        <Typography variant="body2" color="emerald.main" fontWeight={800}>
          {value.toLocaleString()} ج.م
        </Typography>
      ),
    },
    {
      id: "payment_date",
      label: "التاريخ",
      render: (value: string) => (
        <Stack direction="row" spacing={0.5} alignItems="center">
          <CalendarMonthRounded sx={{ fontSize: 14, color: "text.disabled" }} />
          <Typography variant="caption" color="text.secondary">
            {format(new Date(value), "dd MMMM yyyy", { locale: ar })}
          </Typography>
        </Stack>
      ),
    },
    {
      id: "method",
      label: "الوسيلة",
      render: (value: string) => <StatusChip label={value} color="stone" />,
    },
    {
      id: "receipt_number",
      label: "رقم الإيصال",
      render: (value: string) => (
        <Typography
          variant="caption"
          sx={{
            fontFamily: "monospace",
            bgcolor: "stone.50",
            px: 1,
            py: 0.5,
            borderRadius: "4px",
          }}
        >
          {value || "---"}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "الإجراءات",
      align: "center" as const,
      render: (_: any, row: any) => (
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="طباعة الإيصال">
            <IconButton size="small" onClick={() => printPaymentReceipt(row)}>
              <LocalPrintshopRounded fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="التفاصيل">
            <IconButton size="small">
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="البحث في السجلات..."
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <DataTable
        columns={columns}
        data={filteredPayments || []}
        emptyTitle="سجل المدفوعات فارغ"
        emptyDescription="لا توجد عمليات تحصيل مسجلة حالياً."
      />
    </Box>
  );
};

export default PaymentsTab;
