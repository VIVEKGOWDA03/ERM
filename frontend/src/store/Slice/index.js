import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const baseUrl =import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const baseUrl = "https://erm-kok7.onrender.com/api";


const initialState = {
  engineers: [],
  users: [],
  selectedEngineer: null,
  isLoading: false,
  error: null,
};

export const fetchAllEngineers = createAsyncThunk(
  "data/fetchAllEngineers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(`${baseUrl}/engineers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // This data will contain engineers with nested assignments/projects
    } catch (error) {
      console.error(
        "Failed to fetch engineers:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch engineers"
      );
    }
  }
);

// Fetch a single engineer by ID (now includes assignments from backend)
export const fetchEngineerById = createAsyncThunk(
  "data/fetchEngineerById",
  async (engineerId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(`${baseUrl}/engineers/${engineerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // This will now contain engineer with nested assignments
    } catch (error) {
      console.error(
        `Failed to fetch engineer ${engineerId}:`,
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message ||
          `Failed to fetch engineer ${engineerId}`
      );
    }
  }
);

// Fetch all users (engineers and managers) for general lists/dropdowns
export const fetchAllUsers = createAsyncThunk(
  "data/fetchAllUsers", // Action type prefix
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(`${baseUrl}/engineers/users`, {
        // Updated to /engineers/all-users as discussed
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // This data will now contain both engineers and managers
    } catch (error) {
      console.error(
        "Failed to fetch all users:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all users"
      );
    }
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Engineers
      .addCase(fetchAllEngineers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllEngineers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.engineers = action.payload;
      })
      .addCase(fetchAllEngineers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch Engineer By ID
      .addCase(fetchEngineerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedEngineer = null; // Clear previous engineer data
      })
      .addCase(fetchEngineerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEngineer = action.payload; // Store the fetched engineer
      })
      .addCase(fetchEngineerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.selectedEngineer = null;
      })
      // Fetch All Users (General)
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload; // Store in 'users' property
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
