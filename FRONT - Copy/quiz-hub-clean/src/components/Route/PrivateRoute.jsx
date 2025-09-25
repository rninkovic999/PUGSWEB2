import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Ako nije ulogovan, preusmeri na login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
