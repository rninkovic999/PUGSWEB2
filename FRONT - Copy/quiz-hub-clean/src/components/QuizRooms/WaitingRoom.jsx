import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  startLobbyConnection,
  joinLobbyGroup,
  leaveLobbyGroup,
  stopLobbyConnection,
  registerUserJoinedHandler,
  registerUserLeftHandler,
  sendAnswer,
  registerScoreUpdatedHandler,
  registerQuestionReceivedHandler,
  registerQuizCompletedHandler,
} from "../../services/lobbyHubService";

import { joinLobby, getParticipantsForLobby } from "../../services/lobbyService";

// STABILNA TEXT INPUT KOMPONENTA
const TextInput = React.memo(({ questionId, value, onChange, placeholder, disabled }) => {
  return (
    <input
      type="text"
      className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 mt-4"
      value={String(value || "")}
      onChange={(e) => onChange(String(questionId), e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
});

// PREMESTENA I STABILNA KOMPONENTA AnswerForm (VAN WaitingRoom)
const AnswerForm = React.memo(({ question, userAnswer, onChange, onMultiChange }) => {
  if (!question) return null;
  const qId = String(question.questionId);

  return (
    <div className="mb-6">
      <p className="font-semibold text-xl mb-4 text-white">{question.text}</p>

      {question.type === "TrueFalse" && (
        <div className="flex gap-6 mt-4">
          {[
            { value: true, label: "Tačno" },
            { value: false, label: "Netačno" }
          ].map(({ value, label }) => (
            <label key={label} className="flex items-center gap-3 text-gray-300 cursor-pointer">
              <input
                type="radio"
                name={qId}
                value={String(value)}
                checked={userAnswer === value}
                onChange={() => onChange(qId, value)}
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
          value={userAnswer}
          onChange={onChange}
          placeholder="Ukucajte vaš odgovor..."
        />
      )}

      {question.type === "SingleChoice" && (
        <div className="mt-4 space-y-3">
          {question.options.map((option, i) => (
            <label key={i} className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="radio"
                name={`single-${qId}`}
                value={i + 1}
                checked={userAnswer === i + 1}
                onChange={() => onChange(qId, i + 1)}
                className="w-4 h-4 text-yellow-400"
              />
              <span className="text-white text-lg">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === "MultipleChoice" && (
        <div className="mt-4 space-y-3">
          {question.options.map((option, i) => (
            <label key={i} className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
              <input
                type="checkbox"
                value={i + 1}
                checked={(userAnswer || []).includes(i + 1)}
                onChange={() => onMultiChange(qId, i + 1)}
                className="w-4 h-4 text-yellow-400"
              />
              <span className="text-white text-lg">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
});

const WaitingRoom = () => {
  const { id: lobbyId } = useParams();
  const [joinedUsers, setJoinedUsers] = useState([]);
  const [startAt, setStartAt] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const connectionRef = useRef(null);
  const isConnectedRef = useRef(false);

  // HANDLERS
  const handleAnswerChange = useCallback((questionId, value) => {
    // note: questionId je string ovde, ali ne koristimo direktno
    setUserAnswer(value);
  }, []);

  const handleMultiAnswerChange = useCallback((questionId, optionIndex) => {
    setUserAnswer((prev) => {
      const current = prev || [];
      if (current.includes(optionIndex)) {
        return current.filter((i) => i !== optionIndex);
      } else {
        return [...current, optionIndex];
      }
    });
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!currentQuestion || userAnswer === null || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      questionId: String(currentQuestion.questionId),
      answer: userAnswer,
      lobbyId: lobbyId,
    };

    try {
      if (!isConnectedRef.current) {
        throw new Error("Connection not available");
      }

      await sendAnswer(payload);
      setAnsweredQuestions((prev) => [
        ...prev,
        String(currentQuestion.questionId),
      ]);
    } catch (error) {
      console.error("Error submitting answer", error);
      if (
        error.message.includes("connection being closed") ||
        error.message.includes("Connection not available")
      ) {
        setSubmitError("Konekcija je prekinuta. Pokušajte ponovo.");
      } else {
        setSubmitError("Došlo je do greške prilikom slanja odgovora.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, userAnswer, isSubmitting, lobbyId]);

  // CONNECTION
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    const connect = async () => {
      try {
        const { ok } = await joinLobby(lobbyId);
        if (!ok) {
          console.error("Failed to join lobby");
          return;
        }

        await startLobbyConnection(token);
        isConnectedRef.current = true;

        try {
          await joinLobbyGroup(lobbyId);
        } catch (error) {
          if (error.message.includes("User already in the lobby")) {
            console.log("User already in lobby, continuing...");
          } else {
            throw error;
          }
        }

        try {
          const { usernames, startAt } = await getParticipantsForLobby(lobbyId);
          setJoinedUsers(usernames.map((u) => ({ username: u, score: 0 })));
          const normalizedStartAt = startAt.endsWith("Z") ? startAt : startAt + "Z";
          setStartAt(new Date(normalizedStartAt));
        } catch (err) {
          console.error("Failed to load participants:", err);
        }

        registerUserJoinedHandler((username) => {
          setJoinedUsers((prev) => {
            if (prev.some((u) => u.username === username)) return prev;
            return [...prev, { username, score: 0 }];
          });
        });

        registerUserLeftHandler((username) => {
          setJoinedUsers((prev) => prev.filter((u) => u.username !== username));
        });

        registerScoreUpdatedHandler(({ username, score }) => {
          setJoinedUsers((prev) =>
            prev.map((u) => (u.username === username ? { ...u, score } : u))
          );
        });

        registerQuestionReceivedHandler((question) => {
          // normalizuj questionId u string gde treba kada koristiš
          setCurrentQuestion(question);
        });

        registerQuizCompletedHandler(() => {
          setQuizFinished(true);
        });
      } catch (error) {
        console.error("Connection error:", error);
        isConnectedRef.current = false;
      }
    };

    connect();

    return () => {
      const cleanup = async () => {
        isConnectedRef.current = false;
        try {
          await leaveLobbyGroup(lobbyId);
        } catch {}
        try {
          await stopLobbyConnection();
        } catch {}
      };
      cleanup();
    };
  }, [lobbyId]);

  // RESET ANSWER kad se promeni pitanje
  useEffect(() => {
    setUserAnswer(null);
  }, [currentQuestion?.questionId]);

  // COUNTDOWN
  useEffect(() => {
    if (!startAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = startAt.getTime() - now;

      if (diff <= 0) {
        setCountdown("Lobi se pokreće...");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startAt]);

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto pt-16 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
          >
            QuizHub
          </Link>
        </div>

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center text-white">
          Lobi: <span className="text-yellow-400">{lobbyId}</span>
        </h2>

        {/* PARTICIPANTS */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">
            Učesnici ({joinedUsers.length})
          </h3>

          {joinedUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              Čekaju se učesnici...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedUsers.map((user, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">
                      {user.username}
                    </span>
                    <span className="text-yellow-400 font-bold">
                      {user.score}{" "}
                      {user.score === 1
                        ? "bod"
                        : user.score % 10 >= 2 &&
                          user.score % 10 <= 4 &&
                          (user.score % 100 < 10 || user.score % 100 >= 20)
                        ? "boda"
                        : "bodova"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COUNTDOWN */}
        {countdown && (
          <div className="bg-yellow-400 text-gray-900 p-4 rounded-xl text-center font-bold text-xl">
            {countdown === "Lobi se pokreće..."
              ? countdown
              : `Lobi počinje za: ${countdown}`}
          </div>
        )}

        {/* QUESTION */}
        {!quizFinished && currentQuestion && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Pitanje {currentQuestion.index}
              </h3>
              {answeredQuestions.includes(String(currentQuestion.questionId)) && (
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                  Odgovoreno
                </span>
              )}
            </div>

            <AnswerForm
              question={currentQuestion}
              userAnswer={userAnswer}
              onChange={handleAnswerChange}
              onMultiChange={handleMultiAnswerChange}
            />

            <div className="flex justify-center">
              <button
                className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  isSubmitting ||
                  userAnswer === null ||
                  answeredQuestions.includes(String(currentQuestion.questionId))
                }
                onClick={submitAnswer}
              >
                {isSubmitting
                  ? "Šalje se..."
                  : answeredQuestions.includes(String(currentQuestion.questionId))
                  ? "Odgovor poslat"
                  : "Pošalji odgovor"}
              </button>
            </div>

            {submitError && (
              <div className="mt-4 bg-red-900/50 border border-red-500/50 text-red-400 p-3 rounded-lg text-center">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* FINISH */}
        {quizFinished && (
          <div className="bg-green-900/50 border border-green-500/50 text-green-400 p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">Kviz je završen!</h3>
            <p className="text-lg">Hvala vam što ste učestvovali!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
