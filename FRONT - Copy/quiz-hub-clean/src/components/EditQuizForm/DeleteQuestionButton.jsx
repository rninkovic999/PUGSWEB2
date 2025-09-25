import React from "react";

const DeleteQuestionButton = ({ questionId, onDelete }) => (
  <button
    type="button"
    onClick={onDelete}
    className="text-sm text-red-600 hover:underline mt-3 inline-block"
  >
    Delete Question
  </button>
);

export default DeleteQuestionButton;
