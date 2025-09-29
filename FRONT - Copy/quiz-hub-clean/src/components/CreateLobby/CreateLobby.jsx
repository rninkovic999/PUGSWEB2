import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createLobby, getQuizTitles } from "../../services/lobbyService";

const CreateLobby = () => {
  const [form, setForm] = useState({
    name: "",
    timePreQuestionLimitSeconds: 30,
    quizTitle: "",
    startAt: "",
  });

  const [quizTitles, setQuizTitles] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const { ok, data } = await getQuizTitles();
        if (ok) {
          console.log("Quiz titles loaded:", JSON.stringify(data));
          setQuizTitles(data.quizzesTitles || []);
        } else {
          setErrorMessage(data.message || "Neuspešno učitavanje naziva kvizova");
        }
      } catch (error) {
        console.error("Error loading quiz titles:", error);
        setErrorMessage("Neočekivana greška pri učitavanju naziva kvizova.");
      }
    };

    fetchTitles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing
    if (successMessage) setSuccessMessage("");
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        startAt: form.startAt ? new Date(form.startAt).toISOString() : null,
      };

      console.log("Sending payload:", JSON.stringify(payload));

      const { ok, data } = await createLobby(payload);

      if (ok) {
        setSuccessMessage("Lobi je uspešno kreiran!");
        setErrorMessage("");
        setForm({
          name: "",
          timePreQuestionLimitSeconds: 30,
          quizTitle: "",
          startAt: "",
        });
      } else {
        setSuccessMessage("");
        setErrorMessage(data.message || "Neuspešno kreiranje lobija");
      }
    } catch (err) {
      console.error("Lobby creation error:", err);
      setSuccessMessage("");
      setErrorMessage("Neočekivana greška pri kreiranju lobija.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-white hover:text-yellow-400 transition-colors"
          >
            QuizHub
          </Link>
          <Link
            to="/"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ← Nazad na pocetnu stranicu
          </Link>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Kreiraj novi lobi</h2>
            <p className="text-gray-400">Postavite parametre za vaš multiplayer kviz</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Naziv lobija:
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                placeholder="Unesite naziv lobija..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Vreme po pitanju (sekunde):
              </label>
              <input
                type="number"
                name="timePreQuestionLimitSeconds"
                value={form.timePreQuestionLimitSeconds}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                min={5}
                max={300}
                required
              />
              <p className="text-gray-400 text-sm mt-1">Minimum 5 sekundi, maksimum 300 sekundi</p>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Izaberite kviz:
              </label>
              <select
                name="quizTitle"
                value={form.quizTitle}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                required
              >
                <option value="">Izaberite kviz...</option>
                {quizTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              {quizTitles.length === 0 && (
                <p className="text-gray-400 text-sm mt-1">Učitavanje kvizova...</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                Vreme početka:
              </label>
              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                required
              />
              <p className="text-gray-400 text-sm mt-1">Postavite kada će kviz početi</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-gray-900 transition-colors ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-300'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Kreiranje...
                </div>
              ) : (
                'Kreiraj lobi'
              )}
            </button>
          </form>

          {successMessage && (
            <div className="mt-6 bg-green-900/50 border border-green-500/50 text-green-400 p-4 rounded-xl font-medium flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl font-medium flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Nakon kreiranja, lobi će biti dostupan drugim korisnicima za pristupanje.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateLobby;