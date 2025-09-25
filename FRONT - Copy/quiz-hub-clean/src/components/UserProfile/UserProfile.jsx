import React, { useEffect, useState } from "react";
import { getUserResults } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import ResultTable from "./ResultTable";
import NoResults from "./NoResults";

const UserProfile = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getUserResults(userId);
        const sorted = res.results.sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
        setResults(sorted);
      } catch (err) {
        setError(err.message || "Failed to load results.");
      }
    };

    fetchResults();
  }, [userId]);

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">My Results</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {results.length === 0 ? (
        <NoResults />
      ) : (
        <ResultTable results={results} navigate={navigate} />
      )}
    </div>
  );
};

export default UserProfile;
