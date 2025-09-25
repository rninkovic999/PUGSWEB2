import React from "react";

const ResultRow = ({ result, navigate }) => {
  const formattedDate = new Date(result.completedAt).toLocaleString();

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="px-4 py-2 font-medium">{result.quizTitle}</td>
      <td className="px-4 py-2">{formattedDate}</td>
      <td className="px-4 py-2 text-green-600 font-semibold">
        {result.correctAnswers}/{result.totalQuestions} ({result.score}%)
      </td>
      <td className="px-4 py-2">
        <button
          onClick={() => navigate(`/result/details/${result.resultId}`)}
          className="text-blue-500 hover:underline"
        >
          See More
        </button>
      </td>
    </tr>
  );
};

export default ResultRow;
