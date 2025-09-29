export const createUpdateUserForm = (userData) => {
  const form = new FormData();
  
  form.append("Username", userData.Username);
  form.append("FullName", userData.FullName);
  form.append("Email", userData.Email);
  
  if (userData.Password) {
    form.append("Password", userData.Password);
  }
  
  if (userData.ProfilePicture) {
    form.append("ProfilePicture", userData.ProfilePicture);
  }
  
  return form;
};