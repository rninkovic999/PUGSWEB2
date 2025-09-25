import React, { useEffect, useState } from "react";
import { getTopResultsForQuiz } from "../../services/resultService";
import PeriodFilter from "./PeriodFilter";
import LeaderboardTable from "./LeaderboardTable";

const QuizLeaderboard = ({ quizId }) => {
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getTopResultsForQuiz(quizId, period);
        setEntries(data.entries);
        setError("");
      } catch (err) {
        setError(err.message);
        console.error("Error fetching leaderboard:", err);
      }
    };

    if (quizId) {
      fetchLeaderboard();
    }
  }, [quizId, period]);

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Quiz Leaderboard</h1>
      <PeriodFilter period={period} setPeriod={setPeriod} />
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {entries.length === 0 ? (
        <p className="text-center text-gray-600">
          No leaderboard data available.
        </p>
      ) : (
        <LeaderboardTable entries={entries} />
      )}
    </div>
  );
};

export default QuizLeaderboard;
