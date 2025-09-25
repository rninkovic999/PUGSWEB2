import React, { useEffect, useState } from "react";
import { getAllCategories, getAllQuizzes } from "../services/quizService";
import { createQuizModel } from "../models/quizModels";
import ListAllQuizzes from "./ListAllQuizes";

const QuizSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Neuspešno učitavanje kategorija.");
        }
        setCategories(data.categories);
      } catch (err) {
        setError(err.message || "Neočekivana greška.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch all quizzes once on mount (bez filtera)
  useEffect(() => {
    const fetchQuizzesOnMount = async () => {
      setError("");
      setLoading(true);
      try {
        const response = await getAllQuizzes({});
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Neuspešno učitavanje kvizova.");
        }
        setQuizzes(data.map(createQuizModel));
      } catch (err) {
        setError(err.message || "Neočekivana greška.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzesOnMount();
  }, []);

  // Search handler (sa filterima)
  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getAllQuizzes({
        keyword: keyword.trim(),
        category: category || undefined,
        difficulty: difficulty || undefined,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Neuspešno učitavanje kvizova.");
      }
      setQuizzes(data.map(createQuizModel));
    } catch (err) {
      setError(err.message || "Neočekivana greška.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
        {/* Search Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Pretraži Kvizove
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {/* Keyword Input */}
            <div className="xl:col-span-2">
              <label className="block mb-2 text-gray-300 font-medium">
                Ključne reči
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pretraži po naslovu ili opisu"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600 hover:border-gray-500 transition-colors"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Kategorija
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <option value="">Sve kategorije</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Select */}
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Težina
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <option value="">Svi nivoi</option>
                <option value="1">Lako</option>
                <option value="2">Srednje</option>
                <option value="3">Teško</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                  Pretražujem...
                </>
              ) : (
                "Pretraži"
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {/* Results Section */}
        <ListAllQuizzes quizzes={quizzes} />
      </div>
    </div>
  );
};

export default QuizSearch;