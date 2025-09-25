import React from "react";
import QuestionEditorItem from "./QuestionEditorItem";

const QuestionEditorList = ({
  questions,
  updateQuestion,
  updateOption,
  handleDeleteQuestion,
}) => (
  <div>
    <h3 className="text-xl font-semibold">Questions</h3>
    {questions.map((q, idx) => (
      <QuestionEditorItem
        key={q.id || idx}
        question={q}
        index={idx}
        updateQuestion={updateQuestion}
        updateOption={updateOption}
        handleDeleteQuestion={handleDeleteQuestion}
      />
    ))}
  </div>
);

export default QuestionEditorList;
