import React from "react";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  1: { label: "Easy", color: "bg-green-500" },
  2: { label: "Medium", color: "bg-yellow-500" },
  3: { label: "Hard", color: "bg-red-500" },
};

const QuizCard = ({ quiz, onDelete }) => {
  const navigate = useNavigate();
  const difficulty = difficultyColors[quiz.difficulty] || {
    label: "Unknown",
    color: "bg-gray-400",
  };

  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col justify-between">
      <div className="p-4">
        <h3 className="text-lg font-semibold">{quiz.title}</h3>
        <p className="text-gray-600 mt-2">{quiz.description}</p>
        <p className="text-sm text-gray-500 mt-1">Category: {quiz.category}</p>
        <p className="text-sm text-gray-500 mt-1">
          Time Limit: {quiz.timeLimitSeconds} seconds
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Questions: {quiz.questionCount}
        </p>
      </div>

      <div className="flex justify-between items-center px-4 pb-4 gap-2 flex-wrap">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          onClick={() => onDelete(quiz.id)}
        >
          Delete
        </button>
        <button
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
          onClick={() => navigate(`/quiz/add-question/${quiz.id}`)}
        >
          Add Question
        </button>
        <button
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
          onClick={() => navigate(`/quiz-result/admin/${quiz.id}`)}
        >
          See More
        </button>
      </div>

      <div
        className={`w-full text-center py-2 text-white font-semibold ${difficulty.color}`}
      >
        {difficulty.label}
      </div>
    </div>
  );
};

export default QuizCard;
