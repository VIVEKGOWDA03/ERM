import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, children, user }) {
  const location = useLocation();

  console.log(isAuthenticated, "hello");

  if (
    !isAuthenticated &&
    !location.pathname.includes("/login") &&
    !location.pathname.includes("/register")
  ) {
    return <Navigate to="/auth/login" replace />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    if (user?.role === "manager") {
      return <Navigate to="/manager-dashboard" replace />;
    } else if (user?.role === "engineer") {
      return <Navigate to="/engineer-dashboard" replace />;
    }
    return <Navigate to="/" replace />; // Redirect to root path
  }

  return <>{children}</>;
}

export default CheckAuth;
