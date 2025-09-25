import React from "react";

const AnswerForm = ({ question, userAnswer, onChange, onMultiChange }) => {
  if (!question) return null;

  return (
    <div className="mb-6">
      <p className="font-semibold text-lg mb-2">{question.text}</p>

      {question.type === "TrueFalse" && (
        <div className="flex gap-6 mt-2">
          <label>
            <input
              type="radio"
              name={question.questionId}
              value="true"
              checked={userAnswer === true}
              onChange={() => onChange(question.questionId, true)}
            />{" "}
            True
          </label>
          <label>
            <input
              type="radio"
              name={question.questionId}
              value="false"
              checked={userAnswer === false}
              onChange={() => onChange(question.questionId, false)}
            />{" "}
            False
          </label>
        </div>
      )}

      {question.type === "FillInTheBlank" && (
        <input
          type="text"
          className="border mt-2 px-3 py-1 rounded w-full"
          value={userAnswer || ""}
          onChange={(e) => onChange(question.questionId, e.target.value)}
          placeholder="Type your answer here..."
        />
      )}

      {question.type === "SingleChoice" && (
        <div className="mt-2 space-y-2">
          {question.options.map((option, i) => (
            <label key={i} className="block">
              <input
                type="radio"
                name={`single-${question.questionId}`}
                value={i}
                checked={userAnswer === i + 1}
                onChange={() => onChange(question.questionId, i + 1)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      )}

      {question.type === "MultipleChoice" && (
        <div className="mt-2 space-y-2">
          {question.options.map((option, i) => (
            <label key={i} className="block">
              <input
                type="checkbox"
                value={i}
                checked={(userAnswer || []).includes(i + 1)}
                onChange={() => onMultiChange(question.questionId, i + 1)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnswerForm;
