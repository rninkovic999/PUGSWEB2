import React, { useEffect, useState } from "react";
import { getAdminQuizzes, deleteQuiz } from "../../services/quizService";
import { createQuizModel } from "../../models/quizModels";
import QuizListHeader from "./QuizListHeader";
import QuizGrid from "./QuizGrid";

const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getAdminQuizzes();
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch quizzes.");

        setQuizzes(data.map(createQuizModel));
      } catch (err) {
        setError(err.message || "Unexpected error occurred.");
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete quiz.");
      }
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    }
  };

  return (
    <div className="mt-10 px-4 max-w-7xl mx-auto">
      <QuizListHeader error={error} />
      <QuizGrid quizzes={quizzes} onDelete={handleDelete} />
    </div>
  );
};

export default AdminQuizList;
