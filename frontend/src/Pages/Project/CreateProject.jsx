import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Material-UI Imports
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
  Chip, // For displaying skills as chips
} from "@mui/material";

// Material-UI Date Picker Imports
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { fetchAllUsers } from "../../store/Slice/index"; // Import createProject action
import { fetchAllEngineers } from "../../store/Slice/index"; // Needed to get managers for managerId field
import {
  createProject,
  fetchAllProjects,
} from "../../store/Slice/ProjectsSlice";

// --- Zod Schema for form validation ---
const formSchema = z.object({
  name: z.string().nonempty({ message: "Project name is required." }),
  description: z.string().nonempty({ message: "Description is required." }),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  requiredSkills: z
    .array(z.string())
    .min(1, { message: "At least one required skill is needed." }),
  teamSize: z.coerce
    .number()
    .min(1, { message: "Team size must be at least 1." }),
  status: z.enum(["planning", "active", "completed"], {
    errorMap: () => ({ message: "Please select a valid status." }),
  }),
  managerId: z
    .string()
    .nonempty({ message: "Please select a project manager." }),
});

const CreateProjectForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, engineers, isLoading, error } = useSelector(
    (state) => state.data
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      requiredSkills: [],
      teamSize: 1,
      status: "planning",
      managerId: "",
    },
  });

  console.log("Current User:", users);

  const managers = users.filter((eng) => eng.role === "manager");

  useEffect(() => {
    // Only managers can create/edit projects
    if (!currentUser || currentUser.role !== "manager") {
      toast.error("Access Denied. Only managers can create projects.");
      navigate("/manager-dashboard", { replace: true });
      return;
    }
    if (managers.length === 0) {
      // Only fetch if managers list is empty
      dispatch(fetchAllEngineers());
    }
  }, [dispatch, currentUser, navigate, managers.length]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);
  // Handle skill input and chip display
  const [skillInput, setSkillInput] = useState("");
  const handleAddSkill = () => {
    const skillToAdd = skillInput.trim();
    if (skillToAdd && !form.getValues("requiredSkills").includes(skillToAdd)) {
      form.setValue(
        "requiredSkills",
        [...form.getValues("requiredSkills"), skillToAdd],
        { shouldValidate: true }
      );
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (skillToDelete) => () => {
    form.setValue(
      "requiredSkills",
      form
        .getValues("requiredSkills")
        .filter((skill) => skill !== skillToDelete),
      { shouldValidate: true }
    );
  };

  async function onSubmit(values) {
    // Basic date validation
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

    // Ensure managerId is populated if the current user is manager, otherwise it's in the form
    const projectData = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      // Ensure managerId is the ID of the logged-in user if not explicitly selected
      // (This assumes the form will pre-fill or implicitly set the current manager as project manager)
      managerId: values.managerId || currentUser.id, // Fallback to current user's ID
    };

    const result = await dispatch(createProject(projectData));

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(result.payload.message || "Project created successfully!");
      form.reset(); // Reset form fields
      dispatch(fetchAllProjects()); // Refetch projects to update ProjectListPage
      navigate("/projects"); // Navigate back to project list page
    } else {
      toast.error(result.payload || "Failed to create project.");
    }
  }

  if (isLoading && engineers.length === 0) {
    // Only show full loading if initial data is missing
    return <DashboardShimmer />;
  }
  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
        Error loading data: {error}
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="container mx-auto p-6 md:p-10">
        <Card
          sx={{
            maxWidth: "800px",
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
                sx={{ fontWeight: "bold", color: "text.primary" }}
              >
                Create New Project
              </Typography>
            }
            subheader={
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Define details for a new engineering project.
              </Typography>
            }
            sx={{
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "grey.300",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              padding: 3,
            }}
          />
          <CardContent sx={{ padding: 3 }}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <TextField
                    fullWidth
                    label="Project Name"
                    placeholder="e.g., New Customer Portal"
                    {...field}
                    error={!!fieldError}
                    helperText={
                      fieldError
                        ? fieldError.message
                        : "A descriptive name for the project."
                    }
                  />
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    placeholder="A detailed description of the project scope and goals."
                    {...field}
                    error={!!fieldError}
                    helperText={
                      fieldError
                        ? fieldError.message
                        : "Provide a detailed description of the project."
                    }
                  />
                )}
              />

              {/* Start Date Picker */}
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

              {/* End Date Picker */}
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

              {/* Required Skills (Text Input + Chips) */}
              <Controller
                name="requiredSkills"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <FormControl fullWidth error={!!fieldError}>
                    <TextField
                      label="Required Skills"
                      placeholder="Type a skill and press Enter or Add"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent form submission
                          handleAddSkill();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddSkill}
                          >
                            Add
                          </Button>
                        ),
                      }}
                      error={!!fieldError}
                      helperText={
                        fieldError
                          ? fieldError.message
                          : "Add skills required for this project."
                      }
                    />
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
                    >
                      {field.value.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          onDelete={handleDeleteSkill(skill)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </FormControl>
                )}
              />

              {/* Team Size */}
              <Controller
                name="teamSize"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <TextField
                    fullWidth
                    label="Required Team Size"
                    type="number"
                    placeholder="e.g., 5"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    } // Ensure integer type
                    error={!!fieldError}
                    helperText={
                      fieldError
                        ? fieldError.message
                        : "Number of engineers required for the project."
                    }
                  />
                )}
              />

              {/* Status Select */}
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <FormControl fullWidth error={!!fieldError}>
                    <InputLabel id="project-status-label">
                      Project Status
                    </InputLabel>
                    <Select
                      labelId="project-status-label"
                      label="Project Status"
                      {...field}
                      value={field.value || "planning"} // Ensure a default value is selected in MUI
                    >
                      <MenuItem value="planning">Planning</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                    {fieldError && (
                      <FormHelperText>{fieldError.message}</FormHelperText>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Current status of the project.
                    </Typography>
                  </FormControl>
                )}
              />

              {/* Manager Select (filtered for 'manager' role) */}
              <Controller
                name="managerId"
                control={form.control}
                render={({ field, fieldState: { error: fieldError } }) => (
                  <FormControl fullWidth error={!!fieldError}>
                    <InputLabel id="manager-select-label">
                      Project Manager
                    </InputLabel>
                    <Select
                      labelId="manager-select-label"
                      label="Project Manager"
                      {...field}
                      value={field.value || ""} // Ensure default value for Select
                    >
                      {managers.length > 0 ? (
                        managers.map((manager) => (
                          <MenuItem key={manager._id} value={manager._id}>
                            {manager.name}
                            {/* ({manager.email}) */}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No managers available
                        </MenuItem>
                      )}
                    </Select>
                    {fieldError && (
                      <FormHelperText>{fieldError.message}</FormHelperText>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Select the manager overseeing this project.
                    </Typography>
                  </FormControl>
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
                  ? "Creating Project..."
                  : "Create Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateProjectForm;
