import React from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Button,
} from "@mui/material";
import {
  SearchRounded,
  FilterListRounded,
  AddCardRounded,
  LocalPrintshopRounded,
  HistoryRounded,
  EditRounded,
  PhoneRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";
import { useSubscriptions } from "../hooks/usePayments";
import { usePaymentStore } from "../store/usePaymentStore";
import { DataTable, StatusChip, LoadingSkeleton } from "@/shared/components/ui";
import type { Subscription } from "../types";
import { printSubscriptionInvoice } from "../utils/printUtils";
import { useAuthStore } from "@/features/auth/store";
import { Role } from "@/features/auth/types";
import SubscriptionHistoryModal from "./SubscriptionHistoryModal";
import EditSubscriptionModal from "./EditSubscriptionModal";

const SubscriptionsTab: React.FC = () => {
  const theme = useTheme();
  const { data: subscriptions, isLoading } = useSubscriptions();
  const { profile } = useAuthStore();
  const { 
    setAddPaymentModal, 
    setHistoryModal, 
    setEditSubscriptionModal,
    filters, 
    setFilters 
  } = usePaymentStore();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handlePhoneSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ phoneSearch: e.target.value });
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ status: e.target.value });
  };

  const filteredData = subscriptions?.filter((sub) => {
    // 1. Search by name
    const name = sub.student?.full_name || "";
    const matchesSearch = name
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    // 2. Search by phone
    const phones = sub.student?.phones || [];
    const matchesPhone = !filters.phoneSearch || 
      phones.some(p => p.includes(filters.phoneSearch));

    // 3. Status mapping
    const remaining = Number(sub.total_amount) - (sub.paid_amount || 0);
    let subStatus = "unpaid";
    if (sub.status === "exempt") subStatus = "exempt";
    else if (remaining <= 0) subStatus = "paid";
    else if ((sub.paid_amount || 0) > 0) subStatus = "partial";

    const matchesStatus =
      filters.status === "all" || filters.status === subStatus;

    // 4. Date filtering
    const matchesDate = (!filters.startDate || sub.start_date >= filters.startDate) &&
                        (!filters.endDate || sub.start_date <= filters.endDate);

    return matchesSearch && matchesStatus && matchesPhone && matchesDate;
  });

  const columns = [
    {
      id: "student",
      label: "الطالب",
      render: (_: any, row: Subscription) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {row.student?.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {row.student_id.split("-")[0]}
          </Typography>
        </Box>
      ),
    },
    {
      id: "type",
      label: "نوع الاشتراك",
      render: (value: string) => (
        <StatusChip label={value} color={value === "شهري" ? "sky" : "amber"} />
      ),
    },
    {
      id: "amount",
      label: "القيمة / المتبقي",
      render: (_: any, row: Subscription) => {
        const remaining = Number(row.total_amount) - (row.paid_amount || 0);
        return (
          <Box>
            <Typography variant="body2" fontWeight={800}>
              {row.total_amount} ج.م
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              color={remaining > 0 ? "error.main" : "emerald.main"}
            >
              المتبقي: {remaining} ج.م
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "status",
      label: "حالة السداد",
      render: (_: any, row: Subscription) => {
        const remaining = Number(row.total_amount) - (row.paid_amount || 0);
        if (row.status === "exempt")
          return <StatusChip label="معفي" color="stone" />;
        if (remaining <= 0) return <StatusChip label="مدفوع" color="emerald" />;
        if ((row.paid_amount || 0) > 0)
          return <StatusChip label="جزئي" color="amber" />;
        return <StatusChip label="غير مدفوع" color="error" />;
      },
    },
    {
      id: "dates",
      label: "الفترة",
      render: (_: any, row: Subscription) => (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          من: {row.start_date}
          <br />
          إلى: {row.end_date}
        </Typography>
      ),
    },
    {
      id: "actions",
      label: "الإجراءات",
      align: "center" as const,
      render: (_: any, row: Subscription) => {
        const remaining = Number(row.total_amount) - (row.paid_amount || 0);
        return (
          <Stack direction="row" spacing={0.5} justifyContent="center">
            <Tooltip title="تسجيل دفعة">
              <IconButton
                size="small"
                disabled={remaining <= 0 || row.status === "exempt"}
                onClick={() => setAddPaymentModal(true, row)}
                sx={{
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                  },
                }}
              >
                <AddCardRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="طباعة">
              <IconButton
                size="small"
                onClick={() => printSubscriptionInvoice(row)}
                sx={{ color: "stone.500" }}
              >
                <LocalPrintshopRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="السجل">
              <IconButton 
                size="small" 
                onClick={() => setHistoryModal(true, row)}
                sx={{ color: "stone.500" }}
              >
                <HistoryRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {/* Edit button: Admin only + no payments */}
            {profile?.role === Role.ADMIN && (row.paid_amount || 0) === 0 && (
              <Tooltip title="تعديل">
                <IconButton 
                  size="small" 
                  onClick={() => setEditSubscriptionModal(true, row)}
                  sx={{ color: "amber.600" }}
                >
                  <EditRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  if (isLoading) return <LoadingSkeleton type="table" />;

  return (
    <Box>
      {/* Filter Bar */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{
            p: 2,
            bgcolor: "surface.paper",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            placeholder="البحث باسم الطالب..."
            size="small"
            value={filters.search}
            onChange={handleSearch}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="رقم الهاتف..."
            size="small"
            value={filters.phoneSearch}
            onChange={handlePhoneSearch}
            sx={{ width: { md: 200 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneRounded sx={{ color: "text.secondary", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            size="small"
            label="حالة السداد"
            value={filters.status}
            onChange={handleStatusFilter}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="all">كل الحالات</MenuItem>
            <MenuItem value="paid">مدفوع بالكامل</MenuItem>
            <MenuItem value="partial">سداد جزئي</MenuItem>
            <MenuItem value="unpaid">لم يتم السداد</MenuItem>
            <MenuItem value="exempt">معفي</MenuItem>
          </TextField>
        </Stack>

        {/* Date Range Filters */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: alpha(theme.palette.stone[100], 0.4),
            borderRadius: "12px",
            border: "1px dashed",
            borderColor: "stone.200",
          }}
        >
          <CalendarMonthRounded sx={{ color: "stone.400", fontSize: 20 }} />
          <Typography variant="caption" fontWeight={700} color="stone.600">من تاريخ:</Typography>
          <TextField
            type="date"
            size="small"
            value={filters.startDate || ''}
            onChange={(e) => setFilters({ startDate: e.target.value || null })}
            sx={{ bgcolor: 'white', borderRadius: '8px' }}
          />
          <Typography variant="caption" fontWeight={700} color="stone.600">إلى تاريخ:</Typography>
          <TextField
            type="date"
            size="small"
            value={filters.endDate || ''}
            onChange={(e) => setFilters({ endDate: e.target.value || null })}
            sx={{ bgcolor: 'white', borderRadius: '8px' }}
          />
          <Button 
            size="small" 
            color="inherit" 
            onClick={() => setFilters({ startDate: null, endDate: null, phoneSearch: '', search: '', status: 'all' })}
            sx={{ ml: 'auto', color: 'stone.500' }}
          >
            إعادة تعيين
          </Button>
        </Stack>
      </Stack>

      <DataTable
        columns={columns}
        data={filteredData || []}
        emptyTitle="لا توجد اشتراكات"
        emptyDescription="لم يتم العثور على اشتراكات مطابقة لمعايير البحث."
      />

      <SubscriptionHistoryModal />
      <EditSubscriptionModal />
    </Box>
  );
};

export default SubscriptionsTab;
