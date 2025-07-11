import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

// Initial state
const initialState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  token: null,
};

// Use the API base URL from environment variables
const baseUrl = import.meta.env.VITE_API_BASE_URL;
// const baseUrl = "https://erm-kok7.onrender.com/api";



// Async thunk for registration
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/register`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);


// Async thunk for login
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, formData, {
        withCredentials: true,
      });
      return response.data;
      console.log(response.data, "response.data");
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${baseUrl}/auth/logout`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// Async thunk for auth check
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}/auth/check-auth`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Authentication check failed:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Authentication failed");
    }
  }
);

// Update Profile Picture
export const updateProfilePicture = createAsyncThunk(
  "auth/updateProfilePic",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      formData.append("userId", userId);

      const token = sessionStorage.getItem("token");

      const response = await axios.put(
        `${baseUrl}/auth/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile update failed");
    }
  }
);

// Update Additional Details (Address, Designation, Phone Number)
export const updateAdditionalDetails = createAsyncThunk(
  "auth/updateAdditionalDetails",
  async (
    { userId, address, designation, phoneNumber },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${baseUrl}/auth/additionalDetails/${userId}`, // Ensure userId is in URL
        { address, designation, phoneNumber },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      // Get token from sessionStorage (or wherever you store it)
      const token = sessionStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axios.get(`${baseUrl}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      return response.data.user; // Assuming API returns { success: true, user: { ... } }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user"
      );
    }
  }
);

// Slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Use this reducer to manually set user data
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    // Reset user data and token
    resetTokenAndCredentials: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Assume the API sends a success flag and user data
        state.token = action.payload.token;
        state.user = action.payload.success ? action.payload.data : null;
        state.isAuthenticated = action.payload.success || false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
        state.isAuthenticated = false;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Store the token in Redux state and sessionStorage
        state.token = action.payload.token;
        sessionStorage.setItem("token", action.payload.token);
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload?.message || "Login failed";
        state.isAuthenticated = false;
        state.token = null;
      })
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
    builder.addCase(updateProfilePicture.fulfilled, (state, action) => {
      state.user = { ...state.user, profilePic: action.payload.profilePic };
      localStorage.setItem("user", JSON.stringify(state.user));
    });

    builder
      .addCase(updateAdditionalDetails.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(fetchUser.pending, (state) => {
        state.error = null;
      })
      // fetchUser fulfilled
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      // fetchUser rejected
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, resetTokenAndCredentials } = authSlice.actions;
export default authSlice.reducer;
