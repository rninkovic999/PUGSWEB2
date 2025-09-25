import React from "react";
import QuizLeaderboard from "../components/QuizLeaderboard/index";
import { useParams } from "react-router-dom";

const QuizLeaderboardPage = () => {
  const { id } = useParams();
  return <QuizLeaderboard quizId={id} />;
};

export default QuizLeaderboardPage;
