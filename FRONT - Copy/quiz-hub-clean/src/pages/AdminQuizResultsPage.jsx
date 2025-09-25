import React from "react";
import AdminQuizResults from "../components/AdminQuizResults/AdminQuizResults";
import { useParams } from "react-router-dom";

const AdminQuizResultsPage = () => {
  const { quizId } = useParams();

  return <AdminQuizResults quizId={quizId} />;
};

export default AdminQuizResultsPage;
