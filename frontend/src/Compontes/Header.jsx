import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useMatches } from "react-router-dom"; // Import useMatches for route data

const Header = () => {
  const { user } = useSelector((state) => state.auth); // Get user data from Redux
  const displayName = user?.name || "Guest User";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const location = useLocation(); // To get current path
  const matches = useMatches(); // To get route data including path

  // State to hold the dynamic page title
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // This effect runs when the route changes
    const currentMatch = matches.find(match => match.pathname === location.pathname);

    // Define a mapping for pathnames to display titles
    const titleMap = {
      "/manager-dashboard": "Manager Dashboard",
      "/engineer-dashboard": "Engineer Dashboard",
      [`/engineers/${user?._id}`]: "My Profile", // Dynamic profile title
      "/engineers": "All Engineers", // Assuming you add this route for managers
      "/projects": "Projects Overview",
      "/assignments": "My Assignments",
      "/auth/login": "Login",
      "/auth/register": "Register",
      "/unauth-page": "Unauthorized",
      // Add more mappings as needed
    };

    // Try to find a specific title for the current path
    let newTitle = titleMap[location.pathname];

    // Handle dynamic parts like /engineers/:id
    if (!newTitle && location.pathname.startsWith("/engineers/") && location.pathname !== `/engineers/${user?._id}`) {
        newTitle = "Engineer Profile"; // Default title for other engineer profiles
    }

    // Fallback to a default if no specific title is found
    if (!newTitle) {
      // Basic fallback: capitalize first segment or use a generic title
      const pathSegments = location.pathname.split('/').filter(segment => segment);
      newTitle = pathSegments.length > 0 ? pathSegments[0].replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Home";
    }

    setPageTitle(newTitle);
  }, [location.pathname, matches, user]); // Re-run when path or user changes

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-700 text-white shadow-md z-10 sticky top-0">
      {/* Dynamic Page Title */}
      <h1 className="text-2xl font-semibold text-gray-100">{pageTitle}</h1>

      {/* User Mini-Profile */}
      <div className="flex items-center space-x-3">
        <span className="text-lg font-medium text-gray-200 hidden sm:block">
          Welcome, {displayName.split(" ")[0]}!
        </span> {/* Hidden on small screens to save space */}

        {/* Avatar (same logic as sidebar) */}
        <div className="relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span>{avatarInitial}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;