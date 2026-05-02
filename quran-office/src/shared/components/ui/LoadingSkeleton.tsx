import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent, Stack } from '@mui/material';

interface LoadingSkeletonProps {
  type?: 'table' | 'cards' | 'stats' | 'form';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type = 'table' }) => {
  if (type === 'stats') {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="rectangular" height={40} sx={{ my: 1, borderRadius: 1 }} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (type === 'cards') {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Card>
              <Skeleton variant="rectangular" height={140} />
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="60%" />
                <Stack direction="row" spacing={1} mt={2}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Skeleton variant="circular" width={32} height={32} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>
    </Box>
  );
};
