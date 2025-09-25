import React from "react";

const PeriodFilter = ({ period, setPeriod }) => (
  <div className="mb-6 flex justify-center">
    <label className="font-medium mr-3 self-center">Filter by period:</label>
    <select
      value={period}
      onChange={(e) => setPeriod(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="all">All time</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
    </select>
  </div>
);

export default PeriodFilter;
