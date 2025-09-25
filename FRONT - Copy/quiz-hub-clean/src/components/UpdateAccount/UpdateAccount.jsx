import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateUser, getCurrentUser } from "../../services/userService";

const UpdateAccount = () => {
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // Učitaj trenutne podatke korisnika iz API-ja
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await getCurrentUser();
        const userData = await response.json();
        
        if (response.ok && userData.success) {
          setFormData({
            Username: userData.username || "",
            FullName: userData.fullName || "",
            Email: userData.email || "",
            Password: "", // Nikad ne učitavamo password
            ProfilePicture: null,
          });
          
          // Ako korisnik ima profilnu sliku
          if (userData.profilePicture) {
            setProfileImagePreview(
              `data:${userData.profilePictureContentType};base64,${userData.profilePicture}`
            );
          }
        } else {
          setFieldErrors({ general: "Greška pri učitavanju podataka" });
        }
      } catch (error) {
        setFieldErrors({ general: "Greška pri učitavanju podataka" });
        console.error("Greška pri učitavanju:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setSuccessMessage("");

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
    setUpdating(true);

    try {
      const response = await updateUser(formData);
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
              "Ažuriranje nije uspelo.",
          });
        }
        return;
      }

      setSuccessMessage(data.message || "Nalog je uspešno ažuriran!");
      
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setFieldErrors({ general: "Greška mreže ili server nije dostupan" });
      console.error("Ažuriranje nije uspelo:", error);
    } finally {
      setUpdating(false);
    }
  };

  const renderField = (field, label, placeholder, required = false) => {
    const type = field === "Email" ? "email" : field === "Password" ? "password" : "text";

    return (
      <div className="mb-4">
        <label htmlFor={field} className="block mb-2 text-gray-300">
          {label} {!required && <span className="text-gray-500 text-sm">(opciono)</span>}
        </label>
        <input
          type={type}
          id={field}
          name={field}
          value={formData[field]}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {fieldErrors[field] && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Učitavanje...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="max-w-md mx-auto">
        <form
          onSubmit={handleSubmit}
          className="w-full bg-gray-800 rounded-xl shadow-md p-8"
        >
          <Link
            to="/"
            className="block w-full text-3xl font-bold mb-6 text-center text-white hover:text-yellow-400 transition-colors"
          >
            QuizHub
          </Link>

          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Ažuriraj Nalog
          </h2>

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
          {renderField("Username", "Korisničko ime", "Unesite korisničko ime", true)}
          {renderField("FullName", "Ime i prezime", "Unesite ime i prezime", true)}
          {renderField("Email", "Email", "Unesite email", true)}
          {renderField("Password", "Nova lozinka", "Ostavite prazno ako ne menjate")}

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
            disabled={updating}
            className="w-full mt-2 py-2 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                Ažuriram...
              </>
            ) : (
              "Ažuriraj Nalog"
            )}
          </button>

          <p className="mt-6 text-center text-gray-400">
            <Link to="/" className="text-yellow-400 hover:underline">
              ← Nazad na početnu
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UpdateAccount;