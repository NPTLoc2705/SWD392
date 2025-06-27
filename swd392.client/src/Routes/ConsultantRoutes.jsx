import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const ConsultantRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user || user.role !== "Consultant") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ConsultantRoute;