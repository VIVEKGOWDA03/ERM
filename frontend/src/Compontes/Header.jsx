import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useMatches } from "react-router-dom";

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const displayName = user?.name || "Guest User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const location = useLocation();
  const matches = useMatches();

  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    const currentMatch = matches.find(
      (match) => match.pathname === location.pathname
    );

    const titleMap = {
      "/manager-dashboard": "Manager Dashboard",
      "/engineer-dashboard": "Engineer Dashboard",
      [`/engineers/${user?._id}`]: "My Profile",
      "/engineers": "All Engineers",
      "/projects": "Projects Overview",
      "/assignments": "My Assignments",
      "/auth/login": "Login",
      "/auth/register": "Register",
      "/unauth-page": "Unauthorized",
    };

    let newTitle = titleMap[location.pathname];

    if (
      !newTitle &&
      location.pathname.startsWith("/engineers/") &&
      location.pathname !== `/engineers/${user?._id}`
    ) {
      newTitle = "Engineer Profile";
    }

    if (!newTitle) {
      const pathSegments = location.pathname
        .split("/")
        .filter((segment) => segment);
      newTitle =
        pathSegments.length > 0
          ? pathSegments[0]
              .replace(/-/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          : "Home";
    }

    setPageTitle(newTitle);
  }, [location.pathname, matches, user]);

  return (
    <header className="flex font-roboto items-center justify-between px-4 sm:px-6 py-3 bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-md sticky top-0 z-20">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-100 truncate">
        {pageTitle}
      </h1>

      <div className="flex items-center space-x-3">
        <span className="hidden sm:inline-block text-sm sm:text-base font-medium text-gray-200">
          Welcome, {displayName?.split(" ")[0]}!
        </span>

        {/* Avatar */}
        {/* <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-inner overflow-hidden ring-2 ring-blue-400">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{avatarInitial}</span>
      )}
    </div> */}
      </div>
    </header>
  );
};

export default Header;
