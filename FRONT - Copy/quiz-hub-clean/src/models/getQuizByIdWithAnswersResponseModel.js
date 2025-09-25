export const createQuizWithAnswersModel = (data) => ({
  id: data.id,
  title: data.title,
  description: data.description,
  category: data.category,
  timeLimitSeconds: data.timeLimitSeconds,
  difficulty: data.difficulty,
  questions: data.questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.options ?? [],
    correctOptionIndex: q.correctOptionIndex,
    correctOptionIndices: q.correctOptionIndices ?? [],
    correctAnswerBool: q.correctAnswerBool,
    correctAnswerText: q.correctAnswerText,
  })),
});
