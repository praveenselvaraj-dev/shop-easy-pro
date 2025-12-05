import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.user.token);
  const user = useSelector((s) => s.user.user);
  if (!token) return <Navigate to="/login" replace />;
  console.log(`token -> ${token}`)
  console.log(`user -> ${JSON.stringify(user, null, 2)}`);

  return children;
}
