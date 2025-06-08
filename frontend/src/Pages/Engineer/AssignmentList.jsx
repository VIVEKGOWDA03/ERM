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
  Chip,
} from "@mui/material";

// Lucide React Icons (assuming you have these or similar icons)
import { Eye, Edit, Trash2 } from "lucide-react"; // Placeholder for future actions if needed

// Import thunks from their respective slices
import { fetchAllAssignments } from "../../store/Slice/AssignmentSlice";
import { fetchAllProjects } from "../../store/Slice/ProjectsSlice";
import { fetchAllUsers } from "../../store/Slice/index"; // fetchAllUsers for all users, fetchAllEngineers for detailed engineer profiles if needed

const AssignmentListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select data from the correct Redux slices
  const {
    assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useSelector((state) => state.assignments);
  const {
    projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useSelector((state) => state.projects);
  // We still need 'users' for the filter dropdowns to show engineer names
  const {
    users,
    isLoading: dataLoading,
    error: dataError,
  } = useSelector((state) => state.data);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterEngineer, setFilterEngineer] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // Filter by project status

  useEffect(() => {
    // Only managers can view this list
    if (!currentUser || currentUser.role !== "manager") {
      toast.error("Access Denied. Only managers can view all assignments.");
      navigate("/manager-dashboard", { replace: true });
      return;
    }

    // Fetch all necessary data
    dispatch(fetchAllAssignments());
    dispatch(fetchAllProjects());
    dispatch(fetchAllUsers()); // Get all users for mapping engineer names in filters
  }, [dispatch, currentUser, navigate]);

  // Create map for engineer names for dropdowns
  const engineerMapForFilters = users.reduce((acc, user) => {
    if (user.role === "engineer") {
      acc[user._id] = user.name;
    }
    return acc;
  }, {});

  // Filtered assignments based on search term, project, and engineer
  const filteredAssignments = assignments.filter((assignment) => {
    // Direct access to populated names for search filtering
    const projectName = assignment.projectId?.name || "";
    const engineerName = assignment.engineerId?.name || ""; // Corrected to use populated name
    const projectStatus = assignment.projectId?.status || "";

    const matchesSearch =
      searchTerm === "" ||
      projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Corrected filter logic to compare IDs
    const matchesProject =
      filterProject === "all" ||
      (assignment.projectId && assignment.projectId._id === filterProject);
    const matchesEngineer =
      filterEngineer === "all" ||
      (assignment.engineerId && assignment.engineerId._id === filterEngineer);
    const matchesStatus =
      filterStatus === "all" || projectStatus === filterStatus;

    return matchesSearch && matchesProject && matchesEngineer && matchesStatus;
  });

  // Combine loading and error states
  const isLoading = assignmentsLoading || projectsLoading || dataLoading;
  const error = assignmentsError || projectsError || dataError;

  if (isLoading) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          fontSize: "1.25rem",
          fontWeight: "bold",
        }}
      >
        Loading assignments...
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
        Error loading data: {error}
      </Box>
    );
  }

  // Helper for status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "info";
      case "planning":
        return "warning";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 3, md: 6 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, color: "text.primary" }}
      >
        All Assignments
      </Typography>

      {/* Filter and Search Section */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <TextField
          label="Search Assignments"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: "100%", md: "300px" } }}
        />
        <FormControl
          variant="outlined"
          sx={{ minWidth: { xs: "100%", md: "180px" } }}
        >
          <InputLabel>Filter by Project</InputLabel>
          <Select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            label="Filter by Project"
          >
            <MenuItem value="all">All Projects</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project._id} value={project._id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{ minWidth: { xs: "100%", md: "180px" } }}
        >
          <InputLabel>Filter by Engineer</InputLabel>
          <Select
            value={filterEngineer}
            onChange={(e) => setFilterEngineer(e.target.value)}
            label="Filter by Engineer"
          >
            <MenuItem value="all">All Engineers</MenuItem>
            {/* Using users array directly for filter dropdown, mapping by name for display */}
            {users
              .filter((u) => u.role === "engineer")
              .map((engineer) => (
                <MenuItem key={engineer._id} value={engineer._id}>
                  {engineer.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl
          variant="outlined"
          sx={{ minWidth: { xs: "100%", md: "180px" } }}
        >
          <InputLabel>Filter by Project Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter by Project Status"
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="planning">Planning</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Assignments Table */}
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 800 }} aria-label="all assignments table">
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Project</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Engineer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Allocation (%)</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Project Status</TableCell>
              {/* <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell> {/* Placeholder for edit/delete */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment) => (
                <TableRow
                  key={assignment._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {/* CORRECTED: Directly access populated project name */}
                    {assignment.projectId?.name || "N/A"}
                  </TableCell>
                  <TableCell>
                    {/* CORRECTED: Directly access populated engineer name */}
                    {assignment.engineerId?.name || "N/A"}
                  </TableCell>
                  <TableCell>{assignment.role}</TableCell>
                  <TableCell>{assignment.allocationPercentage}%</TableCell>
                  <TableCell>
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        assignment.projectId?.status?.charAt(0)?.toUpperCase() +
                          assignment.projectId?.status?.slice(1) || "N/A"
                      }
                      size="small"
                      color={getStatusBadgeColor(assignment.projectId?.status)}
                    />
                  </TableCell>
                  {/*
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Button variant="outlined" size="small" startIcon={<Edit size={16} />} sx={{ mr: 1 }}>Edit</Button>
                    <Button variant="outlined" size="small" color="error" startIcon={<Trash2 size={16} />}>Delete</Button>
                  </TableCell>
                  */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
                >
                  No assignments found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignmentListPage;
