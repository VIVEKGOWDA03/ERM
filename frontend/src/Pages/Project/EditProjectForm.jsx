import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from "react-router-dom"; 
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
  Chip,
  CircularProgress, 
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  fetchAllProjects,
  fetchProjectById,
  updateProject,
} from "../../store/Slice/ProjectsSlice";
import { fetchAllUsers } from "../../store/Slice";
import DashboardShimmer from "../../Compontes/DashboardShimmer";


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

const allPossibleSkills = [
  "React",
  "Node.js",
  "Python",
  "JavaScript",
  "TypeScript",
  "MongoDB",
  "SQL",
  "AWS",
  "Azure",
  "GCP",
  "Docker",
  "Kubernetes",
  "GraphQL",
  "Frontend",
  "Backend",
  "DevOps",
  "QA",
  "Manual Testing",
  "Automation",
  "JIRA",
  "Data Visualization",
  "Figma",
  "UI/UX",
  "Cloud Architecture",
  "Microservices",
  "Django",
  "Express",
  "Go",
  "React Native",
  "Performance Tuning",
  "Mobile Development",
];

const EditProjectForm = () => {
  const { id: projectId } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.data);
  const { selectedProject, isLoading, error } = useSelector(
    (state) => state.projects
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

  const managers = users.filter((user) => user.role === "manager");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "manager") {
      toast.error("Access Denied. Only managers can edit projects.");
      navigate("/manager-dashboard", { replace: true });
      return;
    }

    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
    if (users.length === 0) {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, projectId, currentUser, navigate, users.length]);

  useEffect(() => {
    if (selectedProject) {
      form.reset({
        name: selectedProject.name || "",
        description: selectedProject.description || "",
        startDate: selectedProject.startDate
          ? new Date(selectedProject.startDate)
          : null,
        endDate: selectedProject.endDate
          ? new Date(selectedProject.endDate)
          : null,
        requiredSkills: selectedProject.requiredSkills || [],
        teamSize: selectedProject.teamSize || 1,
        status: selectedProject.status || "planning",
        managerId:
          selectedProject.managerId?._id || selectedProject.managerId || "",
      });
    }
  }, [selectedProject, form]); 

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

    const updatedProjectData = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
    };

    const result = await dispatch(
      updateProject({ projectId, updatedData: updatedProjectData })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(result.payload.message || "Project updated successfully!");
      dispatch(fetchAllProjects()); 
      navigate("/projects"); 
    } else {
      toast.error(result.payload || "Failed to update project.");
    }
  }

  if (isLoading || (!selectedProject && projectId) || users.length === 0) {
    return <DashboardShimmer />;
  }

  if (error) {
    return (
      <Box sx={{ p: 4, color: "error.main", textAlign: "center" }}>
        Error loading data: {error}
      </Box>
    );
  }

  if (!selectedProject && !isLoading) {
    return (
      <Box sx={{ p: 4, color: "text.secondary", textAlign: "center" }}>
        Project not found.
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
                Edit Project
              </Typography>
            }
            subheader={
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Modify details for the existing engineering project.
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
                          e.preventDefault(); 
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
                    } 
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
                      value={field.value || "planning"} 
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
                      value={field.value || ""} 
                    >
                      {managers.length > 0 ? (
                        managers.map((manager) => (
                          <MenuItem key={manager._id} value={manager._id}>
                            {manager.name} ({manager.email})
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
                  ? "Updating Project..."
                  : "Update Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default EditProjectForm;
