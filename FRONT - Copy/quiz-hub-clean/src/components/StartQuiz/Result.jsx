import React from "react";

const formatAnswer = (answer, question, isCorrectAnswer = false) => {
  if (answer === undefined || answer === null) {
    return isCorrectAnswer ? "Correct Answer" : "Not answered";
  }

  if (question.type === "MultipleChoice" && Array.isArray(answer)) {
    return answer
      .map((i) => question.options[i - 1] ?? `[invalid index ${i}]`)
      .join(", ");
  }

  if (question.type === "SingleChoice" && typeof answer === "number") {
    return question.options[answer - 1] ?? `[invalid index ${answer}]`;
  }

  if (question.type === "TrueFalse") {
    return answer === true || answer === "true"
      ? "True"
      : answer === false || answer === "false"
      ? "False"
      : "Invalid";
  }

  return String(answer);
};

const Result = ({ result, quiz }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-xl font-bold">Results:</p>
      <p>
        Correct Answers: {result.correctAnswers} / {result.totalQuestions}
      </p>
      <p>Score: {result.score}%</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Details:</h3>
        {quiz.questions.map((q) => {
          const userAnswer = result.answers.find((a) => a.questionId === q.id);
          const isCorrect = userAnswer?.isCorrect;

          return (
            <div
              key={q.id}
              className={`p-3 border rounded mb-2 ${
                isCorrect ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold">{q.text}</p>
              <p>
                <strong>Your Answer:</strong>{" "}
                {formatAnswer(userAnswer?.answer, q, false)}
              </p>
              <p>
                <strong>Correct Answer:</strong>{" "}
                {formatAnswer(userAnswer?.correctAnswer, q, true)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Result;
