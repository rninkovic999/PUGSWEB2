export const createQuizRequest = (
  title,
  description,
  category,
  timeLimitSeconds,
  difficulty
) => {
  return {
    title,
    description,
    category,
    timeLimitSeconds,
    difficulty,
  };
};
