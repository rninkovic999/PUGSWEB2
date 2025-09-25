import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getQuizByIdWithAnswers } from "../../services/quizService";
import { createQuizWithAnswersModel } from "../../models/getQuizByIdWithAnswersResponseModel";
import { createFieldErrorObject } from "../../models/fieldErrorModel";
import QuizDetails from "./QuizDetails";
import QuestionsList from "./QuestionsList";
import EditQuizButton from "./EditQuizButton";

const EditQuiz = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const { ok, data } = await getQuizByIdWithAnswers(quizId);
      if (!ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setFieldErrors(createFieldErrorObject(data.errors));
        } else {
          setGeneralError(
            data.message || data.detail || "Failed to load quiz."
          );
        }
        setLoading(false);
        return;
      }

      setQuiz(createQuizWithAnswersModel(data));
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (!quiz)
    return <p className="text-center text-red-600 mt-10">{generalError}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Edit Quiz: {quiz.title}
      </h2>
      <QuizDetails quiz={quiz} />
      <QuestionsList questions={quiz.questions} />
      <EditQuizButton quizId={quiz.id} />
    </div>
  );
};

export default EditQuiz;
