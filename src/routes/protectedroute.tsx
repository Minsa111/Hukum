import React from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "@/controllers/auth/authcontroller"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired } = validateToken();

  if (!valid || expired) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("username");
    localStorage.removeItem("school_id");
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("isLoggedIn", "false");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const ProtectedLoginRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired } = validateToken();

  if (valid && !expired) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};
