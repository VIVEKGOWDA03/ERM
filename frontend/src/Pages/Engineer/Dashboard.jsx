import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyAssignments } from '../../store/Slice/AssignmentSlice';
import { fetchEngineerById } from '../../store/Slice/index';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Card, Box, Typography, LinearProgress, Chip,
  useMediaQuery
} from '@mui/material';
import toast from 'react-hot-toast';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import Shimmer from '../../Compontes/Shimmer';
import DashboardShimmer from '../../Compontes/DashboardShimmer';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EngineerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const isMobile = useMediaQuery('(max-width:600px)');

  const { user: currentUser } = useSelector((state) => state.auth);
  const { myAssignments, isLoading: assignmentsLoading, error: assignmentsError } = useSelector((state) => state.assignments);
  const { selectedEngineer, isLoading: engineerLoading, error: engineerError } = useSelector((state) => state.data);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'engineer') {
      toast.error("Access Denied. Only engineers can view this dashboard.");
      navigate('/auth/login', { replace: true }); 
      return;
    }
    if (currentUser.id) {
      dispatch(fetchMyAssignments()); 
      dispatch(fetchEngineerById(currentUser.id)); 
    }
  }, [dispatch, currentUser, navigate]);

  const isLoading = assignmentsLoading || engineerLoading;
  const error = assignmentsError || engineerError;

  if (!currentUser || currentUser.role !== 'engineer') return null; 
  if (isLoading) return  <DashboardShimmer/>;
  if (error) return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Error: {error}</Box>;
  if (!selectedEngineer) return <Box sx={{ p: 4, textAlign: 'center' }}>Engineer profile not loaded.</Box>;

  const allocated = myAssignments
    .filter(assignment => new Date(assignment.endDate) >= new Date() && new Date(assignment.startDate) <= new Date())
    .reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);

  const availableCapacity = selectedEngineer.maxCapacity - allocated;
  const currentAllocationPercentage = Math.min(100, (allocated / selectedEngineer.maxCapacity) * 100);

  const getCapacityColor = (percentage) => {
    if (percentage > 90) return 'error.main'; 
    if (percentage > 70) return 'warning.main'; 
    return 'success.main'; 
  };

  const chartData = {
    labels: myAssignments.map((a) => a.projectId?.name || 'N/A'),
    datasets: [
      {
        label: 'Allocation %',
        data: myAssignments.map((a) => a.allocationPercentage),
        backgroundColor: '#1976d2',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        👨‍💻 Engineer Dashboard - {selectedEngineer.name}
      </Typography>

      <Card sx={{ p: 3, mb: 4, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 3 }}>
        <Box>
          <Typography variant="h6">Current Allocation</Typography>
          <Typography variant="h3" color="primary">{currentAllocationPercentage.toFixed(0)}%</Typography>
        </Box>
        <Box flex={1}>
          <Typography variant="body2">
            Available Capacity:
            <Box component="span" ml={1} sx={{ color: availableCapacity < 0 ? 'error.dark' : availableCapacity < 30 ? 'warning.dark' : 'success.dark' }}>
              {availableCapacity.toFixed(0)}%
            </Box>
          </Typography>
          <LinearProgress value={currentAllocationPercentage} variant="determinate" sx={{ mt: 1, height: 8, borderRadius: 5, bgcolor: 'grey.300', '& .MuiLinearProgress-bar': { bgcolor: getCapacityColor(currentAllocationPercentage) } }} />
        </Box>
      </Card>

      <Card sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>📊 My Allocation Overview</Typography>
        <Bar data={chartData} options={chartOptions} />
      </Card>

      <Card sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>🗂️ My Projects</Typography>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell>Project Name</TableCell>
              {/* <TableCell>Description</TableCell> */}
              <TableCell>My Role</TableCell>
              <TableCell>Allocation (%)</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myAssignments.length > 0 ? (
              myAssignments.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.projectId?.name || 'N/A'}</TableCell>
                  {/* <TableCell>{a.projectId?.description || 'N/A'}</TableCell> */}
                  <TableCell><Chip label={a.role} size="small" color="" /></TableCell>
                  <TableCell>{a.allocationPercentage}%</TableCell>
                  <TableCell>{new Date(a.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(a.endDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">No assignments found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default EngineerDashboard;
