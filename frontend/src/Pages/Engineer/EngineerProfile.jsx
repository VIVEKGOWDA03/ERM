import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// Keep fetching engineer data from the 'data' slice
import { fetchEngineerById } from '../../store/Slice/index'; 

// Material-UI Imports
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
  Chip,
  Table,        
  TableBody,  
  TableCell,    
  TableContainer, 
  TableHead,    
  TableRow,    
  Paper       
} from '@mui/material';
import Shimmer from '../../Compontes/Shimmer';
import DashboardShimmer from '../../Compontes/DashboardShimmer';
import BoxShimmer from '../../Compontes/BoxShimmer';

const EngineerProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedEngineer, isLoading, error } = useSelector((state) => state.data);
  const { user: currentUser } = useSelector((state) => state.auth);
  

  useEffect(() => {
    if (id) {
      dispatch(fetchEngineerById(id));
    }
  }, [dispatch, id]);



  if (isLoading) {
    return <DashboardShimmer/>;
  }

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Error loading profile: {error}</Box>;
  }

  if (!selectedEngineer) {
    return <Box sx={{ p: 4, color: 'text.secondary', textAlign: 'center' }}>Engineer profile not found or data not loaded.</Box>;
  }

  // Role-based access control: An engineer can only view their own profile.
  if (currentUser?.role === 'engineer' && String(currentUser._id) !== String(selectedEngineer._id)) {
    return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Access Denied. You are not authorized to view this profile.</Box>;
  }

  return (
    <Box className="container font-roboto mx-auto p-6 md:p-10">
      <Card sx={{ maxWidth: '900px', margin: '0 auto', boxShadow: 3, borderRadius: 2 }}>
        <CardHeader
          title={<Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{selectedEngineer.name}</Typography>}
          subheader={
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {selectedEngineer.role?.charAt(0)?.toUpperCase() + selectedEngineer.role?.slice(1) || 'N/A'}
              {selectedEngineer.role === 'engineer' ? ` - ${selectedEngineer.seniority?.charAt(0)?.toUpperCase() + selectedEngineer.seniority?.slice(1) || 'N/A'}` : ''}
            </Typography>
          }
          sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.300', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 3 }}
        />
        <CardContent sx={{ padding: 3, '& > *:not(:last-child)': { mb: 3 } }}>
          {/* Contact & General Info */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Email</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>{selectedEngineer.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Department</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>{selectedEngineer.department}</Typography>
            </Box>
            {selectedEngineer.role === 'engineer' && (
              <Box>
                <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Max Capacity</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>{selectedEngineer.maxCapacity}%</Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Skills */}
          {selectedEngineer.role === 'engineer' && selectedEngineer.skills && selectedEngineer.skills.length > 0 && (
            <Box>
              <Typography variant="caption" display="block" color="text.secondary" gutterBottom>Skills</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedEngineer.skills.map((skill, index) => (
                  <Chip key={index} label={skill} color="primary" variant="outlined" size="small" />
                ))}
              </Box>
            </Box>
          )}

          {/* NEW: Engineer's Assignments */}
          {selectedEngineer.role === 'engineer' && selectedEngineer.assignments && selectedEngineer.assignments.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'semibold', mb: 2 }}>Assigned Projects</Typography>
              <TableContainer component={Paper} sx={{ boxShadow: 1, borderRadius: 1 }}>
                <Table sx={{ minWidth: 600 }} aria-label="engineer assignments table">
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Allocation (%)</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedEngineer.assignments.map((assignment) => (
                      <TableRow key={assignment._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 'medium' }}>{assignment.projectId?.name || 'N/A'}</TableCell>
                        <TableCell><Chip label={assignment.role} size="small" color="secondary" /></TableCell>
                        <TableCell>{assignment.allocationPercentage}%</TableCell>
                        <TableCell>{new Date(assignment.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(assignment.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={assignment.projectId?.status?.charAt(0)?.toUpperCase() + assignment.projectId?.status?.slice(1) || 'N/A'} 
                            size="small" 
                            color={
                              assignment.projectId?.status === 'active' ? 'info' :
                              assignment.projectId?.status === 'planning' ? 'warning' :
                              assignment.projectId?.status === 'completed' ? 'success' : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {selectedEngineer.role === 'engineer' && (!selectedEngineer.assignments || selectedEngineer.assignments.length === 0) && (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
              <Typography variant="body2">No assignments found for this engineer.</Typography>
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
  );
};

export default EngineerProfile;
