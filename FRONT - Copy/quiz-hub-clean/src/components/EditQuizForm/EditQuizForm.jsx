import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByIdWithAnswers, updateQuiz } from "../../services/quizService";
import { deleteQuestion as deleteQuestionApi } from "../../services/questionService";
import { createFieldErrorObject } from "../../models/fieldErrorModel";
import { createEditQuizRequest } from "../../models/editQuizRequestModel";
import QuizFormFields from "./QuizFormFields";
import QuestionEditorList from "./QuestionEditorList";

const EditQuizForm = () => {
  const { quizId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    timeLimitSeconds: 60,
    difficulty: 1,
    questions: [],
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const { ok, data } = await getQuizByIdWithAnswers(quizId);
      if (!ok) {
        if (data.errors) setFieldErrors(createFieldErrorObject(data.errors));
        else
          setGeneralError(
            data.message || data.detail || "Failed to load quiz."
          );
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        timeLimitSeconds: data.timeLimitSeconds,
        difficulty: data.difficulty,
        questions: data.questions,
      });
    };

    fetchQuiz();
  }, [quizId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setFormData((prev) => ({
      ...prev,
      [name]: ["timeLimitSeconds", "difficulty"].includes(name)
        ? parseInt(value, 10)
        : value,
    }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        ...updatedQuestion,
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const updateOption = (questionIndex, optionIndex, newValue) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[questionIndex].options[optionIndex] = newValue;
      return { ...prev, questions };
    });
  };

  const handleDeleteQuestion = async (questionId, index) => {
    if (questionId) {
      const { ok, data } = await deleteQuestionApi(questionId);
      if (!ok) {
        setGeneralError(data.detail || "Failed to delete question.");
        return;
      }
    }
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");
    const payload = createEditQuizRequest({ id: quizId, ...formData });
    const { ok, data } = await updateQuiz(quizId, payload);

    if (!ok) {
      if (data.errors) setFieldErrors(createFieldErrorObject(data.errors));
      else
        setGeneralError(
          data.message || data.detail || "Failed to update quiz."
        );
      return;
    }

    setSuccessMessage("Quiz updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <QuizFormFields
          formData={formData}
          handleChange={handleChange}
          fieldErrors={fieldErrors}
        />
        <hr className="my-6" />
        <QuestionEditorList
          questions={formData.questions}
          updateQuestion={updateQuestion}
          updateOption={updateOption}
          handleDeleteQuestion={handleDeleteQuestion}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
        {generalError && (
          <p className="text-red-600 mt-3 text-center">{generalError}</p>
        )}
        {successMessage && (
          <p className="text-green-600 mt-3 text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default EditQuizForm;
