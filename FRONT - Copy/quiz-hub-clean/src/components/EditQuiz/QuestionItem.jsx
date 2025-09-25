import React from "react";

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

  return (
    <li className="border rounded p-3">
      <p>
        <strong>Q{index + 1}:</strong> {text}
      </p>
      <p>
        <strong>Type:</strong> {type}
      </p>

      {["SingleChoice", "MultipleChoice"].includes(type) && (
        <>
          <p>
            <strong>Options:</strong>
          </p>
          <ul className="list-disc pl-6">
            {options.map((opt, i) => (
              <li key={i}>
                {opt}{" "}
                {type === "SingleChoice" && correctOptionIndex === i + 1 && (
                  <strong>(correct)</strong>
                )}
                {type === "MultipleChoice" &&
                  correctOptionIndices.includes(i + 1) && (
                    <strong>(correct)</strong>
                  )}
              </li>
            ))}
          </ul>
        </>
      )}

      {type === "TrueFalse" && (
        <p>
          <strong>Correct Answer:</strong>{" "}
          {correctAnswerBool ? "True" : "False"}
        </p>
      )}

      {type === "FillInTheBlank" && (
        <p>
          <strong>Correct Answer:</strong> {correctAnswerText}
        </p>
      )}
    </li>
  );
};

export default QuestionItem;
