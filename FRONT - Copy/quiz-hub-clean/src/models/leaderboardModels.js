export const createUserLeaderboardDto = (raw) => ({
  username: raw.username,
  profilePicture: raw.profilePicture,
  profilePictureContentType: raw.profilePictureContentType,
  globalScore: raw.globalScore,
});
