import React from "react";
import { useParams } from "react-router-dom";
import AddQuestion from "../components/AddQuestion/index";

const AddQuestionPage = () => {
  const { quizId } = useParams();
  return <AddQuestion quizId={quizId} />;
};

export default AddQuestionPage;
