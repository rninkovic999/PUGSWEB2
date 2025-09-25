import React from "react";
import { Route } from "react-router-dom";
import SecondaryLayout from "../layouts/SecondaryLayout";
import GuestRoute from "../components/Route/GuestRoute";

const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));

export const secondaryRoutes = (
  <Route path="/" element={<SecondaryLayout />}>
    <Route
      path="register"
      element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      }
    />
    <Route
      path="login"
      element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      }
    />
  </Route>
);
