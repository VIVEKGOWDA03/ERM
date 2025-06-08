import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Material-UI Imports
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';

// Lucide React Icons
import { Eye, Edit, Trash2 } from 'lucide-react';

import { fetchAllUsers } from '../../store/Slice/index'; 
import { deleteProject, fetchAllProjects } from '../../store/Slice/ProjectsSlice';


const ProjectListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // CORRECTED: Select projects, isLoading, error from state.projects
  const { projects, isLoading, error } = useSelector((state) => state.projects);
  // CORRECTED: Select users from state.data for manager mapping
  const { users } = useSelector((state) => state.data);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'manager') {
      toast.error("Access Denied. Only managers can view project list.");
      navigate('/manager-dashboard', { replace: true });
      return;
    }
    dispatch(fetchAllProjects()); // Fetch projects from the ProjectSlice
    dispatch(fetchAllUsers()); // Fetch all users (including managers) for the dropdown (from data slice)
  }, [dispatch, currentUser, navigate]);

  // Create a map of manager IDs to their names for quick lookup
  const managerMap = users.reduce((acc, user) => {
      if (user.role === 'manager') {
          acc[user._id] = user.name;
      }
      return acc;
  }, {});


  // Filtered projects based on search term and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' ||
                          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Helper function to get status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'active': return { bgcolor: 'info.main', color: 'info.contrastText' };
      case 'planning': return { bgcolor: 'warning.main', color: 'warning.contrastText' };
      case 'completed': return { bgcolor: 'success.main', color: 'success.contrastText' };
      default: return { bgcolor: 'grey.300', color: 'text.primary' };
    }
  };

  // Action handlers 
  const handleViewDetails = (projectId) => {
    console.log(`View details for project ID: ${projectId}`);
    // Implement navigation to a Project Details page: navigate(`/projects/${projectId}`);
    // This is still a placeholder, you'll need a ProjectDetails component and route.
  };

  const handleEditProject = (projectId) => {
    console.log(`Edit project ID: ${projectId}`);
    navigate(`/projects/edit/${projectId}`); // Navigate to the EditProjectForm
  };

  const handleDeleteProject = async (projectId) => {
    // Show a confirmation dialog (using window.confirm for simplicity, can be replaced by a custom modal)
    if (window.confirm('Are you sure you want to delete this project? This will also remove associated assignments.')) {
      const result = await dispatch(deleteProject(projectId)); // Dispatch the deleteProject thunk
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success(result.payload?.message || "Project deleted successfully!");
        // The ProjectSlice reducer for deleteProject already removes the item from the state.
        // No need to dispatch fetchAllProjects here unless you specifically want a full server refresh.
        // For robustness, especially in larger applications, re-fetching can be a good fallback.
        // For now, relying on slice state update.
      } else {
        toast.error(result.payload || "Failed to delete project.");
      }
    }
  };

  if (isLoading) {
    return <Box sx={{ p: 4, textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>Loading projects...</Box>;
  }

  if (error) {
    return <Box sx={{ p: 4, color: 'error.main', textAlign: 'center' }}>Error loading projects: {error}</Box>;
  }

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
        Project Management
      </Typography>

      {/* Filter and Search Section */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search Projects"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '300px' } }}
        />
        <FormControl variant="outlined" sx={{ minWidth: { xs: '100%', md: '180px' } }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="planning">Planning</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{ minWidth: { xs: '100%', md: 'auto' }, py: 1.5 }}
          onClick={() => navigate('/projects/new')}
        >
          Create New Project
        </Button>
      </Box>

      {/* Projects Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="projects table">
          <TableHead sx={{ bgcolor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Manager</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Required Skills</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {project.name}
                  </TableCell>
                  <TableCell>
                    <Box component="span" sx={{
                      px: 2, py: 0.5, borderRadius: 1, fontWeight: 'medium',
                      ...getStatusBadgeStyle(project.status)
                    }}>
                      {project.status?.charAt(0)?.toUpperCase() + project.status?.slice(1) || 'N/A'}
                    </Box>
                  </TableCell>
                  {/* Use managerMap to get manager name */}
                  <TableCell>{managerMap[project.managerId?._id] || 'N/A'}</TableCell> {/* Ensure managerId is accessed safely */}
                  <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(project.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {project.requiredSkills?.map((skill, index) => (
                        <Box key={index} component="span" sx={{
                          px: 1.5, py: 0.5, borderRadius: 1, bgcolor: 'primary.50',
                          color: 'primary.main', border: '1px solid', borderColor: 'primary.light', fontSize: '0.75rem'
                        }}>
                          {skill}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Eye size={16} />}
                      onClick={() => handleViewDetails(project._id)}
                      sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<Edit size={16} />}
                      onClick={() => handleEditProject(project._id)}
                      sx={{ mr: 1, mb: { xs: 1, md: 0 } }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Trash2 size={16} />}
                      onClick={() => handleDeleteProject(project._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No projects found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectListPage;
