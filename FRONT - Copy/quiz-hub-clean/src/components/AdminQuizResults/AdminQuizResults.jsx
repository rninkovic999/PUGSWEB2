import React, { useEffect, useState } from "react";
import { getQuizResultsByQuizId } from "../../services/quizResultService";
import { useNavigate } from "react-router-dom";

const AdminQuizResults = ({ quizId }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getQuizResultsByQuizId(quizId);
        setResults(data);
      } catch (err) {
        setError(err.message || "Neuspešno učitavanje rezultata");
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) fetchResults();
  }, [quizId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const QuizResultRow = ({ result }) => {
    return (
      <tr className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors">
        <td className="p-4 text-white font-medium">{result.userId}</td>
        <td className="p-4 text-gray-300">
          <span className="text-yellow-400 font-semibold">
            {result.correctAnswers}/{result.totalQuestions}
          </span>
          <span className="text-gray-400 ml-2">({result.score}%)</span>
        </td>
        <td className="p-4 text-gray-300">{formatTime(result.timeElapsedSeconds)}</td>
        <td className="p-4 text-gray-300">
          {new Date(result.completedAt).toLocaleString('sr-RS')}
        </td>
        <td className="p-4">
          <button
            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
            onClick={() => navigate(`/result/details/${result.id}/admin`)}
          >
            Detaljnije
          </button>
        </td>
      </tr>
    );
  };

  const QuizResultsTable = () => {
    return (
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
        <table className="w-full table-auto text-sm text-left border-collapse bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-gray-200 font-semibold">Korisnik ID</th>
              <th className="p-4 text-gray-200 font-semibold">Rezultat</th>
              <th className="p-4 text-gray-200 font-semibold">Vreme</th>
              <th className="p-4 text-gray-200 font-semibold">Završeno</th>
              <th className="p-4 text-gray-200 font-semibold">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <QuizResultRow key={res.id} result={res} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje rezultata...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto pt-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Rezultati Kviza
        </h1>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center font-medium">
            <strong>Greška:</strong> {error}
          </div>
        )}

        {results.length === 0 && !error ? (
          <div className="text-center text-gray-400 text-lg">
            Nema rezultata za ovaj kviz.
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                Ukupno rezultata: <span className="text-yellow-400">{results.length}</span>
              </h2>
              {results.length > 0 && (
                <div className="text-sm text-gray-400">
                  Prosečan rezultat: {' '}
                  <span className="text-yellow-400 font-medium">
                    {Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)}%
                  </span>
                </div>
              )}
            </div>
            
            <QuizResultsTable />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizResults;