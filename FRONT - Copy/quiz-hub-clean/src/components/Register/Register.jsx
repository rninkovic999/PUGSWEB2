import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/userService";

const Register = () => {
  const [formData, setFormData] = useState({
    Username: "",
    FullName: "",
    Email: "",
    Password: "",
    ProfilePicture: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: null }));

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (file) {
        setProfileImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccessMessage("");

    if (!formData.ProfilePicture) {
      setFieldErrors((prev) => ({
        ...prev,
        ProfilePicture: "Slika profila je obavezna.",
      }));
      return;
    }

    try {
      const response = await registerUser(formData);
      let data;

      try {
        data = await response.json();
      } catch {
        data = { ExceptionMessage: await response.text() };
      }

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorsObj = {};
          for (const error of data.errors) {
            errorsObj[error.name] = error.reason;
          }
          setFieldErrors(errorsObj);
        } else {
          setFieldErrors({
            general:
              data.Message ||
              data.ExceptionMessage ||
              data.detail ||
              "Registracija nije uspela.",
          });
        }
        return;
      }

      setSuccessMessage(data.Message || "Korisnik je uspešno registrovan!");
    } catch (error) {
      setFieldErrors({ general: "Greška mreže ili server nije dostupan" });
      console.error("Registracija nije uspela:", error);
    }
  };

  const renderField = (field, label, placeholder) => {
    const type = field === "Email" ? "email" : field === "Password" ? "password" : "text";

    return (
      <div className="mb-4">
        <label htmlFor={field} className="block mb-2 text-gray-300">
          {label}
        </label>
        <input
          type={type}
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          required
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {fieldErrors[field] && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
        )}
      </div>
    );
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

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <label htmlFor="ProfilePicture" className="relative cursor-pointer group">
            <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600 group-hover:border-yellow-400 transition-colors flex items-center justify-center text-6xl text-gray-400 group-hover:text-yellow-400">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                "???"
              )}
            </div>
            <input
              type="file"
              id="ProfilePicture"
              name="ProfilePicture"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-0 w-full text-center text-sm text-white bg-black bg-opacity-70 rounded-b-full py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Promeni
            </div>
          </label>
          {fieldErrors.ProfilePicture && (
            <p className="text-red-500 text-sm text-center mt-2">
              {fieldErrors.ProfilePicture}
            </p>
          )}
        </div>

        {/* Form Fields */}
        {renderField("Username", "Korisničko ime", "Unesite korisničko ime")}
        {renderField("FullName", "Ime i prezime", "Unesite ime i prezime")}
        {renderField("Email", "Email", "Unesite email")}
        {renderField("Password", "Lozinka", "Unesite lozinku")}

        {/* General Error */}
        {fieldErrors.general && (
          <p className="text-red-500 text-center font-medium mb-4">
            {fieldErrors.general}
          </p>
        )}

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center font-medium mb-4">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 transition-colors"
        >
          Registruj se
        </button>

        <p className="mt-6 text-center text-gray-400">
          Već imaš nalog?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Prijavi se
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;