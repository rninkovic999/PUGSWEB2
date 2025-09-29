import React, { useEffect, useState } from "react";
import { getActiveLobbies } from "../../services/lobbyService";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaRegClock, FaLayerGroup } from "react-icons/fa";

const LobbyList = () => {
  const [lobbies, setLobbies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { ok, data } = await getActiveLobbies();
        if (ok) {
          setLobbies(data.lobbies || []);
        } else {
          setError("Greška pri učitavanju lobija.");
        }
      } catch (err) {
        setError(err.message || "Greška pri komunikaciji sa serverom.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleJoin = (lobbyId) => {
    navigate(`/lobby/join/${lobbyId}`);
  };

  const formatLobbyTime = (lobbyTime) => {
    if (!lobbyTime) return "-";
    // Dodaj Z ako nema, da bi JS tretirao kao UTC
    const isoString = lobbyTime.endsWith("Z") ? lobbyTime : lobbyTime + "Z";
    const date = new Date(isoString);
    return date.toLocaleString("sr-RS", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Europe/Belgrade",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 flex justify-center items-center">
        <p>Učitavanje aktivnih lobija...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-500 p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-primary-400">Greška</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-primary-400 border-b-2 border-gray-700/50 pb-2 text-center">
          Aktivni Lobiji za Kvizove
        </h2>

        {lobbies.length === 0 ? (
          <div className="text-center p-10 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
            <p className="text-xl text-gray-400">Trenutno nema aktivnih lobija.</p>
          </div>
        ) : (
          <ul className="space-y-6">
            {lobbies.map((lobby) => (
              <li
                key={lobby.id}
                className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 flex justify-between items-center transition duration-300 hover:border-primary-400/50 hover:shadow-primary-400/10"
              >
                <div className="space-y-1">
                  <p className="text-xl font-bold text-white mb-2">{lobby.name}</p>

                  <p className="text-sm text-gray-400 flex items-center">
                    <FaLayerGroup className="mr-2 text-primary-400" />
                    Kviz: <strong className="ml-1 text-gray-200">{lobby.quizTitle}</strong>
                  </p>

                  <p className="text-sm text-gray-400 flex items-center">
                    <FaRegClock className="mr-2 text-primary-400" />
                    Počinje u:{" "}
                    <strong className="ml-1 text-gray-200">{formatLobbyTime(lobby.startAt)}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleJoin(lobby.id)}
                  className="flex items-center bg-primary-400 text-gray-900 font-bold px-5 py-2 rounded-lg shadow-md transition duration-200 hover:bg-primary-500 hover:shadow-lg"
                >
                  <FaUserPlus className="mr-2" />
                  Pridruži se
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LobbyList;
