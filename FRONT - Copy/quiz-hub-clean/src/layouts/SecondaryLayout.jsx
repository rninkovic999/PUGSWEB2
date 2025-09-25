import React from "react";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
