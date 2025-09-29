import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../services/questionService";
import { createQuestionRequest } from "../../models/questionModel";
import { createFieldErrorObject } from "../../models/fieldErrorModel";

const AddQuestion = ({ quizId }) => {
  const [text, setText] = useState("");
  const [type, setType] = useState("SingleChoice");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [correctOptionIndicesInput, setCorrectOptionIndicesInput] = useState("");
  const [correctAnswerBool, setCorrectAnswerBool] = useState(true);
  const [correctAnswerText, setCorrectAnswerText] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    const parsedCorrectOptionIndices = correctOptionIndicesInput
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "" && !isNaN(v))
      .map(Number);

    const questionRequest = createQuestionRequest({
      quizId,
      text,
      type,
      options,
      correctOptionIndex,
      correctOptionIndices: parsedCorrectOptionIndices,
      correctAnswerBool,
      correctAnswerText,
    });

    try {
      const response = await createQuestion(questionRequest);
      const data = await response.json();

      if (!response.ok) {
        setFieldErrors(
          data.errors && Array.isArray(data.errors)
            ? createFieldErrorObject(data.errors)
            : { general: data.detail || "Neuspešno kreiranje pitanja." }
        );
        return;
      }

      navigate(`/quiz/edit/${quizId}`);
    } catch (err) {
      setFieldErrors({ general: "Neočekivana greška: " + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderOptionInputs = () => {
    return (
      <>
        <label className="block mb-3 text-gray-300 font-medium">Opcije</label>
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Opcija ${idx + 1}`}
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[idx] = e.target.value;
              setOptions(newOptions);
            }}
            className={`w-full px-4 py-2 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
              fieldErrors.Options ? "border-red-500" : "border-gray-600"
            }`}
          />
        ))}
        {fieldErrors.Options && (
          <p className="text-red-500 text-sm mb-3">{fieldErrors.Options}</p>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Dodaj Pitanje
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block mb-3 text-gray-300 font-medium">
                Tekst pitanja
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Unesite tekst pitanja"
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
                  fieldErrors.Text ? "border-red-500" : "border-gray-600"
                }`}
                required
              />
              {fieldErrors.Text && (
                <p className="text-red-500 text-sm mt-2">{fieldErrors.Text}</p>
              )}
            </div>

            {/* Question Type */}
            <div>
              <label className="block mb-3 text-gray-300 font-medium">
                Tip pitanja
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600"
              >
                <option value="SingleChoice">Jedan izbor</option>
                <option value="MultipleChoice">Više izbora</option>
                <option value="TrueFalse">Tačno/Netačno</option>
                <option value="FillInTheBlank">Popuni prazninu</option>
              </select>
            </div>

            {/* Options for SingleChoice and MultipleChoice */}
            {["SingleChoice", "MultipleChoice"].includes(type) && (
              <div>{renderOptionInputs()}</div>
            )}

            {/* Correct Option Index for SingleChoice */}
            {type === "SingleChoice" && (
              <div>
                <label className="block mb-3 text-gray-300 font-medium">
                  Indeks tačnog odgovora (0-4)
                </label>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={correctOptionIndex}
                  onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
                    fieldErrors.CorrectOptionIndex
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {fieldErrors.CorrectOptionIndex && (
                  <p className="text-red-500 text-sm mt-2">
                    {fieldErrors.CorrectOptionIndex}
                  </p>
                )}
              </div>
            )}

            {/* Correct Option Indices for MultipleChoice */}
            {type === "MultipleChoice" && (
              <div>
                <label className="block mb-3 text-gray-300 font-medium">
                  Indeksi tačnih odgovora (odvojeni zarezom, npr: 0,2)
                </label>
                <input
                  type="text"
                  value={correctOptionIndicesInput}
                  onChange={(e) => setCorrectOptionIndicesInput(e.target.value)}
                  placeholder="0,1,2"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
                    fieldErrors.CorrectOptionIndices
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {fieldErrors.CorrectOptionIndices && (
                  <p className="text-red-500 text-sm mt-2">
                    {fieldErrors.CorrectOptionIndices}
                  </p>
                )}
              </div>
            )}

            {/* Correct Answer for TrueFalse */}
            {type === "TrueFalse" && (
              <div>
                <label className="block mb-3 text-gray-300 font-medium">
                  Tačan odgovor
                </label>
                <select
                  value={correctAnswerBool}
                  onChange={(e) => setCorrectAnswerBool(e.target.value === "true")}
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
                    fieldErrors.CorrectAnswerBool
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                >
                  <option value="true">Tačno</option>
                  <option value="false">Netačno</option>
                </select>
                {fieldErrors.CorrectAnswerBool && (
                  <p className="text-red-500 text-sm mt-2">
                    {fieldErrors.CorrectAnswerBool}
                  </p>
                )}
              </div>
            )}

            {/* Correct Answer Text for FillInTheBlank */}
            {type === "FillInTheBlank" && (
              <div>
                <label className="block mb-3 text-gray-300 font-medium">
                  Tačan odgovor
                </label>
                <input
                  type="text"
                  value={correctAnswerText}
                  onChange={(e) => setCorrectAnswerText(e.target.value)}
                  placeholder="Unesite tačan odgovor"
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
                    fieldErrors.CorrectAnswerText
                      ? "border-red-500"
                      : "border-gray-600"
                  }`}
                />
                {fieldErrors.CorrectAnswerText && (
                  <p className="text-red-500 text-sm mt-2">
                    {fieldErrors.CorrectAnswerText}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                  Dodajem pitanje...
                </>
              ) : (
                "Dodaj pitanje"
              )}
            </button>

            {/* General Error */}
            {fieldErrors.general && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-medium">
                {fieldErrors.general}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;