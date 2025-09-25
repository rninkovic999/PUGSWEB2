import React from "react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const LeaderboardTable = ({ entries }) => (
  <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
            #
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Username
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
            Score
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
            Time
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-44">
            Completed At
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {entries.map((entry) => (
          <tr key={entry.position} className="hover:bg-gray-50">
            <td className="px-4 py-2 whitespace-nowrap">{entry.position}</td>
            <td className="px-4 py-2 whitespace-nowrap font-semibold text-gray-700">
              {entry.username}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-center">
              {entry.score}
            </td>
            <td className="px-4 py-2 whitespace-nowrap">
              {formatTime(entry.timeElapsedSeconds)}
            </td>
            <td className="px-4 py-2 whitespace-nowrap">
              {new Date(entry.completedAt).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LeaderboardTable;
