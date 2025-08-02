// 📂routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // ["super-admin", "prime-admin", ...]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  
  return <>{children}</>;
};

export default ProtectedRoute;
