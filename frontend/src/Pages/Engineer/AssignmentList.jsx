import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  Card,
  Chip,
  Skeleton,
  Pagination,
  Button,
} from "@mui/material";

import { Download as DownloadIcon } from "@mui/icons-material";

import { fetchAllAssignments } from "../../store/Slice/AssignmentSlice";
import { fetchAllProjects } from "../../store/Slice/ProjectsSlice";
import { fetchAllUsers } from "../../store/Slice/index";
import DocButton from "../../Ui/DocButton";

const AssignmentListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  const {
    users,
    isLoading: dataLoading,
    error: dataError,
  } = useSelector((state) => state.data);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterEngineer, setFilterEngineer] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!currentUser || currentUser.role !== "manager") {
      toast.error("Access Denied. Only managers can view all assignments.");
      navigate("/manager-dashboard", { replace: true });
      return;
    }

    dispatch(fetchAllAssignments());
    dispatch(fetchAllProjects());
    dispatch(fetchAllUsers());
  }, [dispatch, currentUser, navigate]);

  const filteredAssignments = assignments.filter((assignment) => {
    const projectName = assignment.projectId?.name || "";
    const engineerName = assignment.engineerId?.name || "";
    const projectStatus = assignment.projectId?.status || "";

    const matchesSearch =
      searchTerm === "" ||
      projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engineerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.role.toLowerCase().includes(searchTerm.toLowerCase());

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

  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedAssignments = filteredAssignments.slice(startIndex, endIndex);
  const pageCount = Math.ceil(filteredAssignments.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const isLoading = assignmentsLoading || projectsLoading || dataLoading;
  const error = assignmentsError || projectsError || dataError;

  const statusColorMap = {
    planning: "warning",
    active: "info",
    completed: "success",
  };

  const getStatusBadgeColor = (status) => statusColorMap[status] || "default";

  const handleDownloadReport = () => {
    if (filteredAssignments.length === 0) {
      toast("No data to export.", { icon: "ℹ️" });
      return;
    }

    const dataToExport = filteredAssignments.map((assignment) => ({
      "Project Name": assignment.projectId?.name || "N/A",
      "Engineer Name": assignment.engineerId?.name || "N/A",
      Role: assignment.role,
      "Allocation (%)": assignment.allocationPercentage,
      "Start Date": new Date(assignment.startDate).toLocaleDateString(),
      "End Date": new Date(assignment.endDate).toLocaleDateString(),
      "Project Status":
        assignment.projectId?.status?.charAt(0)?.toUpperCase() +
          assignment.projectId?.status?.slice(1) || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Assignments Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(
      data,
      `Assignments_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
    toast.success("Assignment report downloaded!");
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh" }}>
        <Skeleton variant="text" width={250} height={50} sx={{ mb: 4 }} />
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          <Skeleton variant="rectangular" width={300} height={56} />
          <Skeleton variant="rectangular" width={180} height={56} />
          <Skeleton variant="rectangular" width={180} height={56} />
          <Skeleton variant="rectangular" width={180} height={56} />
        </Box>
        <Skeleton variant="text" width={150} height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          color: "error.main",
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Error loading data:</Typography>
        <Typography variant="body1">{error}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please try again later.
        </Typography>
      </Box>
    );
  }

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
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 4,
          fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
        }}
      >
        📋 All Assignments
      </Typography>

      {/* Filters and Download Button */}
      <Card sx={{ mb: 4, p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 2, md: 3 },
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <TextField
            label="Search Assignments"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: 200 } }}
            size="small"
          />
          <FormControl sx={{ minWidth: { xs: "100%", sm: 180 } }} size="small">
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
          <FormControl sx={{ minWidth: { xs: "100%", sm: 180 } }} size="small">
            <InputLabel>Filter by Engineer</InputLabel>
            <Select
              value={filterEngineer}
              onChange={(e) => setFilterEngineer(e.target.value)}
              label="Filter by Engineer"
            >
              <MenuItem value="all">All Engineers</MenuItem>
              {users
                .filter((u) => u.role === "engineer")
                .map((engineer) => (
                  <MenuItem key={engineer._id} value={engineer._id}>
                    {engineer.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: { xs: "100%", sm: 180 } }} size="small">
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          {/* <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadReport}
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              py: { xs: 1.2, sm: 1.5 },
              px: { xs: 2, sm: 3 },
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Download Report
          </Button> */}
          <DocButton onClick={handleDownloadReport} />
        </Box>
      </Card>

      <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary" }}>
        Showing {filteredAssignments.length} assignments
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}
      >
        <Table sx={{ minWidth: 1000 }} aria-label="assignments table">
          <TableHead sx={{ bgcolor: "grey.100" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Project
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Engineer
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Allocation (%)
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                End Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssignments.length > 0 ? (
              paginatedAssignments.map((assignment) => (
                <TableRow
                  key={assignment._id}
                  sx={{ "&:hover": { backgroundColor: "action.hover" } }}
                >
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {assignment.projectId?.name || "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {assignment.engineerId?.name || "N/A"}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {assignment.role}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {assignment.allocationPercentage}%
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {new Date(assignment.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      label={
                        assignment.projectId?.status?.charAt(0)?.toUpperCase() +
                          assignment.projectId?.status?.slice(1) || "N/A"
                      }
                      size="small"
                      color={getStatusBadgeColor(assignment.projectId?.status)}
                      sx={{ minWidth: 70 }}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    🚫 No assignments found. Try changing the filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAssignments.length > rowsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default AssignmentListPage;
