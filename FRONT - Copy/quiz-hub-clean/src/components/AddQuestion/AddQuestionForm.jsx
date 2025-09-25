import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../services/questionService";
import { createQuestionRequest } from "../../models/questionModel";
import { createFieldErrorObject } from "../../models/fieldErrorModel";
import OptionInputs from "./OptionInputs";

const AddQuestionForm = ({ quizId }) => {
  const [text, setText] = useState("");
  const [type, setType] = useState("SingleChoice");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(0);
  const [correctOptionIndicesInput, setCorrectOptionIndicesInput] =
    useState("");
  const [correctAnswerBool, setCorrectAnswerBool] = useState(true);
  const [correctAnswerText, setCorrectAnswerText] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

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
            : { general: data.detail || "Failed to create question." }
        );
        return;
      }

      navigate(`/quiz/edit/${quizId}`);
    } catch (err) {
      setFieldErrors({ general: "Unexpected error: " + err.message });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-24 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Question</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Question Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`w-full px-3 py-2 border rounded mb-1 ${
            fieldErrors.Text ? "border-red-500" : "border-gray-300"
          }`}
          required
        />
        {fieldErrors.Text && (
          <p className="text-red-500 text-sm mb-3">{fieldErrors.Text}</p>
        )}

        <label className="block mb-2 font-semibold">Question Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-3"
        >
          <option value="SingleChoice">Single Choice</option>
          <option value="MultipleChoice">Multiple Choice</option>
          <option value="TrueFalse">True/False</option>
          <option value="FillInTheBlank">Fill in the Blank</option>
        </select>

        {["SingleChoice", "MultipleChoice"].includes(type) && (
          <>
            <label className="block mb-2 font-semibold">Options</label>
            <OptionInputs
              options={options}
              setOptions={setOptions}
              fieldErrors={fieldErrors}
            />
          </>
        )}

        {type === "SingleChoice" && (
          <div className="mb-3">
            <label className="block font-semibold">Correct Option Index</label>
            <input
              type="number"
              value={correctOptionIndex}
              onChange={(e) => setCorrectOptionIndex(Number(e.target.value))}
              className={`w-full px-2 py-1 border rounded ${
                fieldErrors.CorrectOptionIndex
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.CorrectOptionIndex && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.CorrectOptionIndex}
              </p>
            )}
          </div>
        )}

        {type === "MultipleChoice" && (
          <div className="mb-3">
            <label className="block font-semibold">
              Correct Option Indices (comma separated)
            </label>
            <input
              type="text"
              value={correctOptionIndicesInput}
              onChange={(e) => setCorrectOptionIndicesInput(e.target.value)}
              className={`w-full px-2 py-1 border rounded ${
                fieldErrors.CorrectOptionIndices
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.CorrectOptionIndices && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.CorrectOptionIndices}
              </p>
            )}
          </div>
        )}

        {type === "TrueFalse" && (
          <div className="mb-3">
            <label className="block font-semibold">Correct Answer</label>
            <select
              value={correctAnswerBool}
              onChange={(e) => setCorrectAnswerBool(e.target.value === "true")}
              className={`w-full px-2 py-1 border rounded ${
                fieldErrors.CorrectAnswerBool
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
            {fieldErrors.CorrectAnswerBool && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.CorrectAnswerBool}
              </p>
            )}
          </div>
        )}

        {type === "FillInTheBlank" && (
          <div className="mb-3">
            <label className="block font-semibold">Correct Answer Text</label>
            <input
              type="text"
              value={correctAnswerText}
              onChange={(e) => setCorrectAnswerText(e.target.value)}
              className={`w-full px-2 py-1 border rounded ${
                fieldErrors.CorrectAnswerText
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {fieldErrors.CorrectAnswerText && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.CorrectAnswerText}
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Question
        </button>

        {fieldErrors.general && (
          <p className="mt-4 text-center text-red-600 font-medium">
            {fieldErrors.general}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddQuestionForm;
