export const createQuizResult = (data) => ({
  id: data.id,
  userId: data.userId,
  totalQuestions: data.totalQuestions,
  correctAnswers: data.correctAnswers,
  score: data.score,
  timeElapsedSeconds: data.timeElapsedSeconds,
  completedAt: new Date(data.completedAt),
});
