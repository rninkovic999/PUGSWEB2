import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminQuizzes, deleteQuiz } from "../../services/quizService";
import { createQuizModel } from "../../models/quizModels";

const difficultyColors = {
  1: { label: "Lako", color: "bg-green-500" },
  2: { label: "Srednje", color: "bg-yellow-500" },
  3: { label: "Teško", color: "bg-red-500" },
};

const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getAdminQuizzes();
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Neuspešno učitavanje kvizova.");

        setQuizzes(data.map(createQuizModel));
      } catch (err) {
        setError(err.message || "Neočekivana greška.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj kviz?")) {
      return;
    }

    try {
      setDeletingId(quizId);
      const response = await deleteQuiz(quizId);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Brisanje kviza nije uspelo.");
      }
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      setError(err.message || "Neočekivana greška.");
    } finally {
      setDeletingId(null);
    }
  };

  const QuizCard = ({ quiz }) => {
    const difficulty = difficultyColors[quiz.difficulty] || {
      label: "Nepoznato",
      color: "bg-gray-400",
    };

    const isDeleting = deletingId === quiz.id;

    return (
      <div className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 flex flex-col">
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-semibold text-white mb-3">
            {quiz.title}
          </h3>
          <p className="text-gray-300 mb-4 line-clamp-3">
            {quiz.description}
          </p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Kategorija:</span>
              <span className="text-white font-medium">{quiz.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Vreme:</span>
              <span className="text-white font-medium">{quiz.timeLimitSeconds}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pitanja:</span>
              <span className="text-white font-medium">{quiz.questionCount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium text-sm"
              onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
            >
              Uredi
            </button>
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium text-sm"
              onClick={() => navigate(`/quiz/add-question/${quiz.id}`)}
            >

              Rezultati
            </button>
            <button
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              onClick={() => handleDelete(quiz.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                "Obriši"
              )}
            </button>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div
          className={`w-full text-center py-3 text-white font-semibold rounded-b-xl ${difficulty.color}`}
        >
          {difficulty.label}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje kvizova...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto pt-16">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          Moji kvizovi
        </h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            Nemate kreiraih kvizova.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQuizList;