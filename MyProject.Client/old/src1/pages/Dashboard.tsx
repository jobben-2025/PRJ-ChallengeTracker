//import { useState } from "react";
import type { Challenge } from "../types";
import { ChallengeCard } from "../Components/ChallengeCard";
export default function Dashboard({ challenges }: { challenges: Challenge[] }) {
  /*   const [challenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "30 Tage C#",
      description: "Täglich 1h lernen",
      isCompleted: false,
      daysActive: 12,
    },
    {
      id: 2,
      title: "React Mastery",
      description: "Komponenten bauen",
      isCompleted: false,
      daysActive: 25,
    },
    {
      id: 3,
      title: "Täglich Joggen",
      description: "5km laufen",
      isCompleted: false,
      daysActive: 8,
    },
  ]); */
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">My Challenges</h1>
        <p className="text-gray-600">Follow your target with C# and React</p>
      </header>

      {/* Grid-Layout: 1 Spalte mobil, 2 auf Tablet, 3 auf Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            id={challenge.id}
            title={challenge.title}
            daysActive={challenge.daysActive}
            goalDays={30} // Festgelegtes Ziel, z.B. 30 Tage
          />
        ))}
      </div>
    </div>
  );
}
