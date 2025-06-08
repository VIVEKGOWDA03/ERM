// components/BoxShimmer.jsx
import React from 'react';
import { Card, Box, Skeleton } from '@mui/material';

const BoxShimmer = () => {
  return (
    <>
    <Card sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <Box>
        <Skeleton variant="text" width={120} height={25} />
        <Skeleton variant="text" width={80} height={35} />
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 5 }} />
      </Box>

            <Box>
        <Skeleton variant="text" width={120} height={25} />
        <Skeleton variant="text" width={80} height={35} />
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 5 }} />
      </Box>
            <Box>
        <Skeleton variant="text" width={120} height={25} />
        <Skeleton variant="text" width={80} height={35} />
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 5 }} />
      </Box>
    </Card>
        <Card sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
      <Box>
        <Skeleton variant="text" width={120} height={25} />
        <Skeleton variant="text" width={80} height={35} />
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 5 }} />
      </Box>

            <Box>
        <Skeleton variant="text" width={120} height={25} />
        <Skeleton variant="text" width={80} height={35} />
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 5 }} />
      </Box>
            <Box>
        <Skeleton variant="text" width={120} height={25} />
        <Skeleton variant="text" width={80} height={35} />
      </Box>
      <Box flex={1}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="rectangular" width="100%" height={10} sx={{ mt: 1, borderRadius: 5 }} />
      </Box>
    </Card>
    </>
  );
};

export default BoxShimmer;
