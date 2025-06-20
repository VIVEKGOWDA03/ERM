import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchAllEngineers } from "../../store/Slice";
import {
  createAssignment,
  fetchAllAssignments,
} from "../../store/Slice/AssignmentSlice";
import DashboardShimmer from "../../Compontes/DashboardShimmer";
import { fetchAllProjects } from "../../store/Slice/ProjectsSlice";

const formSchema = z.object({
  engineerId: z.string().nonempty({ message: "Please select an engineer." }),
  projectId: z.string().nonempty({ message: "Please select a project." }),
  allocationPercentage: z.coerce
    .number()
    .min(0, { message: "Allocation cannot be negative." })
    .max(100, { message: "Allocation cannot exceed 100%." }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  role: z
    .string()
    .nonempty({ message: "Please enter the engineer's role on this project." }),
});

const CreateAssignmentForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { engineers } = useSelector((state) => state.data);
  const { projects } = useSelector((state) => state.projects);
  const { assignments, isLoading, error } = useSelector(
    (state) => state.assignments
  );

  const { user: currentUser } = useSelector((state) => state.auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      engineerId: searchParams.get("engineerId") || "",
      projectId: "",
      allocationPercentage: 0,
      startDate: null,
      endDate: null,
      role: "",
    },
  });

  const selectedEngineerId = form.watch("engineerId");
  const proposedAllocation = form.watch("allocationPercentage");

  const selectedEngineer = engineers.find(
    (eng) => eng._id === selectedEngineerId
  );
  const [currentEngineerAllocation, setCurrentEngineerAllocation] = useState(0);
  const [engineerAvailableCapacity, setEngineerAvailableCapacity] = useState(0);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "manager") {
      toast.error("Access Denied. Only managers can assign engineers.");
      navigate("/manager-dashboard", { replace: true });
      return;
    }

    if (engineers.length === 0) dispatch(fetchAllEngineers());
    if (projects.length === 0) dispatch(fetchAllProjects());
    if (assignments.length === 0) dispatch(fetchAllAssignments());
  }, [
    dispatch,
    engineers.length,
    projects.length,
    assignments.length,
    currentUser,
    navigate,
  ]);

  useEffect(() => {
    if (selectedEngineer && assignments.length > 0) {
      const activeAssignments = assignments
        .filter(
          (assignment) =>
            String(assignment.engineerId?._id) ===
              String(selectedEngineer._id) &&
            new Date(assignment.endDate) >= new Date() &&
            new Date(assignment.startDate) <= new Date()
        )
        .reduce((sum, assignment) => sum + assignment.allocationPercentage, 0);

      setCurrentEngineerAllocation(activeAssignments);
      const remainingCapacity =
        selectedEngineer.maxCapacity - activeAssignments;
      setEngineerAvailableCapacity(remainingCapacity);
    } else {
      setCurrentEngineerAllocation(0);
      setEngineerAvailableCapacity(
        selectedEngineer ? selectedEngineer.maxCapacity : 0
      );
    }
  }, [selectedEngineer, assignments]);

  const capacityAfterProposed = selectedEngineer
    ? selectedEngineer.maxCapacity -
      (currentEngineerAllocation + proposedAllocation)
    : null;

  async function onSubmit(values) {
    if (
      values.startDate &&
      values.endDate &&
      values.startDate > values.endDate
    ) {
      form.setError("endDate", {
        message: "End date cannot be before start date.",
      });
      return;
    }

    if (capacityAfterProposed < 0 && selectedEngineer) {
      toast.error(
        `Proposed allocation overloads ${selectedEngineer.name} by ${Math.abs(
          capacityAfterProposed
        )}%.`
      );
    }

    const assignmentData = {
      engineerId: values.engineerId,
      projectId: values.projectId,
      allocationPercentage: values.allocationPercentage,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      role: values.role,
    };

    const result = await dispatch(createAssignment(assignmentData));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(
        result.payload.message || "Assignment created successfully!"
      );
      form.reset();
      dispatch(fetchAllAssignments());
      dispatch(fetchAllEngineers());
      navigate("/manager-dashboard");
    } else {
      toast.error(result.payload || "Failed to create assignment.");
    }
  }

  if (isLoading) {
    return <DashboardShimmer />;
  }
  if (error) {
    return (
      <div className="p-8 text-red-600 text-center text-xl">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="container max-w-full mx-auto p-6 md:p-10">
        <Card
          sx={{
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <CardHeader
            title={
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                }}
              >
                Assign Engineer to Project
              </Typography>
            }
            subheader={
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                }}
              >
                Allocate an engineer to a specific project with a defined
                capacity.
              </Typography>
            }
          />
          <CardContent sx={{ padding: 3 }}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Engineer Select */}
              <Controller
                name="engineerId"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <FormControl fullWidth error={!!fieldError}>
                    <InputLabel id="engineer-select-label">Engineer</InputLabel>
                    <Select
                      labelId="engineer-select-label"
                      label="Engineer"
                      {...field}
                    >
                      {engineers.length > 0 ? (
                        engineers.map((engineer) => (
                          <MenuItem key={engineer._id} value={engineer._id}>
                            {engineer.name} ({engineer.department}) -{" "}
                            {engineer.seniority?.charAt(0)?.toUpperCase() +
                              engineer.seniority?.slice(1) || "N/A"}{" "}
                            {/* SAFEGUARED */}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No engineers available
                        </MenuItem>
                      )}
                    </Select>
                    {fieldError && (
                      <FormHelperText>{fieldError.message}</FormHelperText>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.75rem",
                          md: "0.875rem",
                        },
                      }}
                    ></Typography>
                  </FormControl>
                )}
              />

              {selectedEngineer && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.50",
                    border: "1px solid",
                    borderColor: "primary.200",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
                    }}
                  >
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                      {selectedEngineer.name}'s
                    </Typography>{" "}
                    Current Allocation:{" "}
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                      {currentEngineerAllocation.toFixed(0)}%
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.primary",
                      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
                    }}
                  >
                    Available Capacity Before This Assignment:{" "}
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                      {engineerAvailableCapacity.toFixed(0)}%
                    </Typography>
                  </Typography>
                  {proposedAllocation > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        color:
                          capacityAfterProposed < 0
                            ? "error.main"
                            : capacityAfterProposed < 30
                            ? "warning.main"
                            : "success.main",
                      }}
                    >
                      Proposed Capacity After This Assignment:{" "}
                      {currentEngineerAllocation + proposedAllocation >
                      selectedEngineer.maxCapacity
                        ? "OVERLOADED by " +
                          Math.abs(capacityAfterProposed).toFixed(0) +
                          "%"
                        : (
                            currentEngineerAllocation + proposedAllocation
                          ).toFixed(0) + "% Allocated"}
                    </Typography>
                  )}
                </Box>
              )}

              <Controller
                name="projectId"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <FormControl fullWidth error={!!fieldError}>
                    <InputLabel id="project-select-label">Project</InputLabel>
                    <Select
                      labelId="project-select-label"
                      label="Project"
                      {...field}
                    >
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <MenuItem key={project._id} value={project._id}>
                            {project.name} (
                            {project.status?.charAt(0)?.toUpperCase() +
                              project.status?.slice(1) || "N/A"}
                            ) {/* SAFEGUARED HERE */}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No projects available
                        </MenuItem>
                      )}
                    </Select>
                    {fieldError && (
                      <FormHelperText>{fieldError.message}</FormHelperText>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.65rem",
                          sm: "0.75rem",
                          md: "0.875rem",
                        },
                      }}
                    ></Typography>
                  </FormControl>
                )}
              />

              <Controller
                name="allocationPercentage"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <TextField
                    fullWidth
                    label="Allocation Percentage (%)"
                    type="number"
                    placeholder="e.g., 70"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    error={!!fieldError}
                    helperText={fieldError ? fieldError.message : ""}
                  />
                )}
              />

              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <TextField
                    fullWidth
                    label="Role on Project"
                    placeholder="e.g., Lead Frontend Developer"
                    {...field}
                    error={!!fieldError}
                    helperText={fieldError ? fieldError.message : ""}
                  />
                )}
              />

              <Controller
                name="startDate"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <DatePicker
                    label="Start Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldError,
                        helperText: fieldError ? fieldError.message : "",
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="endDate"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <DatePicker
                    label="End Date"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!fieldError,
                        helperText: fieldError ? fieldError.message : "",
                      },
                    }}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, py: 1.5 }}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : "Assign Engineer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAssignmentForm;
