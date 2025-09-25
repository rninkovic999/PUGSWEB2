import React, { useEffect, useState } from "react";
import { getQuizResultsByQuizId } from "../../services/quizResultService";
import { useNavigate } from "react-router-dom";
import QuizResultsTable from "./QuizResultsTable";
import ErrorMessage from "./ErrorMessage";

const AdminQuizResults = ({ quizId }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getQuizResultsByQuizId(quizId);
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (quizId) fetchResults();
  }, [quizId]);

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>
      {error && <ErrorMessage message={error} />}
      {results.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <QuizResultsTable results={results} onSeeMore={navigate} />
      )}
    </div>
  );
};

export default AdminQuizResults;
