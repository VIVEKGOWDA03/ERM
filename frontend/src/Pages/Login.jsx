import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from 'react-hook-form'; // Import useForm and Controller
import { zodResolver } from '@hookform/resolvers/zod'; // For Zod validation
import * as z from 'zod'; // For schema definition
import toast from "react-hot-toast";

// Material-UI Imports
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box, // For general layout containers
} from '@mui/material';

import { loginUser } from "../store/auth-slice"; // Your auth Redux slice

// --- Zod Schema for form validation ---
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }).nonempty({ message: "Email is required." }),
  password: z.string().nonempty({ message: "Password is required." }),
});


const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize react-hook-form
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values) => {
    // values object already contains email and password from the form
    const result = await dispatch(loginUser(values));

    if (result.meta.requestStatus === 'fulfilled') {
      const message = result.payload?.message;
      const success = result.payload?.success;
      const user = result.payload?.user; // Contains user data if successful
      const role = user?.role; // Get the user's role

      if (success) {
        toast.success("Logged in Successfully!");
        // Navigate based on user role
        if (role === 'manager') {
          navigate("/manager-dashboard"); // Navigate to manager dashboard
        } else if (role === 'engineer') {
          navigate("/engineer-dashboard"); // Navigate to engineer dashboard
        } else {
          // Fallback for unexpected roles or initial setup
          navigate("/"); // Navigate to root or a default home page
        }
      } else {
        // Display error message from the backend
        toast.error(message || "Login failed. Please check your credentials.");
      }
    } else {
      // Handles cases where dispatch was rejected (e.g., network error)
      toast.error(result.payload?.message || "An unexpected error occurred during login.");
    }
  };

  return (
    <Box className="flex justify-center items-center  bg-gray-10 p-4">
      <Card sx={{ maxWidth: '450px', width: '100%', boxShadow: 6, borderRadius: 2 }}>
        <CardHeader
          title={<Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'text.primary', textAlign: 'center' }}>Log in to your account</Typography>}
          subheader={
            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
              Don't have an account?
              <Link
                to="/auth/register"
                className="ml-2 font-medium text-blue-600 hover:underline"
              >
                Sign Up
              </Link>
            </Typography>
          }
          sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'grey.300', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 3 }}
        />
        <CardContent sx={{ padding: 3 }}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  error={!!fieldError}
                  helperText={fieldError ? fieldError.message : ''}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState: { error: fieldError } }) => (
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                  error={!!fieldError}
                  helperText={fieldError ? fieldError.message : ''}
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
              {form.formState.isSubmitting ? 'Logging In...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
