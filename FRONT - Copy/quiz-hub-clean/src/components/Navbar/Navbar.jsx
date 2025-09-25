import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  getUserIdFromToken,
  getUserRoleFromToken,
} from "../../services/authService";

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);

    if (auth) {
      setUserId(getUserIdFromToken());
      setRole(getUserRoleFromToken());
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuthenticated(false);
    setRole(null);
    setUserId(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo sa razigranim upitnicima */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-xl font-bold hover:text-gray-400"
        >
          <span>QuizHub</span>
          <span className="flex space-x-1">
            <span className="text-yellow-400 font-bold text-lg">?</span>
            <span className="text-yellow-300 font-bold text-lg">?</span>
            <span className="text-yellow-500 font-bold text-lg">?</span>
          </span>
        </button>

        {/* Desna strana */}
        {!authenticated ? (
          <div className="space-x-3 flex items-center">
            <Link to="/login">
              <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-300 text-gray-900 text-sm">
                Prijava
              </button>
            </Link>

            <Link to="/register">
              <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-300 text-gray-900 text-sm">
                Registracija
              </button>
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-300 text-gray-900 font-medium"
            >
              Meni
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-md z-50">
                {/* Link za ažuriranje profila */}
                <Link
                  to="/profile/update"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profil
                </Link>

                {/* Istorija rešavanja */}
                <Link
                  to={`/profile/${userId}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Istorija rešavanja
                </Link>

                <Link
                  to="/global/leaderboard"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Rang lista
                </Link>

                <Link
                  to="/lobby/join"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Aktivni lobiji
                </Link>

                {role === "Admin" && (
                  <>
                    <Link
                      to="/quiz/admin"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      KvizAdmin
                    </Link>
                    <Link
                      to="/lobby/create"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Kreiraj lobi
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Odjava
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;