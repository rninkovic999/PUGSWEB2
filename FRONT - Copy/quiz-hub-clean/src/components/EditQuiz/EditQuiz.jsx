import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getQuizByIdWithAnswers } from "../../services/quizService";
import { createQuizWithAnswersModel } from "../../models/getQuizByIdWithAnswersResponseModel";
import { createFieldErrorObject } from "../../models/fieldErrorModel";

const EditQuiz = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      const { ok, data } = await getQuizByIdWithAnswers(quizId);
      if (!ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setFieldErrors(createFieldErrorObject(data.errors));
        } else {
          setGeneralError(
            data.message || data.detail || "Neuspešno učitavanje kviza."
          );
        }
        setLoading(false);
        return;
      }

      setQuiz(createQuizWithAnswersModel(data));
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  const QuizDetails = ({ quiz }) => {
    const difficultyLabels = ["Lako", "Srednje", "Teško"];
    
    return (
      <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Detalji kviza</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Opis:</span>
            <span className="text-white font-medium">{quiz.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Kategorija:</span>
            <span className="text-white font-medium">{quiz.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vremensko ograničenje:</span>
            <span className="text-white font-medium">{quiz.timeLimitSeconds}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Težina:</span>
            <span className={`font-medium ${
              quiz.difficulty === 1 ? 'text-green-400' : 
              quiz.difficulty === 2 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {difficultyLabels[quiz.difficulty - 1]}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const QuestionItem = ({ question, index }) => {
    const {
      text,
      type,
      options,
      correctOptionIndex,
      correctOptionIndices,
      correctAnswerBool,
      correctAnswerText,
    } = question;

    const getTypeLabel = (type) => {
      switch (type) {
        case "SingleChoice": return "Jedan izbor";
        case "MultipleChoice": return "Više izbora";
        case "TrueFalse": return "Tačno/Netačno";
        case "FillInTheBlank": return "Popuni prazninu";
        default: return type;
      }
    };

    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">
            Pitanje {index + 1}
          </h4>
          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
            {getTypeLabel(type)}
          </span>
        </div>
        
        <p className="text-gray-300 mb-4 text-lg">{text}</p>

        {["SingleChoice", "MultipleChoice"].includes(type) && (
          <div className="space-y-2">
            <h5 className="text-gray-400 font-medium mb-3">Opcije:</h5>
            <div className="space-y-2">
              {options.map((opt, i) => {
                const isCorrect = 
                  (type === "SingleChoice" && correctOptionIndex === i + 1) ||
                  (type === "MultipleChoice" && correctOptionIndices.includes(i + 1));
                
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      isCorrect 
                        ? 'border-green-500 bg-green-900/20 text-green-300'
                        : 'border-gray-600 bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {isCorrect && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Tačno
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {type === "TrueFalse" && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <span className="text-gray-400">Tačan odgovor: </span>
            <span className={`font-semibold ${correctAnswerBool ? 'text-green-400' : 'text-red-400'}`}>
              {correctAnswerBool ? "Tačno" : "Netačno"}
            </span>
          </div>
        )}

        {type === "FillInTheBlank" && (
          <div className="bg-gray-700 p-4 rounded-lg">
            <span className="text-gray-400">Tačan odgovor: </span>
            <span className="text-green-400 font-semibold">{correctAnswerText}</span>
          </div>
        )}
      </div>
    );
  };

  const QuestionsList = ({ questions }) => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            Pitanja ({questions.length})
          </h3>
          <button
            onClick={() => navigate(`/quiz/add-question/${quizId}`)}
            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
          >
            Dodaj pitanje
          </button>
        </div>
        
        {questions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            Ovaj kviz još nema pitanja.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <QuestionItem key={q.id} question={q} index={idx} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje kviza...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-6 rounded-xl text-center font-medium max-w-md">
          {generalError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
          >
            QuizHub
          </Link>
          <Link
            to="/quiz/admin"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ← Nazad na kvizove
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Uredi kviz: <span className="text-yellow-400">{quiz.title}</span>
        </h2>

        <QuizDetails quiz={quiz} />
        
        <QuestionsList questions={quiz.questions} />

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate(`/quiz/edit-form/${quiz.id}`)}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
          >
            Potvrdi promene
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;