import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Only allow access if logged in
export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

// Only allow access if NOT logged in
export const ProtectedLoginRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};
