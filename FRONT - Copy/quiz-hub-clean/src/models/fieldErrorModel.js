export const createFieldErrorObject = (errorsArray) => {
  const errors = {};
  for (const error of errorsArray) {
    errors[error.name] = error.reason;
  }
  return errors;
};
