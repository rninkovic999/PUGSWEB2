import React from "react";
import QuestionItem from "./QuestionItem";

const QuestionsList = ({ questions }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Questions</h3>
      <ul className="space-y-4">
        {questions.map((q, idx) => (
          <QuestionItem key={q.id} question={q} index={idx} />
        ))}
      </ul>
    </div>
  );
};

export default QuestionsList;
