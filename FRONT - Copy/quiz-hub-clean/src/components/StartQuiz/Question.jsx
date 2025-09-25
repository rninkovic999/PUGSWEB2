import React from "react";

const Question = ({
  question,
  userAnswer,
  submitted,
  onChange,
  onMultiChange,
}) => {
  return (
    <div className="mb-6">
      <p className="font-semibold">{question.text}</p>

      {question.type === "TrueFalse" && (
        <div className="flex gap-4 mt-2">
          <label>
            <input
              type="radio"
              name={question.id}
              value="true"
              disabled={submitted}
              checked={userAnswer === true}
              onChange={() => onChange(question.id, true)}
            />
            True
          </label>
          <label>
            <input
              type="radio"
              name={question.id}
              value="false"
              disabled={submitted}
              checked={userAnswer === false}
              onChange={() => onChange(question.id, false)}
            />
            False
          </label>
        </div>
      )}

      {question.type === "FillInTheBlank" && (
        <input
          type="text"
          disabled={submitted}
          className="border mt-2 px-2 py-1 rounded w-full"
          value={userAnswer || ""}
          onChange={(e) => onChange(question.id, e.target.value)}
        />
      )}

      {question.type === "SingleChoice" && (
        <div className="mt-2 space-y-1">
          {question.options.map((option, i) => (
            <label key={i} className="block">
              <input
                type="radio"
                name={`single-${question.id}`}
                value={i}
                disabled={submitted}
                checked={userAnswer === i}
                onChange={() => onChange(question.id, i)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      )}

      {question.type === "MultipleChoice" && (
        <div className="mt-2 space-y-1">
          {question.options.map((option, i) => (
            <label key={i} className="block">
              <input
                type="checkbox"
                value={i}
                disabled={submitted}
                checked={(userAnswer || []).includes(i)}
                onChange={() => onMultiChange(question.id, i)}
              />{" "}
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default Question;
