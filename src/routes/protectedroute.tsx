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
    return <Navigate to="/auth/login" replace />;
  }
  
  console.log(valid,"and", expired);
  return <>{children}</>;
};

export const ProtectedLoginRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired } = validateToken();

  if (valid && !expired) {
    console.log(valid,"and", expired);
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};
