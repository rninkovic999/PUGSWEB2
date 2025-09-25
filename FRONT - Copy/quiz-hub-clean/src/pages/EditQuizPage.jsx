import React from "react";
import { useParams } from "react-router-dom";
import EditQuiz from "../components/EditQuiz/EditQuiz";

const EditQuizPage = () => {
  const { quizId } = useParams();
  return <EditQuiz quizId={quizId} />;
};

export default EditQuizPage;
