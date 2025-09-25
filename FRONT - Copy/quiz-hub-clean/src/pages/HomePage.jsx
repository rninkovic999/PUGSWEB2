import React from "react";
import { isAuthenticated } from "../services/authService";
import GuestHomeContent from "../components/Hero/GuestHomeContent";
import UserHomeContent from "../components/Hero/UserHomeContent";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {isAuthenticated() ? <UserHomeContent /> : <GuestHomeContent />}
    </div>
  );
};

export default HomePage;