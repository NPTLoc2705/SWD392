import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const AdminRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user || user.role !== "Admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AdminRoute; 