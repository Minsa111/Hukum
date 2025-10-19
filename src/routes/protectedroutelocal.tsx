import React from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "@/controllers/auth/authcontroller"; // adjust path if needed

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
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// ✅ Only allow access if NOT logged in
export const ProtectedLoginRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired } = validateToken();

  if (valid && !expired) {
    // If already logged in and token valid, go straight to dashboard
    return <Navigate to="/admin" replace />;
  }

  // If token missing or expired, allow access to login page
  return <>{children}</>;
};
