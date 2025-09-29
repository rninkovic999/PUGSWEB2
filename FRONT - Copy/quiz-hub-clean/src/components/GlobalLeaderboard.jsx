import React, { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../services/leaderboardService";

const GlobalLeaderboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const leaderboard = await fetchGlobalLeaderboard();
        setUsers(leaderboard);
      } catch (err) {
        setError(err.message || "Neuspešno učitavanje liste");
      }
    };
    loadLeaderboard();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-red-500 text-center text-lg font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-3xl mx-auto pt-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          Ukupna rang lista
        </h1>
        
        {users.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            Učitavanje...
          </div>
        ) : (
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-400 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute -top-2 -left-2 bg-yellow-400 text-gray-900 text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                      {index + 1}
                    </span>
                    <img
                      src={`data:${user.profilePictureContentType};base64,${user.profilePicture}`}
                      alt={user.username}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
                    />
                  </div>
                  <span className="font-medium text-xl text-white">
                    {user.username}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-yellow-400 text-xl">
                    {user.globalScore}
                  </span>
                  <div className="text-gray-400 text-sm">
                    {user.globalScore % 10 === 1 && user.globalScore % 100 !== 11
                      ? "bod" 
                      : user.globalScore % 10 >= 2 && user.globalScore % 10 <= 4 && (user.globalScore % 100 < 10 || user.globalScore % 100 >= 20)
                      ? "boda"
                      : "bodova"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GlobalLeaderboard;