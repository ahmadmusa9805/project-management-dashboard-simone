import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();

  // Example: Replace this with logic from context or Redux
  const userRole = localStorage.getItem("role"); // e.g., 'super_admin', 'client', etc.
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    // If not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole || "")) {
    // If role not allowed, redirect to unauthorized or login
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
