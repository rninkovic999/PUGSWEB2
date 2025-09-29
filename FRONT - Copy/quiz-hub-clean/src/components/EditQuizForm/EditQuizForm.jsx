import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getQuizByIdWithAnswers, updateQuiz } from "../../services/quizService";
import { deleteQuestion as deleteQuestionApi } from "../../services/questionService";
import { createFieldErrorObject } from "../../models/fieldErrorModel";
import { createEditQuizRequest } from "../../models/editQuizRequestModel";

const EditQuizForm = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
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
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { ok, data } = await getQuizByIdWithAnswers(quizId);
                if (!ok) {
                    if (data.errors) setFieldErrors(createFieldErrorObject(data.errors));
                    else setGeneralError(data.message || data.detail || "Neuspešno učitavanje kviza.");
                    return;
                }

                // KORISTI REDOSLED KAKO GA VRATI API
                setFormData({
                    title: data.title,
                    description: data.description,
                    category: data.category,
                    timeLimitSeconds: data.timeLimitSeconds,
                    difficulty: data.difficulty,
                    questions: data.questions,
                });
            } catch (error) {
                setGeneralError("Greška pri učitavanju kviza.");
            } finally {
                setLoading(false);
            }
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
        if (!window.confirm("Da li ste sigurni da želite da obrišete ovo pitanje?")) {
            return;
        }

        if (questionId) {
            const { ok, data } = await deleteQuestionApi(questionId);
            if (!ok) {
                setGeneralError(data.detail || "Brisanje pitanja nije uspelo.");
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
        setIsSubmitting(true);

        try {
            const payload = createEditQuizRequest({ id: quizId, ...formData });
            const { ok, data } = await updateQuiz(quizId, payload);

            if (!ok) {
                if (data.errors) setFieldErrors(createFieldErrorObject(data.errors));
                else setGeneralError(data.message || data.detail || "Ažuriranje kviza nije uspelo.");
                return;
            }

            setSuccessMessage("Kviz je uspešno ažuriran!");
            setTimeout(() => {
                navigate("/quiz/admin"); 
            }, 2000);
            
        } catch (error) {
            setGeneralError("Greška mreže ili server nije dostupan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const AnswerInputs = ({ question, updateOption, updateQuestion }) => {
        if (["SingleChoice", "MultipleChoice"].includes(question.type)) {
            return (
                <div className="space-y-3">
                    <h5 className="text-gray-300 font-medium">Opcije:</h5>
                    {question.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(i, e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder={`Opcija ${i + 1}`}
                            />
                            {question.type === "SingleChoice" ? (
                                <input
                                    type="radio"
                                    name={`correct-${question.id || question.clientId}`}
                                    checked={question.correctOptionIndex === i + 1}
                                    onChange={() => updateQuestion({ correctOptionIndex: i + 1 })}
                                    className="w-4 h-4 text-yellow-400"
                                />
                            ) : (
                                <input
                                    type="checkbox"
                                    checked={question.correctOptionIndices?.includes(i + 1)}
                                    onChange={(e) => {
                                        const current = question.correctOptionIndices || [];
                                        const updated = e.target.checked
                                            ? [...current, i + 1]
                                            : current.filter((val) => val !== i + 1);
                                        updateQuestion({ correctOptionIndices: updated });
                                    }}
                                    className="w-4 h-4 text-yellow-400"
                                />
                            )}
                            <span className="text-gray-300 text-sm">Tačno</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (question.type === "TrueFalse") {
            return (
                <div className="space-y-3">
                    <h5 className="text-gray-300 font-medium">Tačan odgovor:</h5>
                    <div className="flex gap-4">
                        {[
                            { value: true, label: "Tačno" },
                            { value: false, label: "Netačno" }
                        ].map(({ value, label }) => (
                            <label key={label} className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="radio"
                                    name={`truefalse-${question.id || question.clientId}`}
                                    checked={question.correctAnswerBool === value}
                                    onChange={() => updateQuestion({ correctAnswerBool: value })}
                                    className="w-4 h-4 text-yellow-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            );
        }

        if (question.type === "FillInTheBlank") {
            return (
                <div className="space-y-3">
                    <h5 className="text-gray-300 font-medium">Tačan odgovor:</h5>
                    <input
                        type="text"
                        value={question.correctAnswerText || ""}
                        onChange={(e) => updateQuestion({ correctAnswerText: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 text-white rounded border border-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Unesite tačan odgovor"
                    />
                </div>
            );
        }

        return null;
    };

    const QuestionEditorItem = ({ question, index }) => {
        const getTypeLabel = (type) => {
            switch (type) {
                case "SingleChoice": return "Jedan izbor";
                case "MultipleChoice": return "Više izbora";
                case "TrueFalse": return "Tačno/Netačno";
                case "FillInTheBlank": return "Popuni prazninu";
                default: return type;
            }
        };

        return (
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">
                        Pitanje {index + 1}
                    </h4>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-lg text-sm">
                            {getTypeLabel(question.type)}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleDeleteQuestion(question.id, index)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm"
                        >
                            Obriši
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-300 font-medium mb-2">Tekst pitanja:</label>
                    <input
                        type="text"
                        value={question.text || ""}
                        onChange={(e) => updateQuestion(index, { text: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Unesite tekst pitanja"
                    />
                </div>

                <AnswerInputs
                    question={question}
                    updateOption={(i, val) => updateOption(index, i, val)}
                    updateQuestion={(val) => updateQuestion(index, val)}
                />
            </div>
        );
    };

    const renderFormField = (name, label, type = "text") => (
        <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">{label}</label>
            {type === "select-difficulty" ? (
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        fieldErrors[name] ? "border-red-500" : "border-gray-600"
                    }`}
                    required
                >
                    <option value={1}>1 - Lako</option>
                    <option value={2}>2 - Srednje</option>
                    <option value={3}>3 - Teško</option>
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-700 text-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                        fieldErrors[name] ? "border-red-500" : "border-gray-600"
                    }`}
                    required
                    min={type === "number" ? 1 : undefined}
                    placeholder={`Unesite ${label.toLowerCase()}`}
                />
            )}
            {fieldErrors[name] && (
                <p className="text-red-500 text-sm mt-2">{fieldErrors[name]}</p>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Učitavanje kviza...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 px-4 py-8">
            <div className="max-w-4xl mx-auto pt-16">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/"
                        className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
                    >
                        QuizHub
                    </Link>
                    <Link
                        to="/quiz/admin"
                        className="text-yellow-400 hover:text-yellow-300 font-medium"
                    >
                        ← Nazad na KvizAdmin
                    </Link>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-8">
                    Uredi kviz
                </h2>

                {generalError && (
                    <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center font-medium">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="text-xl font-semibold text-white mb-6">Osnovni podaci</h3>
                        
                        {renderFormField("title", "Naslov")}
                        {renderFormField("description", "Opis")}
                        {renderFormField("category", "Kategorija")}
                        {renderFormField("timeLimitSeconds", "Vremensko ograničenje (sekunde)", "number")}
                        {renderFormField("difficulty", "Težina", "select-difficulty")}
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                Pitanja ({formData.questions.length})
                            </h3>
                            <button
                                type="button"
                                onClick={() => navigate(`/quiz/add-question/${quizId}`)}
                                className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-medium"
                            >
                                Dodaj novo pitanje
                            </button>
                        </div>
                        
                        {formData.questions.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">
                                Ovaj kviz još nema pitanja.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {formData.questions.map((q, idx) => (
                                    <QuestionEditorItem
                                        key={q.id || idx}
                                        question={q}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                                Čuvam izmene...
                            </>
                        ) : (
                            "Sačuvaj izmene"
                        )}
                    </button>

                    {successMessage && (
                        <div className="bg-green-900/50 border border-green-500/50 text-green-400 p-4 rounded-xl text-center font-medium">
                            {successMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditQuizForm;
