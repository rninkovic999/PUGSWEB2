import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("access_token");

export const removeToken = () => localStorage.removeItem("access_token");

export const isTokenValid = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

export const checkAndCleanToken = () => {
  const token = getToken();
  if (!token || !isTokenValid(token)) {
    removeToken();
    return false;
  }
  return true;
};

export const isAuthenticated = () => {
  const token = getToken();
  return token && isTokenValid(token);
};

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.UserId || null;
  } catch {
    return null;
  }
};

export const getUserRoleFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return (
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    );
  } catch {
    return null;
  }
};

export const getUsernameFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return (
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      null
    );
  } catch {
    return null;
  }
};
