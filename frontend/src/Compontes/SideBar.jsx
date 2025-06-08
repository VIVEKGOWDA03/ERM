import React, { useState } from "react";
import {
  // Removed Drawer, IconButton, List, ListItem, ListItemText as they are not used in this version of SideBar
} from "@mui/material"; // Material-UI imports removed as this SideBar uses Tailwind directly

// No longer using BusinessRoundedIcon or icons from @mui/icons-material
// Removed Home, FormInputIcon, ListCheckIcon, LogOut, MenuIcon from lucide-react
// Using react-icons/ri as per your provided code
import {
  RiDashboardLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiFolderOpenLine, // Icon for Projects
  RiClipboardLine, // Icon for Assignments
  RiTeamLine // Optional: Icon for Engineers/Team Management
} from "react-icons/ri"; // Using Remix Icons (Ri)

import { Link, useNavigate } from "react-router-dom"; // Link and useNavigate from react-router-dom
import { ImProfile } from "react-icons/im"; // Profile icon from react-icons/im
import { resetTokenAndCredentials } from "../store/auth-slice/index"; // Adjust path if needed
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast"; // For toast notifications

export default function SideBar() {
  // Removed `open` state as this SideBar is not a Drawer
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get the logged-in user details

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    toast.success("Logged out Successfully");
    sessionStorage.clear(); // Clear session storage completely on logout
    navigate("/auth/login");
  };
  console.log(user.role,user.id);
  

  // Function to handle profile navigation based on user role
  const handleProfileNavigation = () => {
    if (user && user.id) {
      if (user.role === 'manager') {
        navigate(`/manager-profile`); 
      } else if (user.role === 'engineer') {
        navigate(`/engineers/${user.id}`); // Navigate to existing EngineerProfile
      }
    } else {
      console.warn("User ID not found for profile navigation.");
      toast.error("Could not find user profile. Please try logging in again.");
      navigate("/auth/login"); // Redirect to login if user data is missing
    }
    // Removed toggleDrawer(false)(); as this sidebar is not a drawer
  };

  return (
    <div className="w-64 h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl flex flex-col transition-all duration-300 ease-in-out">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-6 border-b border-gray-700/50">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-105">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{user?.name?.charAt(0).toUpperCase() || 'G'}</span> 
          )}
        </div>

        <p className="mt-4 text-xl font-semibold text-gray-100 truncate w-full text-center">
          {user?.name || "Guest User"}
        </p>
        <p className="text-sm font-medium text-gray-400 capitalize">
          {user?.role || "Role"}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {/* General Links Section */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">General</p>
          <li>
            <Link
              to={user?.role === "manager" ? "/manager-dashboard" : "/engineer-dashboard"}
              className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
            >
              <RiDashboardLine className="mr-3 text-xl group-hover:scale-110 transition-transform" />
              <span className="font-medium text-lg">Dashboard</span>
            </Link>
          </li>
          <li>
            {/* Changed to a button with onClick, and the Link now only provides styling */}
            <button
              onClick={handleProfileNavigation}
              className="w-full flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
            >
              <RiUserLine className="mr-3 text-xl group-hover:scale-110 transition-transform" />
              <span className="font-medium text-lg">Profile</span>
            </button>
          </li>

          {/* Project & Assignment Section */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">Management</p>
          {user?.role === "manager" && ( // Show "Engineers" only for Managers
            <>
              <li>
                <Link
                  to="/engineers" // Assuming a route for all engineers for managers to view
                  className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiTeamLine className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-lg">Engineers</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/projects" // Assuming a route for Projects list
                  className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiFolderOpenLine className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-lg">Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/assignments/new" // Assuming a route for creating assignments
                  className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiClipboardLine className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-lg">Assign Engineer</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/assignments" // Assuming a route for all assignments for managers
                  className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiClipboardLine className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-lg">All Assignments</span>
                </Link>
              </li>
            </>
          )}

          {/* Add more navigation links here */}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700/50 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg bg-red-600 text-white font-medium text-lg justify-center hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
        >
          <RiLogoutBoxRLine className="mr-3 text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
}
