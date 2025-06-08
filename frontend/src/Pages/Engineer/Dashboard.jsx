import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for potential redirection if not authenticated

// Import thunks from their respective slices
// NEW: Import assignment thunks from AssignmentSlice
import { fetchMyAssignments } from '../../store/Slice/AssignmentSlice';
// Existing: Import general user/engineer thunks from data slice (for selectedEngineer)
import { fetchEngineerById } from '../../store/Slice/index'; // Import to fetch engineer details

import {
  Table,
  TableBody,
  TableCell,
  TableHead, // Used as TableHeader in previous version, check your MUI setup
  TableRow,
  Card, // Used as Card in previous version, check your MUI setup
  Box,
  Typography,
  LinearProgress, // Replaced ShadCN Progress
  Chip // Replaced ShadCN Badge
} from '@mui/material';
import toast from 'react-hot-toast';


const EngineerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added for navigation
  
  // CORRECTED: Select data from the correct Redux slices
  const { user: currentUser } = useSelector((state) => state.auth);
  // Get assignments and their loading/error from the assignments slice
  const { myAssignments, isLoading: assignmentsLoading, error: assignmentsError } = useSelector((state) => state.assignments);
  // Get selectedEngineer and its loading/error from the data slice
  const { selectedEngineer, isLoading: engineerLoading, error: engineerError } = useSelector((state) => state.data);

  useEffect(() => {
    // Redirect if not authenticated or not an engineer
    if (!currentUser || currentUser.role !== 'engineer') {
      toast.error("Access Denied. Only engineers can view this dashboard.");
      navigate('/auth/login', { replace: true }); // Redirect to login if not authorized
      return;
    }

    // Dispatch actions to fetch user-specific data
    if (currentUser.id) {
      dispatch(fetchMyAssignments()); // fetchMyAssignments now gets user ID from getState().auth.user.id internally
      dispatch(fetchEngineerById(currentUser.id)); // Fetch detailed engineer profile
    }
  }, [dispatch, currentUser, navigate]);

  // Combine loading and error states for a comprehensive check
  const isLoading = assignmentsLoading || engineerLoading;
  const error = assignmentsError || engineerError;

  // Render access denied early if user is not an engineer
  if (!currentUser || currentUser.role !== 'engineer') {
    return null; // The useEffect handles navigation. Return null to prevent rendering.
  }

  if (isLoading) {
    return <Box sx={{ p: 4, textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>Loading your dashboard data...</Box>;
  }

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Error: {error}</Box>;
  }

  // Ensure selectedEngineer is available before calculating capacity
  if (!selectedEngineer) {
      return <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>Engineer profile not loaded.</Box>;
  }

  // Calculate current allocated capacity for the logged-in engineer
  const allocated = myAssignments
    .filter(assignment => 
      // Filter for current and upcoming assignments (assuming current date is within start and end)
      // Check current date to decide if assignment is active.
      // (startDate <= now && endDate >= now)
      new Date(assignment.endDate) >= new Date() &&
      new Date(assignment.startDate) <= new Date()
    )
    .reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);

  const availableCapacity = selectedEngineer.maxCapacity - allocated;
  // Cap currentAllocationPercentage at 100 for display if somehow allocated exceeds maxCapacity (e.g. from seeding)
  const currentAllocationPercentage = Math.min(100, (allocated / selectedEngineer.maxCapacity) * 100);

  // Function to get color for capacity bar
  const getCapacityColor = (percentage) => {
    if (percentage > 90) return 'error.main'; // Overloaded
    if (percentage > 70) return 'warning.main'; // Nearing capacity
    return 'success.main'; // Good capacity
  };

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
        My Dashboard - {selectedEngineer.name}
      </Typography>

      {/* My Capacity Summary */}
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>My Current Allocation</Typography>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{currentAllocationPercentage.toFixed(0)}%</Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Available Capacity: 
            <Box component="span" sx={{ 
              ml: 1, 
              fontWeight: 'semibold', 
              color: availableCapacity < 0 ? 'error.dark' : availableCapacity < 30 ? 'warning.dark' : 'success.dark' 
            }}>
              {availableCapacity.toFixed(0)}%
            </Box>
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={currentAllocationPercentage} 
            sx={{ height: 8, borderRadius: 5, bgcolor: 'grey.300', '& .MuiLinearProgress-bar': { bgcolor: getCapacityColor(currentAllocationPercentage) } }} 
          />
        </Box>
      </Card>

      {/* My Current Projects */}
      <Card sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'semibold', mb: 3 }}>My Current and Upcoming Projects</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="my assignments table">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>My Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>My Allocation (%)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myAssignments && myAssignments.length > 0 ? (
              myAssignments.map((assignment) => (
                <TableRow key={assignment._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 'medium' }}>{assignment.projectId?.name || 'N/A'}</TableCell>
                  <TableCell>{assignment.projectId?.description || 'N/A'}</TableCell>
                  <TableCell><Chip label={assignment.role} size="small" color="secondary" /></TableCell>
                  <TableCell>{assignment.allocationPercentage}%</TableCell>
                  <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(assignment.endDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>No assignments found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};

export default EngineerDashboard;
