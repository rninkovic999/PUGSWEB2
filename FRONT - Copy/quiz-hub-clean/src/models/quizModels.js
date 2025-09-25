export const createQuizModel = ({
  id = "",
  title = "",
  description = "",
  category = "",
  timeLimitSeconds = 0,
  difficulty = 1,
  createdByUserId = "",
  questionCount = 0,
} = {}) => ({
  id,
  title,
  description,
  category,
  timeLimitSeconds,
  difficulty,
  createdByUserId,
  questionCount,
});

export const createQuizWithQuestionsModel = ({
  id = "",
  title = "",
  description = "",
  category = "",
  timeLimitSeconds = 0,
  difficulty = 1,
  questions = [],
} = {}) => ({
  id,
  title,
  description,
  category,
  timeLimitSeconds,
  difficulty,
  questions: questions.map((q) => ({
    id: q.id,
    quizId: q.quizId,
    text: q.text,
    type: q.type,
    options: q.options || [],
  })),
});
