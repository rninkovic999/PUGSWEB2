export const createProfilePictureResponse = (data) => {
  return {
    success: data.success,
    profilePicture: data.profilePicture,
    profilePictureContentType: data.profilePictureContentType,
  };
};
