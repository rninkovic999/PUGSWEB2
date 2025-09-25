import React from "react";
import QuizResultRow from "./QuizResultRow";

const QuizResultsTable = ({ results, onSeeMore }) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="w-full table-auto text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3">User ID</th>
            <th className="p-3">Score</th>
            <th className="p-3">Time</th>
            <th className="p-3">Completed At</th>
            <th className="p-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => (
            <QuizResultRow key={res.id} result={res} onSeeMore={onSeeMore} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizResultsTable;
