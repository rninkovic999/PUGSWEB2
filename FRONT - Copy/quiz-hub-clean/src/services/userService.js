import { createRegisterRequestForm } from "../models/registerRequestModel";
import { createUpdateUserForm } from "../models/updateUserModel";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const loginUser = async (loginRequest) => {
  return await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  });
};

export const registerUser = async (formData) => {
  const form = createRegisterRequestForm(formData);
  return await fetch(`${API_URL}/users/create`, {
    method: "POST",
    body: form,
  });
};

export const fetchUserProfilePicture = async (token) => {
  const API_URL = process.env.REACT_APP_BACKEND_API_URL;
  const response = await fetch(`${API_URL}/users/profilepicture`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid profile picture response");
  }
  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("access_token");
  return await fetch(`${API_URL}/users/current`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
};

export const updateUser = async (formData) => {
  const token = localStorage.getItem("access_token");
  const form = createUpdateUserForm(formData);
  
  return await fetch(`${API_URL}/users/update`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form
  });
};

export const getUserResults = async (userId) => {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_API_URL}/users/result/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user results");
  }
  return await response.json();
};