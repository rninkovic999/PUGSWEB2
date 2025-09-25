import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuizRequest } from "../../models/createQuizRequestModel";
import { createQuiz } from "../../services/quizService";
import { createFieldErrorObject } from "../../models/fieldErrorModel";
import CreateQuizForm from "./CreateQuizForm";

const CreateQuiz = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    timeLimitSeconds: "",
    difficulty: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccessMessage("");

    const difficultyValue = parseInt(formData.difficulty, 10);
    if (difficultyValue < 1 || difficultyValue > 3) {
      setFieldErrors({ Difficulty: "Difficulty must be between 1 and 3." });
      return;
    }

    const request = createQuizRequest(
      formData.title,
      formData.description,
      formData.category,
      parseInt(formData.timeLimitSeconds, 10),
      difficultyValue
    );

    try {
      const response = await createQuiz(request);
      let data;

      try {
        data = await response.json();
      } catch {
        data = { ExceptionMessage: await response.text() };
      }

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setFieldErrors(createFieldErrorObject(data.errors));
        } else {
          setFieldErrors({
            general:
              data.message ||
              data.ExceptionMessage ||
              data.detail ||
              "Quiz creation failed",
          });
        }
        return;
      }

      setSuccessMessage(data.message || "Quiz created successfully!");
    } catch (error) {
      setFieldErrors({ general: "Network error or server unavailable" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <CreateQuizForm
        formData={formData}
        fieldErrors={fieldErrors}
        successMessage={successMessage}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateQuiz;
