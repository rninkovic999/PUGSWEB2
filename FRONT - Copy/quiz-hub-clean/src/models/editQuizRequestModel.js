export const createEditQuizRequest = ({
  id,
  title,
  description,
  category,
  timeLimitSeconds,
  difficulty,
  questions,
}) => ({
  id,
  title,
  description,
  category,
  timeLimitSeconds,
  difficulty,
  questions,
});
