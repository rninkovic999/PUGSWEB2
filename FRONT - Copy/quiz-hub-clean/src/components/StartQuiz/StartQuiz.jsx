import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createQuizWithQuestionsModel } from "../../models/quizModels";
import {
  getQuizByIdWithQuestions,
  submitQuizResult,
} from "../../services/quizService";
import { getUserIdFromToken } from "../../services/authService";
import Question from "./Question";
import Result from "./Result";

const StartQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuizByIdWithQuestions(id);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to load quiz.");
        const parsed = createQuizWithQuestionsModel(data);
        setQuiz(parsed);
        setTimeLeft(parsed.timeLimitSeconds);
        setStartTime(Date.now());
      } catch (err) {
        setError(err.message);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!timeLeft || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  const handleChange = (questionId, index) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const handleMultiChange = (questionId, index) => {
    setUserAnswers((prev) => {
      const selected = new Set(prev[questionId] || []);
      if (selected.has(index)) selected.delete(index);
      else selected.add(index);
      return { ...prev, [questionId]: Array.from(selected) };
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const now = Date.now();
    const timeElapsedSeconds = startTime
      ? Math.floor((now - startTime) / 1000)
      : null;

    const normalizedAnswers = {};

    for (const [questionId, answer] of Object.entries(userAnswers)) {
      const question = quiz.questions.find((q) => q.id === questionId);
      if (!question) continue;

      if (question.type === "SingleChoice") {
        normalizedAnswers[questionId] = answer + 1;
      } else if (question.type === "MultipleChoice") {
        normalizedAnswers[questionId] = answer.map((index) => index + 1);
      } else {
        normalizedAnswers[questionId] = answer;
      }
    }

    try {
      const userId = getUserIdFromToken();
      const result = await submitQuizResult(
        quiz.id,
        userId,
        timeElapsedSeconds,
        normalizedAnswers
      );
      setResult(result);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error)
    return <div className="text-red-600 text-center mt-24">{error}</div>;
  if (!quiz) return <div className="text-center mt-24">Loading quiz...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
      <p className="mb-4 text-gray-600">{quiz.description}</p>

      <div className="text-right mb-4 font-semibold text-red-600">
        Time left: {timeLeft}s
      </div>

      {quiz.questions.map((q) => (
        <Question
          key={q.id}
          question={q}
          userAnswer={userAnswers[q.id]}
          submitted={submitted}
          onChange={handleChange}
          onMultiChange={handleMultiChange}
        />
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-6 text-green-600 font-bold text-center">
          Answers submitted!
        </div>
      )}

      {result && <Result result={result} quiz={quiz} />}
    </div>
  );
};

export default StartQuiz;
