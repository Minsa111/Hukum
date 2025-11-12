import React from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "@/controllers/auth/authcontroller"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired, user } = validateToken();

  if (user?.role !== "instansi" && valid && !expired){
    return <Navigate to="/404" replace />
  }
  if (!valid || expired) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("username");
    localStorage.removeItem("school_id");
    localStorage.removeItem("school");
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("isLoggedIn", "false");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
export const ProtectedSuperAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired, user } = validateToken();
  console.log(user)
  if (user?.role !== "admin" && valid && !expired){
    return <Navigate to="/404" replace />
  }
  if (!valid || expired) {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("username");
    localStorage.removeItem("school_id");
    localStorage.removeItem("school");
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("isLoggedIn", "false");
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const ProtectedLoginRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { valid, expired, user} = validateToken();
  if (valid && !expired && user?.role === "instansi") {
    return <Navigate to="/admin" replace />;
  }else if (valid && !expired && user?.role === "admin") {
    return <Navigate to="/superadmin" replace />;
  }
  return <>{children}</>;
};
