import React from "react";

const QuizResultRow = ({ result, onSeeMore }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <tr className="border-t hover:bg-gray-50 transition">
      <td className="p-3">{result.userId}</td>
      <td className="p-3">
        {result.correctAnswers}/{result.totalQuestions} ({result.score}%)
      </td>
      <td className="p-3">{formatTime(result.timeElapsedSeconds)}</td>
      <td className="p-3">{new Date(result.completedAt).toLocaleString()}</td>
      <td className="p-3">
        <button
          className="text-blue-600 hover:underline"
          onClick={() => onSeeMore(`/result/details/${result.id}/admin`)}
        >
          See More
        </button>
      </td>
    </tr>
  );
};

export default QuizResultRow;
