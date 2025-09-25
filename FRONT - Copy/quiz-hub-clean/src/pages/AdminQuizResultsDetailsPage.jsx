import React from "react";
import AdminQuizResultsDetails from "../components/AdminQuizResultsDetails";
import { useParams } from "react-router-dom";

const AdminQuizResultsDetailsPage = () => {
  const { quizResultId } = useParams();

  return <AdminQuizResultsDetails quizResultId={quizResultId} />;
};

export default AdminQuizResultsDetailsPage;
