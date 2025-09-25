import React from "react";
import CreateQuizField from "./CreateQuizField";
import CreateQuizTimeField from "./CreateQuizTimeField";
import CreateQuizDifficultyField from "./CreateQuizDifficultyField";
import CreateQuizMessages from "./CreateQuizMessages";

const CreateQuizForm = ({
  formData,
  fieldErrors,
  successMessage,
  onChange,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-4"
    >
      <h2 className="text-2xl font-semibold text-center">Create Quiz</h2>

      <CreateQuizField
        label="Title"
        value={formData.title}
        error={fieldErrors.Title}
        onChange={(val) => onChange("title", val)}
      />
      <CreateQuizField
        label="Description"
        value={formData.description}
        error={fieldErrors.Description}
        onChange={(val) => onChange("description", val)}
      />
      <CreateQuizField
        label="Category"
        value={formData.category}
        error={fieldErrors.Category}
        onChange={(val) => onChange("category", val)}
      />

      <CreateQuizTimeField
        value={formData.timeLimitSeconds}
        error={fieldErrors.TimeLimitSeconds}
        onChange={(val) => onChange("timeLimitSeconds", val)}
      />

      <CreateQuizDifficultyField
        value={formData.difficulty}
        error={fieldErrors.Difficulty}
        onChange={(val) => onChange("difficulty", val)}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Quiz
      </button>

      <CreateQuizMessages
        generalError={fieldErrors.general}
        successMessage={successMessage}
      />
    </form>
  );
};

export default CreateQuizForm;
