import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const baseUrl = "https://erm-kok7.onrender.com/api";


const initialState = {
  projects: [],          // Stores the list of all projects
  selectedProject: null,  
  isLoading: false,       
  error: null,            
};

// Async Thunks for project-related operations

// Fetch all projects
export const fetchAllProjects = createAsyncThunk(
  'projects/fetchAllProjects',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.get(`${baseUrl}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// Fetch a single project by ID
export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (projectId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.get(`${baseUrl}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch project ${projectId}:`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || `Failed to fetch project ${projectId}`);
    }
  }
);

// Create a new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.post(`${baseUrl}/projects`, projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to create project:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

// Update an existing project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, updatedData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.put(`${baseUrl}/projects/${projectId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Backend should return the updated project
    } catch (error) {
      console.error(`Failed to update project ${projectId}:`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || `Failed to update project ${projectId}`);
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.delete(`${baseUrl}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Backend should return success message
    } catch (error) {
      console.error(`Failed to delete project ${projectId}:`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || `Failed to delete project ${projectId}`);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Projects
      .addCase(fetchAllProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Project By ID lifecycle
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedProject = null; // Clear previous project data
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProject = action.payload; // Store the fetched project
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.selectedProject = null;
      })
      // Create Project lifecycle
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add the new project to the state or refetch all projects
        // For simplicity and to avoid manual data manipulation here, we often dispatch fetchAllProjects
        // after a successful creation/update, or let the component handle re-fetching.
        // If you want to add it directly: state.projects.push(action.payload.data);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Project lifecycle
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the project in the projects array if it exists
        const index = state.projects.findIndex(p => p._id === action.payload.data._id);
        if (index !== -1) {
          state.projects[index] = action.payload.data;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Project lifecycle
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted project from the projects array
        state.projects = state.projects.filter(p => p._id !== action.meta.arg);
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default projectSlice.reducer;
