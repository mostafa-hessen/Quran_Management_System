import React from 'react';
import { Box, Container } from '@mui/material';
import PaymentsList from '@/features/payments/components/PaymentsList';

const PaymentsPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <PaymentsList />
      </Box>
    </Container>
  );
};

export default PaymentsPage;
