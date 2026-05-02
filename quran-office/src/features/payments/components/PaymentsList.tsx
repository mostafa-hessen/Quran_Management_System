import React from "react";
import { Tabs, Tab, Box, Button, Stack, useTheme } from "@mui/material";
import {
  AddRounded,
  ReceiptLongRounded,
  HistoryRounded,
  AssessmentRounded,
} from "@mui/icons-material";
import { PageContainer, PageHeader } from "@/shared/components/ui";
import { usePaymentStore } from "../store/usePaymentStore";

// Tabs
import SubscriptionsTab from "./SubscriptionsTab";
import PaymentsTab from "./PaymentsTab";
import ReportsTab from "./ReportsTab";

// Modals/Drawers
import SubscriptionForm from "./SubscriptionForm";
import AddPaymentDrawer from "./AddPaymentDrawer";

const PaymentsList: React.FC = () => {
  const theme = useTheme();
  const { activeTab, setActiveTab, setSubscriptionForm } = usePaymentStore();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const actions = (
    <Button
      variant="contained"
      startIcon={<AddRounded />}
      onClick={() => setSubscriptionForm(true)}
      sx={{ borderRadius: "12px", px: 3 }}
    >
      إنشاء اشتراك
    </Button>
  );

  return (
    <PageContainer maxWidth="xl">
      <PageHeader
        title="المالية والاشتراكات"
        subtitle="إدارة الحسابات المالية، تتبع الاشتراكات، وتحصيل المدفوعات"
        actions={actions}
      />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.95rem",
              minHeight: 48,
              transition: "all 0.2s",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
          }}
        >
          <Tab
            icon={<ReceiptLongRounded sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="الاشتراكات"
          />
          <Tab
            icon={<HistoryRounded sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="سجل المدفوعات"
          />
          <Tab
            icon={<AssessmentRounded sx={{ fontSize: 20 }} />}
            iconPosition="start"
            label="التقارير المالية"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {activeTab === 0 && <SubscriptionsTab />}
      {activeTab === 1 && <PaymentsTab />}
      {activeTab === 2 && <ReportsTab />}

      {/* Global Modals */}
      <SubscriptionForm />
      <AddPaymentDrawer />
    </PageContainer>
  );
};

export default PaymentsList;
