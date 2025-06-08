// components/DashboardShimmer.jsx
import React from 'react';
import { Box, Skeleton, Card, Grid } from '@mui/material';

const DashboardShimmer = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 6 } }}>
      <Skeleton variant="text" width="60%" height={40} sx={{ mb: 4 }} />

      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="rectangular" height={50} sx={{ mt: 1 }} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Skeleton variant="text" width="50%" height={20} />
            <Skeleton variant="rectangular" height={50} sx={{ mt: 1 }} />
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 4, mb: 4 }}>
        <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Card>

      <Card sx={{ p: 4 }}>
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
        {[...Array(3)].map((_, idx) => (
          <Skeleton key={idx} variant="rectangular" width="100%" height={50} sx={{ mb: 1 }} />
        ))}
      </Card>
    </Box>
  );
};

export default DashboardShimmer;
