import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/app/store";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const auth = useSelector((state: RootState) => state.auth);

  // 1. Wait for rehydration to complete
  if (!auth._persist?.rehydrated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // 2. After rehydration, check for the user
  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  console.log("User Role:", auth.user.role);
  // 3. If a user exists, check their role
  if (!allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. If all checks pass, render the requested component
  return <>{children}</>;
};

export default ProtectedRoute;
