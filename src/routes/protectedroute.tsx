import React from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "@/controllers/auth/login"; // adjust path if needed

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ✅ Only allow access if token is valid
export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired } = validateToken();

  if (!valid || expired) {
    // If token invalid or expired, clear and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};

export const ProtectedLoginRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired } = validateToken();

  if (valid && !expired) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
