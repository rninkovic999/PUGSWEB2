import React from "react";
import UserProfile from "../components/UserProfile/UserProfile";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { id } = useParams();

  return <UserProfile userId={id} />;
};

export default ProfilePage;
