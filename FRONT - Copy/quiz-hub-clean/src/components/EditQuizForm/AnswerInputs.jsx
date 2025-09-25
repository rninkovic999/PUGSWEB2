import React from "react";

const AnswerInputs = ({ question, updateOption, updateQuestion }) => {
  if (["SingleChoice", "MultipleChoice"].includes(question.type)) {
    return (
      <>
        {question.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
            />
            {question.type === "SingleChoice" ? (
              <input
                type="radio"
                checked={question.correctOptionIndex === i + 1}
                onChange={() => updateQuestion({ correctOptionIndex: i + 1 })}
              />
            ) : (
              <input
                type="checkbox"
                checked={question.correctOptionIndices?.includes(i + 1)}
                onChange={(e) => {
                  const current = question.correctOptionIndices || [];
                  const updated = e.target.checked
                    ? [...current, i + 1]
                    : current.filter((val) => val !== i + 1);
                  updateQuestion({ correctOptionIndices: updated });
                }}
              />
            )}
            <span className="text-sm">Correct</span>
          </div>
        ))}
      </>
    );
  }

  if (question.type === "TrueFalse") {
    return (
      <div className="flex gap-4 mt-2">
        {["True", "False"].map((val) => (
          <label key={val} className="flex items-center gap-2">
            <input
              type="radio"
              checked={question.correctAnswerBool === (val === "True")}
              onChange={() =>
                updateQuestion({ correctAnswerBool: val === "True" })
              }
            />
            {val}
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "FillInTheBlank") {
    return (
      <input
        type="text"
        value={question.correctAnswerText}
        onChange={(e) => updateQuestion({ correctAnswerText: e.target.value })}
        className="w-full px-3 py-1 border rounded mt-2"
      />
    );
  }

  return null;
};

export default AnswerInputs;
