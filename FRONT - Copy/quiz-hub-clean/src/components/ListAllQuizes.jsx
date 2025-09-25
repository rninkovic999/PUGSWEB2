import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  1: { label: "Lako", color: "bg-green-500" },
  2: { label: "Srednje", color: "bg-yellow-500" },
  3: { label: "Teško", color: "bg-red-500" },
};

const ListAllQuizzes = ({ quizzes = [] }) => {
  const [localQuizzes, setLocalQuizzes] = useState(quizzes);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLocalQuizzes(quizzes);
  }, [quizzes]);

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-7xl mx-auto pt-16">
        <h2 className="text-4xl font-bold mb-8 text-center text-white">
          Dostupni Kvizovi
        </h2>
        
        {error && (
          <div className="text-red-500 mb-6 text-center text-lg font-medium bg-gray-800 p-4 rounded-xl border border-red-500/30">
            {error}
          </div>
        )}

        {localQuizzes.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            Nema dostupnih kvizova.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {localQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-gray-800 shadow-lg rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 flex flex-col"
              >
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
                      <span className="text-white font-medium">
                        {quiz.questionCount}
                        {quiz.questionCount % 10 === 1 && quiz.questionCount % 100 !== 11
                          ? "" 
                          : quiz.questionCount % 10 >= 2 && quiz.questionCount % 10 <= 4 && (quiz.questionCount % 100 < 10 || quiz.questionCount % 100 >= 20)
                          ? ""
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4">
                  <div className="flex gap-2 mb-4">
                    <button
                      className="flex-1 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                      onClick={() => navigate(`/quiz/start/${quiz.id}`)}
                    >
                      Počni Kviz
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors border border-gray-600 hover:border-yellow-400"
                      onClick={() => navigate(`/quiz/${quiz.id}/leaderboard`)}
                    >
                      Lista
                    </button>
                  </div>
                </div>

                <div
                  className={`w-full text-center py-3 text-white font-semibold rounded-b-xl ${
                    difficultyColors[quiz.difficulty]?.color || "bg-gray-400"
                  }`}
                >
                  {difficultyColors[quiz.difficulty]?.label || "Nepoznato"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListAllQuizzes;