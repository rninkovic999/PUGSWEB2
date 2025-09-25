import React from "react";

const QuizDetails = ({ quiz }) => {
  return (
    <div className="mb-4 space-y-1">
      <p>
        <strong>Description:</strong> {quiz.description}
      </p>
      <p>
        <strong>Category:</strong> {quiz.category}
      </p>
      <p>
        <strong>Time Limit:</strong> {quiz.timeLimitSeconds} seconds
      </p>
      <p>
        <strong>Difficulty:</strong>{" "}
        {["Easy", "Medium", "Hard"][quiz.difficulty - 1]}
      </p>
      <hr className="my-4" />
    </div>
  );
};

export default QuizDetails;
