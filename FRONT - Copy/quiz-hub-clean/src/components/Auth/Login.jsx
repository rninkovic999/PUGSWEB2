import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { createLoginRequest } from "../../models/loginRequestModel";

const Login = () => {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greske, setGreske] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreske({});

    try {
      const request = createLoginRequest(email, lozinka);
      const response = await loginUser(request);

      let data;
      try {
        data = await response.json();
      } catch {
        data = { ExceptionMessage: await response.text() };
      }

      if (!response.ok) {
        if (response.status === 401) {
          setGreske({ general: "Pogrešan email ili lozinka." });
          return;
        }

        if (data.errors && Array.isArray(data.errors)) {
          const errorsObj = {};
          for (const error of data.errors) {
            errorsObj[error.name] = error.reason;
          }
          setGreske(errorsObj);
        } else {
          setGreske({
            general:
              data.detail ||
              data.message ||
              data.ExceptionMessage ||
              "Prijava nije uspela.",
          });
        }
        return;
      }

      if (data.success) {
        localStorage.setItem("access_token", data.token);
        navigate("/");
      } else {
        setGreske({ general: data.message || "Prijava nije uspela." });
      }
    } catch (error) {
      setGreske({ general: "Neočekivana greška: " + error.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800 rounded-xl shadow-md p-8"
      >
        <Link
          to="/"
          className="block w-full text-3xl font-bold mb-6 text-center text-white hover:text-yellow-400 transition-colors"
        >
          QuizHub
        </Link>

        {/* Email input */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesite email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {greske.Email && (
            <p className="text-red-500 text-sm mt-1">{greske.Email}</p>
          )}
        </div>

        {/* Lozinka input */}
        <div className="mb-4">
          <label htmlFor="lozinka" className="block mb-2 text-gray-300">
            Lozinka
          </label>
          <input
            id="lozinka"
            type="password"
            required
            value={lozinka}
            onChange={(e) => setLozinka(e.target.value)}
            placeholder="Unesite lozinku"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          {greske.Password && (
            <p className="text-red-500 text-sm mt-1">{greske.Password}</p>
          )}
        </div>

        {/* Generalna greška */}
        {greske.general && (
          <p className="text-red-500 text-center font-medium mb-4">
            {greske.general}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 transition-colors"
        >
          Prijava
        </button>

        <p className="mt-6 text-center text-gray-400">
          Nemaš nalog?{" "}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Registruj se
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
