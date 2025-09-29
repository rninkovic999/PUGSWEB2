import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { createQuizWithQuestionsModel } from "../../models/quizModels";
import {
  getQuizByIdWithQuestions,
  submitQuizResult,
} from "../../services/quizService";
import { getUserIdFromToken } from "../../services/authService";

// STABILNA KOMPONENTA ZA TEXT INPUT
const TextInput = React.memo(
  ({ questionId, value, disabled, onChange, placeholder }) => {
    return (
      <input
        type="text"
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
        value={String(value || "")}
        onChange={(e) => onChange(String(questionId), e.target.value)}
        placeholder={placeholder}
      />
    );
  }
);

const StartQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Ref za sprečavanje duplog submit-a
  const isSubmittingRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuizByIdWithQuestions(id);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Neuspešno učitavanje kviza.");
        const parsed = createQuizWithQuestionsModel(data);
        setQuiz(parsed);
        setTimeLeft(parsed.timeLimitSeconds);
        setStartTime(Date.now());
      } catch (err) {
        setError(err.message || "Greška pri učitavanju kviza.");
      }
    };
    fetchQuiz();
  }, [id]);

  // VRATI STRANICU NA VRH KADA SE KVIZ UČITA
  useEffect(() => {
    if (quiz) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [quiz]);

  // SUBMIT FUNKCIJA
  const performSubmit = useCallback(async () => {
    if (isSubmittingRef.current || submitted) return;
    isSubmittingRef.current = true;

    const now = Date.now();
    const timeElapsedSeconds = startTime
      ? Math.floor((now - startTime) / 1000)
      : null;

    const normalizedAnswers = {};

    for (const [qId, answer] of Object.entries(userAnswers)) {
      const question = quiz?.questions.find((q) => String(q.id) === qId);
      if (!question) continue;

      if (question.type === "SingleChoice") {
        normalizedAnswers[qId] = answer + 1;
      } else if (question.type === "MultipleChoice") {
        normalizedAnswers[qId] = answer.map((index) => index + 1);
      } else {
        normalizedAnswers[qId] = answer;
      }
    }

    try {
      const userId = getUserIdFromToken();
      const resultData = await submitQuizResult(
        quiz.id,
        userId,
        timeElapsedSeconds,
        normalizedAnswers
      );
      setResult(resultData);
      setSubmitted(true);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      setError(err.message || "Greška pri slanju rezultata.");
      isSubmittingRef.current = false;
    }
  }, [quiz, userAnswers, startTime, submitted]);

  // TIMER
  useEffect(() => {
    if (!quiz || submitted) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          performSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [quiz, submitted, performSubmit]);

  // HANDLERS
  const handleChange = useCallback((questionId, answer) => {
    setUserAnswers((prev) => ({ ...prev, [String(questionId)]: answer }));
  }, []);

  const handleMultiChange = useCallback((questionId, index) => {
    setUserAnswers((prev) => {
      const key = String(questionId);
      const selected = new Set(prev[key] || []);
      if (selected.has(index)) selected.delete(index);
      else selected.add(index);
      return { ...prev, [key]: Array.from(selected) };
    });
  }, []);

  const handleSubmit = () => {
    performSubmit();
  };

  // FORMATIRANJE
  const formatAnswer = (answer, question, isCorrectAnswer = false) => {
    if (answer === undefined || answer === null) {
      return isCorrectAnswer ? "Tačan odgovor" : "Nije odgovoreno";
    }

    if (question.type === "MultipleChoice" && Array.isArray(answer)) {
      const optionsToDisplay = answer
        .map((i) => {
          const index = i - 1;
          return question.options[index] ?? `[nevaljan indeks ${i}]`;
        })
        .join(", ");

      return optionsToDisplay;
    }

    if (question.type === "SingleChoice" && typeof answer === "number") {
      const index = answer - 1;
      return question.options[index] ?? `[nevaljan indeks ${answer}]`;
    }

    if (question.type === "TrueFalse") {
      return answer === true || answer === "true"
        ? "Tačno"
        : answer === false || answer === "false"
        ? "Netačno"
        : "Nevaljan";
    }

    return String(answer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // RENDER
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4">
        <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-6 rounded-xl text-center font-medium max-w-md">
          {error}
        </div>
        <Link
          to="/"
          className="mt-4 text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          Nazad na početnu
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje kviza...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto pt-16">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
          >
            QuizHub
          </Link>
          {!submitted && (
            <div
              className={`px-4 py-2 rounded-lg font-bold text-lg ${
                timeLeft <= 60
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-yellow-400 text-gray-900"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        {/* TITLE & DESC */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{quiz.title}</h2>
          <p className="text-gray-300 text-lg">{quiz.description}</p>
        </div>

        {/* PROGRESS */}
        {!submitted && (
          <div className="bg-gray-800 rounded-xl p-4 mb-8 border border-gray-700">
            <div className="flex justify-between items-center text-white">
              <span>Progres:</span>
              <span className="text-yellow-400 font-semibold">
                {Object.keys(userAnswers).length} / {quiz.questions.length}{" "}
                pitanja
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Object.keys(userAnswers).length / quiz.questions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        <div className="space-y-6 mb-8">
          {quiz.questions.map((question, index) => {
            const qId = String(question.id);
            return (
              <div key={qId}>
                <div className="mb-4">
                  <span className="text-yellow-400 font-semibold">
                    Pitanje {index + 1} od {quiz.questions.length}
                  </span>
                </div>

                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <p className="font-semibold text-xl text-white mb-6">
                    {question.text}
                  </p>

                  {question.type === "TrueFalse" && (
                    <div className="flex gap-6">
                      {[
                        { value: true, label: "Tačno" },
                        { value: false, label: "Netačno" },
                      ].map(({ value, label }) => (
                        <label
                          key={label}
                          className="flex items-center gap-3 text-gray-300 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={qId}
                            value={value}
                            disabled={submitted}
                            checked={userAnswers[qId] === value}
                            onChange={() => handleChange(qId, value)}
                            className="w-4 h-4 text-yellow-400"
                          />
                          <span className="text-lg">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "FillInTheBlank" && (
                    <TextInput
                      questionId={qId}
                      value={userAnswers[qId]}
                      disabled={submitted}
                      onChange={handleChange}
                      placeholder="Unesite vaš odgovor..."
                    />
                  )}

                  {question.type === "SingleChoice" && (
                    <div className="space-y-3">
                      {question.options.map((option, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                          <input
                            type="radio"
                            name={`single-${qId}`}
                            value={i}
                            disabled={submitted}
                            checked={userAnswers[qId] === i}
                            onChange={() => handleChange(qId, i)}
                            className="w-4 h-4 text-yellow-400"
                          />
                          <span className="text-white text-lg">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "MultipleChoice" && (
                    <div className="space-y-3">
                      {question.options.map((option, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                          <input
                            type="checkbox"
                            value={i}
                            disabled={submitted}
                            checked={(userAnswers[qId] || []).includes(i)}
                            onChange={() => handleMultiChange(qId, i)}
                            className="w-4 h-4 text-yellow-400"
                          />
                          <span className="text-white text-lg">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SUBMIT */}
        {!submitted ? (
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmittingRef.current}
              className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-lg disabled:opacity-50"
            >
              {isSubmittingRef.current ? "Slanje..." : "Završi kviz"}
            </button>
          </div>
        ) : (
          <div className="text-center mb-8">
            <div className="bg-green-900/50 border border-green-500/50 text-green-400 p-4 rounded-xl font-semibold">
              Odgovori su uspešno poslati!
            </div>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">
                Rezultati kviza
              </h3>
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {result.score}%
                  </div>
                  <div className="text-gray-400">Ukupan rezultat</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {result.correctAnswers}
                  </div>
                  <div className="text-gray-400">Tačnih odgovora</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400">
                    {result.totalQuestions}
                  </div>
                  <div className="text-gray-400">Ukupno pitanja</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-4">
                Detaljan pregled:
              </h4>
              <div className="space-y-4">
                {quiz.questions.map((q, index) => {
                  const userAnswer = result.answers.find(
                    (a) => String(a.questionId) === String(q.id)
                  );
                  const isCorrect = userAnswer?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect
                          ? "bg-green-900/30 border-green-600"
                          : "bg-red-900/30 border-red-600"
                      }`}
                    >
                      <p className="font-semibold text-white mb-2">
                        {index + 1}. {q.text}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Vaš odgovor: </span>
                          <span
                            className={
                              isCorrect ? "text-green-400" : "text-red-400"
                            }
                          >
                            {formatAnswer(userAnswer?.answer, q, false)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Tačan odgovor: </span>
                          <span className="text-green-400">
                            {formatAnswer(userAnswer?.correctAnswer, q, true)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartQuiz;
