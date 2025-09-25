import React, { useEffect, useState } from "react";
import * as Recharts from "recharts"; 

import formatAnswer from "./formatAnswer";
import { getResultDetails } from "../../services/resultService";

// --- 1. KOMPONENTA: Vreme Trajanja ---
const TimeTaken = ({ seconds }) => {
  const formatTime = (s) => {
    if (typeof s !== 'number' || s < 0) return '0m 0s';
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <p className="mb-4 text-gray-100">
      <strong className="text-primary-400">Vreme utrošeno:</strong> {formatTime(seconds)}
    </p>
  );
};


// --- 2. KOMPONENTA: Pitanje i Odgovor ---
const QuestionItem = ({ question }) => {
  return (
    <li className="border border-gray-700 bg-gray-800 p-5 rounded-xl shadow-2xl transition duration-300 hover:border-primary-400/50 hover:shadow-primary-400/10"> 
      <p className="font-semibold mb-2 text-white">{question.text}</p>

      {question.options && (
        <div className="mb-2 ml-4">
          <p className="text-sm font-bold mb-1 text-primary-400">Opcije:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
            {question.options.map((opt, idx) => (
              <li key={idx}>
                <strong className="text-white">{idx + 1}.</strong> {opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-3 text-white">
        <strong className="text-primary-400">Vaš odgovor:</strong>{" "}
        <span
          className={question.isCorrect ? "text-green-400 font-medium" : "text-red-400 font-medium"}
        >
          {formatAnswer(question.userAnswer, question)}
        </span>
      </p>

      {!question.isCorrect && (
        <p className="text-gray-300">
          <strong className="text-blue-400">Tačan odgovor:</strong>{" "}
          <span className="font-medium">
            {formatAnswer(question.correctAnswer, question)}
          </span>
        </p>
      )}
    </li>
  );
};


// --- 3. KOMPONENTA: Grafikon Napredak (BAR CHART) ---
const ChartSection = ({ attempts }) => {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-800 p-8 rounded-xl flex items-center justify-center text-gray-400 shadow-2xl">
        Nema dostupnih podataka o pokušajima za prikaz grafikona napredovanja.
      </div>
    );
  }
  
  // MAPIRANJE PODATAKA: Dodajemo "attemptNumber"
  const chartData = attempts.map((attempt, index) => ({
    ...attempt,
    attemptNumber: index + 1, // 1, 2, 3, ...
  }));


  // KORISTIMO KOMPONENTE PREKO UVOZNOG OBJEKTA 'Recharts'
  return (
    <div className="w-full h-80 bg-gray-800 p-4 rounded-xl shadow-2xl">
      <Recharts.ResponsiveContainer width="100%" height="100%">
        <Recharts.BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <Recharts.CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} /> 
          
          {/* X-Osa: Prikazuje Broj Pokušaja (BEZ LABELE) */}
          <Recharts.XAxis
            dataKey="attemptNumber"
            stroke="#9ca3af" 
            // ❌ UKLONJENA labela: label: { value: "Pokušaj", ...}
            allowDecimals={false}
          />
          
          {/* Y-Osa: Prikazuje Tačne Odgovore (BEZ LABELE) */}
          <Recharts.YAxis
            dataKey="correctAnswers"
            stroke="#9ca3af"
            // ❌ UKLONJENA labela: label: { value: "Bodovi", ...}
            allowDecimals={false}
          />
          
          <Recharts.Tooltip 
            cursor={{ fill: '#334155', opacity: 0.5 }}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #fbbf24', color: '#fff', borderRadius: '4px' }}
            labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
            formatter={(value, name) => ([`${value} tačnih`, "Rezultat"])}
            labelFormatter={(label) => (`Pokušaj #${label}`)}
          />
          
          {/* ✅ VRACENA Legenda */}
          <Recharts.Legend 
             wrapperStyle={{ color: '#fff', paddingTop: '10px' }}
             formatter={(value, entry) => (entry.value === 'correctAnswers' ? 'Tačni Odgovori' : value)} // Osigurava da je naziv u Legendu ispravan
          />
          
          <Recharts.Bar 
            dataKey="correctAnswers" 
            name="Tačni Odgovori" // Oznaka za Legendu
            fill="#fbbf24" 
            radius={[4, 4, 0, 0]} 
          />
        </Recharts.BarChart>
      </Recharts.ResponsiveContainer>
    </div>
  );
};


// --- 4. GLAVNA KOMPONENTA: Detalji Rezultata ---
const ResultsDetails = ({ resultId }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultData = await getResultDetails(resultId); 
        setData(resultData);
      } catch (err) {
        setError(err.message || "Neuspešno učitavanje rezultata");
      }
    };

    if (resultId) {
      fetchResult();
    }
  }, [resultId]);

  if (error) return <p className="pt-24 text-red-500 max-w-4xl mx-auto px-4 bg-gray-900 min-h-screen">{error}</p>;
  if (!data) return <p className="pt-24 text-gray-400 max-w-4xl mx-auto px-4 bg-gray-900 min-h-screen">Učitavanje...</p>;

  const correctCount = data.correctCount || data.questions.filter(q => q.isCorrect).length;
  const totalQuestions = data.totalQuestions || data.questions.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white"> 
      <div className="pt-24 max-w-4xl mx-auto px-4 pb-12">
        <h1 className="text-4xl font-extrabold mb-10 text-primary-400 text-center tracking-wide">
          Detalji Rezultata Kviza
        </h1>
        
        <div className="mb-10 p-6 bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-yellow-glow-lg transition duration-500">
            <TimeTaken seconds={data.timeElapsedSeconds} />
            <p className="text-xl text-white">
                Tačno ste odgovorili na <strong className="text-primary-400 font-extrabold">{correctCount}</strong> od ukupno <strong className="text-primary-400 font-extrabold">{totalQuestions}</strong> pitanja.
            </p>
        </div>

        <h2 className="text-2xl font-bold mb-5 text-white border-b border-gray-700 pb-2">Pregled Pitanja i Odgovora</h2>
        <ul className="space-y-4 mb-10">
          {data.questions.map((q) => (
            <QuestionItem key={q.id} question={q} />
          ))}
        </ul>

        <h2 className="text-2xl font-bold mb-5 text-white border-b border-gray-700 pb-2">Napredak Kroz Pokušaje</h2>
        <ChartSection attempts={data.attempts} />
      </div>
    </div>
  );
};

export default ResultsDetails;