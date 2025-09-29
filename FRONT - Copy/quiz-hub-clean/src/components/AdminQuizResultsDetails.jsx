import React, { useEffect, useState } from "react";
import { getAdminResultDetails } from "../services/quizResultService";

const formatAnswer = (answer, question) => {
  if (answer === undefined || answer === null) return "Nije odgovoreno";

  switch (question.type) {
    case "SingleChoice": {
      const index = answer - 1;
      return question.options?.[index] ?? `[nevaljan indeks: ${answer}]`;
    }
    case "MultipleChoice":
      if (!Array.isArray(answer)) return "[nevaljan format]";
      return answer
        .map((i) => question.options?.[i - 1] ?? `[?${i}]`)
        .join(", ");
    case "TrueFalse":
      return answer === true || answer === "true" ? "Tačno" : "Netačno";
    case "FillInTheBlank":
      return String(answer);
    default:
      return String(answer);
  }
};

const AdminQuizResultsDetails = ({ quizResultId }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await getAdminResultDetails(quizResultId);
        setData(result);
      } catch (err) {
        setError(err.message || "Greška pri učitavanju rezultata");
      }
    };

    fetchDetails();
  }, [quizResultId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-6 rounded-xl text-center font-medium max-w-md">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje...</div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Detalji Rezultata Kviza
        </h1>

        {/* User Info Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400 mb-2">Korisnik</div>
              <div className="text-white text-lg">{data.username}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400 mb-2">Rezultat</div>
              <div className="text-white text-lg">
                {data.correctAnswers}/{data.totalQuestions} ({Math.round(data.score)}%)
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400 mb-2">Vreme</div>
              <div className="text-white text-lg">{formatTime(data.timeElapsedSeconds)}</div>
            </div>
          </div>
        </div>

        {/* Questions & Answers */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Pitanja i Odgovori</h2>
          
          <div className="space-y-6">
            {data.questions.map((q, index) => (
              <div 
                key={q.id} 
                className={`p-6 rounded-xl border ${
                  q.isCorrect 
                    ? "bg-green-900/30 border-green-600" 
                    : "bg-red-900/30 border-red-600"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white pr-4">
                    {index + 1}. {q.text}
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    q.isCorrect 
                      ? "bg-green-600 text-white" 
                      : "bg-red-600 text-white"
                  }`}>
                    {q.isCorrect ? "Tačno" : "Netačno"}
                  </div>
                </div>

                {/* Options (if any) */}
                {q.options && (
                  <div className="mb-4 bg-gray-700 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Opcije:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className="text-sm text-gray-300">
                          <span className="font-medium text-yellow-400">{idx + 1}.</span> {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Answer */}
                <div className="mb-3">
                  <span className="text-gray-400 font-medium">Korisnikov odgovor: </span>
                  <span className={`font-medium ${
                    q.isCorrect ? "text-green-400" : "text-red-400"
                  }`}>
                    {formatAnswer(q.userAnswer, q)}
                  </span>
                </div>

                {/* Correct Answer (if user was wrong) */}
                {!q.isCorrect && (
                  <div>
                    <span className="text-gray-400 font-medium">Tačan odgovor: </span>
                    <span className="text-green-400 font-medium">
                      {formatAnswer(q.correctAnswer, q)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizResultsDetails;