import React, { useEffect } from 'react';
import { Box, Container } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PaymentsList from '@/features/payments/components/PaymentsList';
import { usePaymentStore } from '@/features/payments/store/usePaymentStore';

const PaymentsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setActiveTab } = usePaymentStore();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'overdue') {
      setActiveTab(2);

    } else if (tab === 'history') {
      setActiveTab(1);
    } else if (tab === 'subscriptions') {
      setActiveTab(0);
    }
  }, [searchParams, setActiveTab]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <PaymentsList />
      </Box>
    </Container>
  );
};

export default PaymentsPage;

