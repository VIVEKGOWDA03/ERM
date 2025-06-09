import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/auth-slice";
import toast from "react-hot-toast";

const Register = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    role: "engineer",
    skills: "",
    seniority: "junior",
    maxCapacity: 100,
    department: "",
  };

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;

    // Convert to number if maxCapacity field
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxCapacity" ? parseInt(value) : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      role,
      skills,
      seniority,
      maxCapacity,
      department,
    } = formData;

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !skills ||
      !seniority ||
      !maxCapacity ||
      !department
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const skillsArray = skills.split(",").map((s) => s.trim());

    dispatch(registerUser({ ...formData, skills: skillsArray }))
      .then((data) => {
        const message = data?.payload?.message;
        const success = data?.payload?.success;
        const user = data.payload?.user; // Contains user data if successful
        const role = user?.role; // Get the user's role

        if (success) {
          toast.success("Logged in Successfully!");
          // Navigate based on user role
          if (role === "manager") {
            navigate("/manager-dashboard"); // Navigate to manager dashboard
          } else if (role === "engineer") {
            navigate("/engineer-dashboard"); // Navigate to engineer dashboard
          } else {
            // Fallback for unexpected roles or initial setup
            navigate("*");
          }
        } else {
          // Display error message from the backend
          toast.error(
            message || "Login failed. Please check your credentials."
          );
        }
      })
      .catch((err) => {
        console.error("Registration error:", err);
        toast.error("Unexpected error occurred.");
      });
  };

  return (
    <div className="mx-auto p-[4%] bg-transparent shadow-lg bg-white rounded-lg z-20 border border-white/20 backdrop-blur-sm w-full max-w-md space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tighter text-gray-800">
          Create new account
        </h1>
        <p className="mt-2 text-gray-600">
          Already have an account?
          <Link
            to="/auth/login"
            className="ml-2 font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Custom Form (Replaces CommonForm) */}
      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="role"
          value={formData.role}
          onChange={onChange}
          className="w-full border p-2 rounded"
        >
          <option value="engineer">Engineer</option>
          <option value="manager">Manager</option>
        </select>

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated)"
          value={formData.skills}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="seniority"
          value={formData.seniority}
          onChange={onChange}
          className="w-full border p-2 rounded"
        >
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>

        <select
          name="maxCapacity"
          value={formData.maxCapacity}
          onChange={onChange}
          className="w-full border p-2 rounded"
        >
          <option value={100}>Full-time </option>
          <option value={50}>Part-time </option>
        </select>

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={onChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
