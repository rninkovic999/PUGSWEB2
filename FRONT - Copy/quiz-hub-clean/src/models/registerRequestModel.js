export const createRegisterRequestForm = (formData) => {
  const form = new FormData();
  for (const key in formData) {
    if (formData[key]) {
      form.append(key, formData[key]);
    }
  }
  return form;
};
