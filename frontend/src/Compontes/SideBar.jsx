import React, { useEffect, useState } from "react";
import {} from "@mui/material";

import {
  RiDashboardLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiFolderOpenLine,
  RiClipboardLine,
  RiTeamLine,
  RiContactsBook2Fill,
  RiFileShieldFill,
} from "react-icons/ri";

import { Link, useNavigate } from "react-router-dom";
import { ImProfile } from "react-icons/im";
import { fetchUser, resetTokenAndCredentials } from "../store/auth-slice/index";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
export default function SideBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(resetTokenAndCredentials());
    toast.success("Logged out Successfully");
    sessionStorage.clear();
    navigate("/auth/login");
  };
  // console.log(user?._id);
  useEffect(() => {
    if (!user?._id) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  const handleProfileNavigation = () => {
    if (user && user?._id) {
      if (user?.role === "manager") {
        navigate(`/manager-profile`);
      } else if (user?.role === "engineer") {
        navigate(`/engineers/${user?._id}`);
      }
    } else {
      console.warn("User ID not found for profile navigation.");
      toast.error("Could not find user profile. Please try logging in again.");
      navigate("/auth/login");
    }
  };

  return (
    <div className="w-16 md:w-64 font-roboto  h-full bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-xl flex flex-col transition-all duration-300 ease-in-out rounded-r-[20px]">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-4 border-b border-gray-700/50">
        <div className="relative w-12 h-12 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center text-xl md:text-4xl font-bold text-white shadow-lg overflow-hidden transition-all duration-300 hover:scale-105">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{user?.name?.charAt(0).toUpperCase() || "G"}</span>
          )}
        </div>

        <p className="hidden md:block mt-4 text-xl font-semibold text-gray-100 truncate w-full text-center">
          {user?.name || "Guest User"}
        </p>
        <p className="hidden md:block text-sm font-medium text-gray-400 capitalize">
          {user?.role || "Role"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-1 py-4 md:px-4 md:py-6">
        <ul className="space-y-2">
          {/* Section Title */}
          <p className="hidden md:block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">
            General
          </p>

          {/* Dashboard */}
          <li>
            <Link
              to={
                user?.role === "manager"
                  ? "/manager-dashboard"
                  : "/engineer-dashboard"
              }
              title="Dashboard"
              className="flex md:justify-start justify-center items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
            >
              <RiDashboardLine className="text-xl group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline ml-3 font-medium text-lg">
                Dashboard
              </span>
            </Link>
          </li>

          {/* Profile */}
          <li>
            <button
              onClick={handleProfileNavigation}
              title="Profile"
              className="w-full flex md:justify-start justify-center items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
            >
              <RiUserLine className="text-xl group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline ml-3 font-medium text-lg">
                Profile
              </span>
            </button>
          </li>

          {/* Manager only options */}
          {user?.role === "manager" && (
            <>
              <p className="hidden md:block text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2 px-3">
                Management
              </p>

              <li>
                <Link
                  to="/engineers"
                  title="Engineers"
                  className="flex md:justify-start justify-center items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiTeamLine className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="hidden md:inline ml-3 font-medium text-lg">
                    Engineers
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/projects"
                  title="Projects"
                  className="flex md:justify-start justify-center items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiFolderOpenLine className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="hidden md:inline ml-3 font-medium text-lg">
                    Projects
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/assignments/new"
                  title="Assign Engineer"
                  className="flex md:justify-start justify-center items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiClipboardLine className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="hidden md:inline ml-3 font-medium text-lg">
                    Assign Engineer
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/assignments"
                  title="All Assignments"
                  className="flex md:justify-start justify-center items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
                >
                  <RiFileShieldFill className="text-xl group-hover:scale-110 transition-transform" />
                  <span className="hidden md:inline ml-3 font-medium text-lg">
                    All Task
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700/50 mt-auto">
        <button
          onClick={handleLogout}
          title="Logout"
          className="flex md:justify-start justify-center items-center w-full p-3 rounded-lg bg-red-600 text-white font-medium text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 ease-in-out"
        >
          <RiLogoutBoxRLine className="text-xl" />
          <span className="hidden md:inline ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
}
