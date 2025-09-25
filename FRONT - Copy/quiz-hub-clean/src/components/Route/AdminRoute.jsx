import React from "react";
import { Navigate } from "react-router-dom"; // Add this line!

import {
  isAuthenticated,
  getUserRoleFromToken,
} from "../../services/authService";

const AdminRoute = ({ children }) => {
  if (!isAuthenticated() || getUserRoleFromToken() !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
