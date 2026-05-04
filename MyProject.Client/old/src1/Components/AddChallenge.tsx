import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Challenge } from "../types";

export const AddChallenge = ({
  onAdd,
}: {
  onAdd: (c: Omit<Challenge, "id">) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalDays, setGoalDays] = useState(30);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Hier käme später der POST-Request an das C# Backend
    onAdd({
      title,
      description,
      goalDays,
      daysActive: 0,
      isCompleted: false,
    });
    if (title.trim().length < 3) {
      alert("Please longer title!");
      return;
    }

    // Zurück zum Dashboard
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Neue Challenge starten
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Titel */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Titel der Challenge
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. 30 Tage C# lernen"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Beschreibung
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Was ist dein Ziel?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Ziel-Tage */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Dauer (Tage)
          </label>
          <input
            type="number"
            value={goalDays}
            onChange={(e) => setGoalDays(parseInt(e.target.value))}
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:shadow-lg hover:opacity-90 transition-all active:scale-95"
          >
            Challenge erstellen
          </button>
        </div>
      </form>
    </div>
  );
};
