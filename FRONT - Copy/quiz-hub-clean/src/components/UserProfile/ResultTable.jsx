import React from "react";
import ResultRow from "./ResultRow";

const ResultTable = ({ results, navigate }) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Quiz Name</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => (
            <ResultRow key={res.resultId} result={res} navigate={navigate} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
