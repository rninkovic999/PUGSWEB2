export const createLoginResponse = (success, token, message = "") => ({
  success,
  token,
  message,
});
