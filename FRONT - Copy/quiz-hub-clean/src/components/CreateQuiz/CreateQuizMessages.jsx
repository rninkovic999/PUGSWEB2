import React from "react";

const CreateQuizMessages = ({ generalError, successMessage }) => (
  <>
    {generalError && (
      <p className="text-red-600 mt-4 text-center font-semibold">
        {generalError}
      </p>
    )}
    {successMessage && (
      <p className="text-green-600 mt-4 text-center font-semibold">
        {successMessage}
      </p>
    )}
  </>
);

export default CreateQuizMessages;
