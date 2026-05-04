import { useNavigate } from "react-router-dom";
import { ChallengeCard } from "../components/ChallengeCard";
import {
  useJoinedChallenges,
  useDiscoverChallenges,
} from "../data/challengeQueries";
import { useMemo } from "react";

export const Dashboard = () => {
  const navigate = useNavigate();

  const {
    data: joined = [],
    isLoading: loadingJoined,
    isError: errorJoined,
  } = useJoinedChallenges();

  const {
    data: discover = [],
    isLoading: loadingDiscover,
    isError: errorDiscover,
  } = useDiscoverChallenges();

  // --- 1. Hilfsfunktion zur Datenaufbereitung ---
  // Diese Funktion macht die Backend-Daten "Frontend-tauglich"
  const prepareChallengeData = (c: any) => {
    // Falls C# PascalCase (ProgressEntries) oder camelCase (progressEntries) schickt
    const entries = c.progressEntries || c.ProgressEntries || [];

    // Summe berechnen (beachtet Amount und amount)
    const daysActive = entries.reduce(
      (sum: number, e: any) => sum + Number(e.amount || e.Amount || 0),
      0,
    );

    // Ziel (Goal) aus Daten berechnen
    let goal = 30;
    const startVal = c.startDate || c.StartDate;
    const endVal = c.endDate || c.EndDate;

    if (startVal && endVal) {
      const start = new Date(startVal);
      const end = new Date(endVal);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diff = Math.abs(end.getTime() - start.getTime());
        goal = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 30;
      }
    }

    // Status prüfen (beachtet String "Completed" und Enum-Zahl 2)
    const isFinished =
      c.status === "Completed" || c.status === 2 || daysActive >= goal;

    return {
      ...c,
      daysActive,
      goalDays: goal,
      isCompleted: isFinished,
      // Wir normalisieren den Status für die Filterung
      normalizedStatus: isFinished ? "Completed" : "Active",
    };
  };

  // --- 2. Filterung (Memoized) ---
  const { activeJoined, completedJoined } = useMemo(() => {
    const prepared = joined.map(prepareChallengeData);

    return {
      activeJoined: prepared.filter((c) => c.normalizedStatus !== "Completed"),
      completedJoined: prepared.filter(
        (c) => c.normalizedStatus === "Completed",
      ),
    };
  }, [joined]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 bg-slate-100 rounded-[2.5rem] animate-pulse border border-slate-200"
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-24 animate-fadeIn">
      {/* SEKTION: MEINE AKTIVEN CHALLENGES */}
      <section>
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              My Challenges
            </h2>
            <p className="text-slate-500 font-medium">
              Keep going! Your progress is visible here.
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-5 py-2.5 rounded-full border border-indigo-100 shadow-sm">
            {activeJoined.length} Active
          </div>
        </header>

        {loadingJoined ? (
          <SkeletonGrid />
        ) : errorJoined ? (
          <div className="p-12 bg-red-50 rounded-[2.5rem] text-red-600 text-center border border-red-100">
            <p className="font-black">
              Sync Error: Could not load your progress.
            </p>
          </div>
        ) : activeJoined.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeJoined.map((c) => (
              <ChallengeCard key={c.id} {...c} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <div className="text-4xl mb-4">🚀</div>
            <p className="text-slate-900 font-black text-xl mb-1">
              No active challenges
            </p>
            <p className="text-slate-400">
              Join a mission below to get started.
            </p>
          </div>
        )}
      </section>

      <section className="pt-10">
        <div className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div>
            <h3 className="text-2xl font-black text-emerald-900">
              Du hast {completedJoined.length} Challenges gemeistert!
            </h3>
            <p className="text-emerald-700 font-medium">
              Deine Erfolge warten im Victory Vault auf dich.
            </p>
          </div>
          <button
            onClick={() => navigate("/history")}
            className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg"
          >
            History ansehen →
          </button>
        </div>
      </section>

      {/* SEKTION: DISCOVER */}
      <section className="pt-16 border-t border-slate-100">
        <header className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Discover
          </h2>
          <p className="text-slate-500 font-medium">
            Explore new goals from the community.
          </p>
        </header>

        {loadingDiscover ? (
          <SkeletonGrid />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {discover.map((c) => (
              <ChallengeCard key={c.id} {...prepareChallengeData(c)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
