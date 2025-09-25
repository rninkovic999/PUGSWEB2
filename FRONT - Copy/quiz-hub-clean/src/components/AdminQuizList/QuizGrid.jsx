import React from "react";
import QuizCard from "./QuizCard";

const QuizGrid = ({ quizzes, onDelete }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {quizzes.map((quiz) => (
      <QuizCard key={quiz.id} quiz={quiz} onDelete={onDelete} />
    ))}
  </div>
);

export default QuizGrid;
