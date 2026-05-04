import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAction } from "../actions/authActions";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Lokaler State für das Formular (React-Standard: camelCase)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // MAPPING: Wir übersetzen die Daten für das C#-Backend (PascalCase)
    // Entspricht deinem C# Record: RegisterRequest(Email, Password, DisplayName)
    const payload = {
      Email: formData.email,
      Password: formData.password,
      DisplayName: formData.displayName,
    };

    try {
      await registerAction(payload);
      // Erfolg: Weiterleitung zum Login
      navigate("/login");
    } catch (err: any) {
      // Fehler-Handling (z.B. Email existiert schon oder Passwort < 6 Zeichen)
      setError(
        err.message || "Registrierung fehlgeschlagen. Prüfe deine Daten.",
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                Konto erstellen
              </h2>
              <p className="text-slate-500 font-medium text-sm">
                Werde Teil der Challenge-Community.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-xl animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* DisplayName Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Anzeigename
                </label>
                <input
                  type="text"
                  required
                  placeholder="Wie sollen wir dich nennen?"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  value={formData.displayName}
                />
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Email Adresse
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@beispiel.de"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  value={formData.email}
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                  Passwort (min. 6 Zeichen)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-900"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  value={formData.password}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-4"
              >
                Jetzt registrieren
              </button>
            </form>
          </div>

          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-sm font-medium">
              Du hast schon ein Konto?{" "}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4"
              >
                Hier einloggen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
