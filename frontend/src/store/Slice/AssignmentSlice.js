import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
// const baseUrl = "https://erm-kok7.onrender.com/api";


const initialState = {
  assignments: [],       
  myAssignments: [],     
  isLoading: false,      
  error: null,          
};


// Fetch all assignments (typically for managers)
export const fetchAllAssignments = createAsyncThunk(
  'assignments/fetchAllAssignments',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.get(`${baseUrl}/assignments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch all assignments:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all assignments');
    }
  }
);

// Fetch assignments for the logged-in engineer
export const fetchMyAssignments = createAsyncThunk(
  'assignments/fetchMyAssignments',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || sessionStorage.getItem("token");
      const userId = auth.user?.id;

      if (!token || !userId) return rejectWithValue('Authentication data missing.');
      if (auth.user?.role !== 'engineer') return rejectWithValue('Only engineers can fetch their own assignments.');

      const response = await axios.get(`${baseUrl}/assignments/my/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch my assignments:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch my assignments');
    }
  }
);

// Create a new assignment
export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async (assignmentData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue('No authentication token found.');

      const response = await axios.post(`${baseUrl}/assignments/new`, assignmentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; 
    } catch (error) {
      console.error('Failed to create assignment:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to create assignment');
    }
  }
);


const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAllAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myAssignments = action.payload; 
      })
      .addCase(fetchMyAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentSlice.reducer;
