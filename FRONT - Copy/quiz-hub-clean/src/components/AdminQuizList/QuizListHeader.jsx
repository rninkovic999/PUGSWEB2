import React from "react";

const QuizListHeader = ({ error }) => (
  <>
    <h2 className="text-2xl text-center font-bold mb-4">Created Quizzes</h2>
    {error && (
      <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
    )}
  </>
);

export default QuizListHeader;
