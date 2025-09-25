import React from "react";
import AnswerInputs from "./AnswerInputs";
import DeleteQuestionButton from "./DeleteQuestionButton";

const QuestionEditorItem = ({
  question,
  index,
  updateQuestion,
  updateOption,
  handleDeleteQuestion,
}) => {
  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <label className="block font-medium">Question {index + 1}</label>
      <input
        type="text"
        value={question.text}
        onChange={(e) => updateQuestion(index, { text: e.target.value })}
        className="w-full px-3 py-2 border rounded mb-2"
      />
      <p className="text-sm text-gray-600 mb-2">Type: {question.type}</p>

      <AnswerInputs
        question={question}
        updateOption={(i, val) => updateOption(index, i, val)}
        updateQuestion={(val) => updateQuestion(index, val)}
      />

      <DeleteQuestionButton
        questionId={question.id}
        onDelete={() => handleDeleteQuestion(question.id, index)}
      />
    </div>
  );
};

export default QuestionEditorItem;
