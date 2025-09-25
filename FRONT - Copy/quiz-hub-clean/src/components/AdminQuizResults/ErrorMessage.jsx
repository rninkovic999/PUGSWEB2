import React from "react";

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorMessage;
