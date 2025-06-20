import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Chip,
  Button
} from '@mui/material';
import { Eye, PlusCircle } from 'lucide-react';

import { fetchAllEngineers } from '../../store/Slice/index'; 
import DashboardShimmer from '../../Compontes/DashboardShimmer';

const EngineerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { engineers, isLoading, error } = useSelector((state) => state.data);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'manager') {
      toast.error("Access Denied. Only managers can view the engineer list.");
      navigate('/manager-dashboard', { replace: true });
      return;
    }
    dispatch(fetchAllEngineers());
  }, [dispatch, currentUser, navigate]);

  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = searchTerm === '' ||
                          engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engineer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engineer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engineer.seniority.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          engineer.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleViewProfile = (engineerId) => {
    navigate(`/engineers/${engineerId}`);
  };

  const handleCreateNewEngineer = () => { 
    // toast.error('error');
    navigate('/auth/register'); 
  };

  if (isLoading) {
    return <DashboardShimmer/>;
  }

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Error loading engineers: {error}</Box>;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
        Engineer Directory
      </Typography>

      {/* Filter and Create Button Section */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search Engineers"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '300px' } }}
        />
        <Button
          variant="contained"
          sx={{ minWidth: { xs: '100%', md: 'auto' }, py: 1.5 }}
          onClick={handleCreateNewEngineer}
          startIcon={<PlusCircle size={20} />}
        >
          Add New Engineer
        </Button>
      </Box>

      {/* Engineers Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 800 }} aria-label="engineers table">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Seniority</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Max Capacity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Skills</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEngineers.length > 0 ? (
              filteredEngineers.map((engineer) => (
                <TableRow key={engineer._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {engineer.name}
                  </TableCell>
                  <TableCell>{engineer.email}</TableCell>
                  <TableCell>{engineer.department}</TableCell>
                  <TableCell>{engineer.seniority?.charAt(0)?.toUpperCase() + engineer.seniority?.slice(1)}</TableCell>
                  <TableCell>{engineer.maxCapacity}%</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {engineer.skills?.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" color="primary" />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Eye size={16} />}
                      onClick={() => handleViewProfile(engineer._id)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No engineers found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EngineerList;
