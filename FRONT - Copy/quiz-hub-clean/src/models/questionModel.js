export const createQuestionRequest = ({
  quizId,
  text,
  type,
  options = [],
  correctOptionIndex = 0,
  correctOptionIndices = [],
  correctAnswerBool = true,
  correctAnswerText = "",
}) => ({
  quizId,
  text,
  type,
  options,
  correctOptionIndex,
  correctOptionIndices,
  correctAnswerBool,
  correctAnswerText,
});
