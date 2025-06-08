import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  Button,
} from "@mui/material";

// Lucide React Icons
import { Eye, Edit, Trash2 } from "lucide-react";

import { fetchAllUsers } from "../../store/Slice/index";
import {
  deleteProject,
  fetchAllProjects,
} from "../../store/Slice/ProjectsSlice";
import DashboardShimmer from "../../Compontes/DashboardShimmer";

// Keep all imports unchanged

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, isLoading, error } = useSelector((state) => state.projects);
  const { users } = useSelector((state) => state.data);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "manager") {
      toast.error("Access Denied. Only managers can view project list.");
      navigate("/manager-dashboard", { replace: true });
      return;
    }
    dispatch(fetchAllProjects());
    dispatch(fetchAllUsers());
  }, [dispatch, currentUser, navigate]);

  const managerMap = users.reduce((acc, user) => {
    if (user.role === "manager") {
      acc[user._id] = user.name;
    }
    return acc;
  }, {});

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm === "" ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "active":
        return {
          backgroundColor: "#0288d1",
          color: "#fff",
          fontWeight: "bold",
        };
      case "planning":
        return {
          backgroundColor: "#fbc02d",
          color: "#000",
          fontWeight: "bold",
        };
      case "completed":
        return {
          backgroundColor: "#2e7d32",
          color: "#fff",
          fontWeight: "bold",
        };
      default:
        return { backgroundColor: "#ccc", color: "#000" };
    }
  };

  const handleViewDetails = (projectId) => {
    console.log(`View details for project ID: ${projectId}`);
  };

  const handleEditProject = (projectId) => {
    navigate(`/projects/edit/${projectId}`);
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const result = await dispatch(deleteProject(projectId));
      if (result.meta.requestStatus === "fulfilled") {
        toast.success(
          result.payload?.message || "Project deleted successfully!"
        );
      } else {
        toast.error(result.payload || "Failed to delete project.");
      }
    }
  };

  if (isLoading) {
    return <DashboardShimmer />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
        Error loading projects: {error}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 3, md: 6 },
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Project Management
      </Typography>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <TextField
          label="Search Projects"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl variant="outlined" sx={{ minWidth: 180 }}>
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
          onClick={() => navigate("/projects/new")}
          sx={{ py: 1.5 }}
        >
          Create New Project
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Manager</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Required Skills</TableCell>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        display: "inline-block",
                        fontWeight: "bold",
                        ...getStatusBadgeStyle(project.status),
                      }}
                    >
                      {project.status?.charAt(0).toUpperCase() +
                        project.status?.slice(1) || "N/A"}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {managerMap[project.managerId?._id] || "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(project.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(project.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {project.requiredSkills?.map((skill, index) => (
                        <Box
                          key={index}
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            fontSize: "0.75rem",
                            borderRadius: 1,
                            border: "1px solid #90caf9",
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewDetails(project._id)}
                        startIcon={<Eye size={16} />}
                        sx={{
                          bgcolor: "#0288d1",
                          color: "white",
                          "&:hover": { bgcolor: "#0277bd" },
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditProject(project._id)}
                        startIcon={<Edit size={16} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteProject(project._id)}
                        startIcon={<Trash2 size={16} />}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
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
