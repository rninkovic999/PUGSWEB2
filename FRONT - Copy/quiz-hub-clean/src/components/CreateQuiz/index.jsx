import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createQuizRequest } from "../../models/createQuizRequestModel";
import { createQuiz } from "../../services/quizService";
import { createFieldErrorObject } from "../../models/fieldErrorModel";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccessMessage("");
    setIsSubmitting(true);

    const difficultyValue = parseInt(formData.difficulty, 10);
    if (difficultyValue < 1 || difficultyValue > 3) {
      setFieldErrors({ Difficulty: "Težina mora biti između 1 i 3." });
      setIsSubmitting(false);
      return;
    }

    const timeLimitValue = parseInt(formData.timeLimitSeconds, 10);
    if (timeLimitValue <= 0) {
      setFieldErrors({ TimeLimitSeconds: "Vremensko ograničenje mora biti veće od 0." });
      setIsSubmitting(false);
      return;
    }

    const request = createQuizRequest(
      formData.title,
      formData.description,
      formData.category,
      timeLimitValue,
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
              "Kreiranje kviza nije uspelo.",
          });
        }
        return;
      }

      setSuccessMessage(data.message || "Kviz je uspešno kreiran! Osvežavanje...");
      
      // >>> IZMENA JE OVDE: Osvežavanje stranice nakon 1 sekunde <<<
      setTimeout(() => {
        // window.location.reload() osvežava celu stranicu
        window.location.reload(); 
      }, 1000); // 1000ms = 1 sekunda

    } catch (error) {
      setFieldErrors({ general: "Greška mreže ili server nije dostupan" });
    } finally {
      // isSubmitting postavljamo na false tek nakon timeout-a ako se koristi preusmeravanje/reload
      // ili ga možemo ostaviti ovde da se dugme otključa, ali pošto sledi reload, nije kritično
      // Ostavljamo ovde, jer u slučaju greške, dugme mora biti otključano.
      // U slučaju uspeha, reload će prekinuti dalje izvršavanje.
      if (!successMessage) {
         setIsSubmitting(false);
      }
    }
  };

  const renderField = (field, label, placeholder, type = "text") => {
    const fieldKey = field.charAt(0).toUpperCase() + field.slice(1);
    
    return (
      <div className="mb-6">
        <label className="block mb-2 text-gray-300 font-medium">
          {label}
        </label>
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
            fieldErrors[fieldKey] ? "border-red-500" : "border-gray-600"
          }`}
          required
          min={type === "number" ? (field === "difficulty" ? 1 : 0) : undefined}
          max={type === "number" && field === "difficulty" ? 3 : undefined}
        />
        {fieldErrors[fieldKey] && (
          <p className="text-red-500 text-sm mt-2">{fieldErrors[fieldKey]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
        <Link
          to="/"
          className="block w-full text-3xl font-bold mb-6 text-center text-white hover:text-yellow-400 transition-colors"
        >
          QuizHub
        </Link>

        <h2 className="text-2xl font-bold text-center text-white mb-8">
          Kreiraj Kviz
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderField("title", "Naslov", "Unesite naslov kviza")}
          
          {renderField("description", "Opis", "Unesite opis kviza")}
          
          {renderField("category", "Kategorija", "Unesite kategoriju kviza")}
          
          {renderField("timeLimitSeconds", "Vremensko ograničenje (sekunde)", "Unesite vreme u sekundama", "number")}
          
          <div className="mb-6">
            <label className="block mb-2 text-gray-300 font-medium">
              Težina (1-3)
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) => handleChange("difficulty", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border ${
                fieldErrors.Difficulty ? "border-red-500" : "border-gray-600"
              }`}
              required
            >
              <option value="">Izaberite težinu</option>
              <option value="1">1 - Lako</option>
              <option value="2">2 - Srednje</option>
              <option value="3">3 - Teško</option>
            </select>
            {fieldErrors.Difficulty && (
              <p className="text-red-500 text-sm mt-2">{fieldErrors.Difficulty}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900 border-t-transparent"></div>
                Kreiram kviz...
              </>
            ) : (
              "Kreiraj kviz"
            )}
          </button>

          {/* General Error */}
          {fieldErrors.general && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl text-center font-medium">
              {fieldErrors.general}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-900/50 border border-green-500/50 text-green-400 p-4 rounded-xl text-center font-medium">
              {successMessage}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-gray-400">
          <Link to="/" className="text-yellow-400 hover:underline">
            ← Nazad na pocetnu stranicu
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateQuiz;