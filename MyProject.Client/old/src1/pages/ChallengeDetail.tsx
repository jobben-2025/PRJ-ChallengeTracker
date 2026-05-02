import { useParams, useNavigate } from "react-router-dom";
import type { Challenge } from "../types";

type Props = {
  challenges: Challenge[];
  onUpdate: (id: number) => void; // Neue Prop
};

export const ChallengeDetail = ({ challenges, onUpdate }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Den passenden Eintrag anhand der ID finden
  const challenge = challenges.find((c) => c.id === Number(id));

  // Falls keine Challenge gefunden wurde (z.B. nach Refresh oder falscher ID)
  if (!challenge) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Challenge nicht gefunden.</p>
        <button
          onClick={() => navigate("/")}
          className="text-indigo-600 font-bold"
        >
          Zurück zum Dashboard
        </button>
      </div>
    );
  }

  const progress = Math.min(
    (challenge.daysActive / challenge.goalDays) * 100,
    100,
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
      >
        <svg
          xmlns="http://w3.org"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Zurück
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header-Bereich mit Farbe */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
          <h1 className="text-3xl font-black">{challenge.title}</h1>
          <p className="mt-2 text-indigo-100 opacity-90">
            {challenge.description}
          </p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Aktueller Fortschritt
              </span>
              <p className="text-2xl font-black text-slate-800">
                {challenge.daysActive} / {challenge.goalDays} Tage
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status
              </span>
              <p
                className={`text-xl font-black ${challenge.isCompleted ? "text-emerald-500" : "text-amber-500"}`}
              >
                {challenge.isCompleted ? "Abgeschlossen" : "In Arbeit"}
              </p>
            </div>
          </div>

          {/* Großer Fortschrittsbalken */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-600">
                Gesamtfortschritt
              </span>
              <span className="text-2xl font-black text-indigo-600">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-4 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => onUpdate(challenge.id)}
          disabled={challenge.daysActive >= challenge.goalDays}
          className={`px-8 py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 
            ${
              challenge.daysActive >= challenge.goalDays
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-200 hover:-translate-y-1"
            }`}
        >
          {challenge.daysActive >= challenge.goalDays
            ? "Ziel erreicht! 🎉"
            : "Tag abschließen +1"}
        </button>
      </div>
    </div>
  );
};
