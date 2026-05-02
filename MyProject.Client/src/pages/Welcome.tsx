import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && user !== "undefined") {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
          <span className="text-sm font-bold text-indigo-600 tracking-wide uppercase">
            🚀 Bereit für die nächste Challenge?
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-8">
          Meistere deine Ziele <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">
            Schritt für Schritt.
          </span>
        </h1>

        <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto">
          Tritt Challenges bei, tracke deinen Fortschritt und erreiche deine
          persönlichen Meilensteine in einer motivierenden Umgebung.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 hover:-translate-y-1 transition-all duration-200 active:scale-95"
          >
            Jetzt Registrieren
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all duration-200"
          >
            Zum Login
          </Link>
        </div>
      </div>

      {/* Kleine Preview/Deko (Optional) */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { title: "Tracken", desc: "Halte deine Erfolge täglich fest." },
          { title: "Motivieren", desc: "Setze dir klare Ziele." },
          { title: "Erreichen", desc: "Schließe Challenges erfolgreich ab." },
        ].map((feature, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
