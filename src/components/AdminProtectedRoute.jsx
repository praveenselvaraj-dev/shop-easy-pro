import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const { user, token } = useSelector((s) => s.user);

  if (!token) return <Navigate to="/login" replace />;

  const role = user.role;
  console.log("role:", role);

  if (role !== "admin") return <Navigate to="/home" replace />;

  return children;
}
