import React from "react";
import { useNavigate } from "react-router-dom";

const EditQuizButton = ({ quizId }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/quiz/edit-form/${quizId}`)}
      className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Edit Form Fields
    </button>
  );
};

export default EditQuizButton;
