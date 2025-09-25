import React from "react";
import CreateQuiz from "../components/CreateQuiz/index";
import AdminQuizList from "../components/AdminQuizList/AdminQuizList";

const AdminQuizPage = () => {
  return (
    <>
      <CreateQuiz />
      <AdminQuizList />
    </>
  );
};

export default AdminQuizPage;
