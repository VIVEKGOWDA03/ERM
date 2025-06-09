import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const baseUrl = "https://erm-kok7.onrender.com/api";


const initialState = {
  projects: [],          
  selectedProject: null,  
  isLoading: false,       
  error: null,            
};


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

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, updatedData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.put(`${baseUrl}/projects/${projectId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; 
    } catch (error) {
      console.error(`Failed to update project ${projectId}:`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || `Failed to update project ${projectId}`);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.delete(`${baseUrl}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
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
      .addCase(fetchProjectById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedProject = null; 
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.selectedProject = null;
      })
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
      
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isLoading = false;
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
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false;
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
