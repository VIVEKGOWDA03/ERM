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
      return response.data.data; 
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
      return response.data.data; 
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

export const fetchAllUsers = createAsyncThunk(
  "data/fetchAllUsers", // Action type prefix
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token || sessionStorage.getItem("token");
      if (!token) return rejectWithValue("No authentication token found.");

      const response = await axios.get(`${baseUrl}/engineers/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; 
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
      .addCase(fetchEngineerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedEngineer = null;
      })
      .addCase(fetchEngineerById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEngineer = action.payload; 
      })
      .addCase(fetchEngineerById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.selectedEngineer = null;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default dataSlice.reducer;
