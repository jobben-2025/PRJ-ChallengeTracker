import { useState } from 'react';
import { Challenge } from '../types';

export const History = () => {
  // Testdaten (Später kommen diese mit einem Filter vom C# Backend)
  const [completedChallenges] = useState<Challenge[]>([]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Deine Erfolge</h1>
        <p className="text-slate-500">Here your all completed challenges.</p>
      </div>

      <div className="space-y-4">
        {completedChallenges.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              {/* Grüner Haken Badge */}
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://w3.org"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{c.title}</h3>
                <p className="text-sm text-slate-500">
                  {c.daysActive} Tage erfolgreich durchgehalten
                </p>
              </div>
            </div>

            <span className="px-4 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest">
              Abgeschlossen
            </span>
          </div>
        ))}

        {completedChallenges.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">
              Noch keine abgeschlossenen Challenges. Gib Gas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
