import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Pretpostavka: getTopResultsForQuiz prima quizId i period (npr. 'all', 'weekly', 'monthly')
import { getTopResultsForQuiz } from "../../services/resultService"; 

const QuizLeaderboard = ({ quizId }) => {
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState("all"); // State za filtriranje
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Efekat za dohvat podataka kada se promene quizId ili period
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // Prosleđivanje perioda u servisnu funkciju
        const data = await getTopResultsForQuiz(quizId, period); 
        setEntries(data.entries);
        setError("");
      } catch (err) {
        // Poruka o grešci prilagođena srpskom jeziku
        setError(err.message || "Neuspešno učitavanje liste. Pokušajte ponovo.");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchLeaderboard();
    }
  }, [quizId, period]); // Zavisnosti su quizId i period

  // Funkcija za formatiranje vremena iz sekundi
  const formatTime = (seconds) => {
    // Provera da li je seconds validan broj
    if (typeof seconds !== 'number' || seconds < 0) return 'N/A';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Komponenta za filter perioda
  const PeriodFilter = () => (
    <div className="mb-8 flex justify-center">
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        <label className="block text-gray-300 font-medium mb-3 text-center">
          Filtriraj po periodu:
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="all">Sve vreme</option>
          <option value="weekly">Nedeljno</option>
          <option value="monthly">Mesečno</option>
        </select>
      </div>
    </div>
  );

  // Komponenta za tabelu liste
  const LeaderboardTable = () => (
    <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
      <table className="w-full bg-gray-800 rounded-xl overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 w-16">
              #
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200">
              Korisničko ime
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200 w-24">
              Rezultat
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-200 w-28">
              Vreme
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-200 w-44">
              Završeno
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {entries.map((entry, index) => (
            // Koristimo index + 1 za poziciju ako entry.position nije dostupan
            <tr key={entry.position || index} className="hover:bg-gray-700/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  (entry.position || index + 1) === 1 ? 'bg-yellow-400 text-gray-900' :
                  (entry.position || index + 1) === 2 ? 'bg-gray-400 text-gray-900' :
                  (entry.position || index + 1) === 3 ? 'bg-amber-600 text-white' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {entry.position || index + 1}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-white">
                  {entry.username}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-yellow-400 font-bold text-lg">
                  {entry.score}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <span className="text-gray-300">
                  {formatTime(entry.timeElapsedSeconds)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-gray-300">
                  {new Date(entry.completedAt).toLocaleString('sr-RS')}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje liste... ⏳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto pt-16">
        {/* Navigacija */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
          >
            QuizHub
          </Link>
          <Link
            to="/"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ← Nazad na kvizove
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Lista Najboljih Rezultata 🏆
        </h1>
        
        {/* FILTER JE DODAT OVDE */}
        <PeriodFilter /> 
        
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {entries.length === 0 && !error ? (
          <div className="text-center text-gray-400 text-lg">
            Nema rezultata za odabrani period **({period === 'all' ? 'Sve vreme' : period === 'weekly' ? 'Nedeljno' : 'Mesečno'})**. 😞 Budite prvi!
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            {/* Statistika */}
            <div className="mb-6 flex justify-between items-center flex-wrap">
              <h2 className="text-xl font-semibold text-white mb-2 sm:mb-0">
                Ukupno rezultata ({period === 'all' ? 'Sve vreme' : period === 'weekly' ? 'Nedeljno' : 'Mesečno'}): <span className="text-yellow-400">{entries.length}</span>
              </h2>
              {entries.length > 0 && (
                <div className="text-sm text-gray-400">
                  Najbolji rezultat: {' '}
                  <span className="text-yellow-400 font-semibold">
                    {Math.max(...entries.map(e => e.score))}%
                  </span>
                </div>
              )}
            </div>
            
            <LeaderboardTable />

            {entries.length > 0 && (
              <div className="mt-6 text-center text-gray-400 text-sm">
                Lista se ažurira u realnom vremenu i prikazuje top rezultate za odabrani period.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizLeaderboard;