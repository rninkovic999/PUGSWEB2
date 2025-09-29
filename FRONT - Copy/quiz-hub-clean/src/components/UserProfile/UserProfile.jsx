import React, { useEffect, useState } from "react";
import { getUserResults } from "../../services/userService";
import { useNavigate } from "react-router-dom";

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
        setError(err.message || "Neuspešno učitavanje rezultata.");
      }
    };
    fetchResults();
  }, [userId]);

  const NoResults = () => {
    return (
      <div className="text-center text-gray-400 mt-8 bg-gray-800 rounded-xl p-8 border border-gray-700">
        <div className="mb-4">
          <svg className="w-16 h-16 text-gray-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-xl text-gray-300">Nema pronađenih rezultata kvizova.</p>
        <p className="text-gray-400 mt-2">Počnite sa rešavanjem kvizova da biste videli svoje rezultate ovde.</p>
      </div>
    );
  };

  const ResultRow = ({ result, navigate }) => {
    const formattedDate = new Date(result.completedAt).toLocaleString('sr-RS', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <tr className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
        <td className="px-6 py-4 text-white font-medium">{result.quizTitle}</td>
        <td className="px-6 py-4 text-gray-300">{formattedDate}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-semibold">
              {result.correctAnswers}/{result.totalQuestions}
            </span>
            <span className="text-yellow-400 font-bold">
              ({result.score}%)
            </span>
          </div>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => navigate(`/result/details/${result.resultId}`)}
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
          >
            Prikaži detalje
          </button>
        </td>
      </tr>
    );
  };

  const ResultTable = ({ results, navigate }) => {
    return (
      <div className="overflow-x-auto rounded-xl shadow-lg bg-gray-800 border border-gray-700">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-900 text-gray-300 uppercase text-xs border-b border-gray-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Naziv kviza</th>
              <th className="px-6 py-4 font-semibold">Datum</th>
              <th className="px-6 py-4 font-semibold">Rezultat</th>
              <th className="px-6 py-4 font-semibold">Detalji</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <ResultRow key={res.resultId} result={res} navigate={navigate} />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-5xl mx-auto pt-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Moji rezultati</h2>
          <p className="text-gray-400">Pregled svih vaših završenih kvizova i postignuća</p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 font-medium">
            {error}
          </div>
        )}

        {results.length === 0 ? (
          <NoResults />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Ukupno rezultata: <span className="text-white font-semibold">{results.length}</span>
              </p>
              <div className="text-gray-400 text-sm">
                Poslednji rezultat: {new Date(results[0]?.completedAt).toLocaleDateString('sr-RS')}
              </div>
            </div>
            <ResultTable results={results} navigate={navigate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;