import { ChallengeCard } from "../components/ChallengeCard";
import { useJoinedChallenges } from "../data/challengeQueries";
import { useMemo } from "react";

export const History = () => {
  const { data: joined = [], isLoading } = useJoinedChallenges();

  const prepareData = (c: any) => {
    const entries = c.progressEntries || c.ProgressEntries || [];
    const daysActive = entries.reduce(
      (sum: number, e: any) => sum + Number(e.amount || e.Amount || 0),
      0,
    );

    let goal = 30;
    if (c.startDate && c.endDate) {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      goal =
        Math.ceil(
          Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        ) || 30;
    }

    const isFinished =
      c.status === "Completed" || c.status === 2 || daysActive >= goal;
    return { ...c, daysActive, goalDays: goal, isCompleted: isFinished };
  };

  const completedChallenges = useMemo(
    () => joined.map(prepareData).filter((c) => c.isCompleted),
    [joined],
  );

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Your Success</h1>
      <div className="space-y-4">
        {completedChallenges.map((c) => (
          <div
            key={c.id}
            className="p-6 bg-white border border-emerald-100 rounded-2xl flex justify-between items-center shadow-sm"
          >
            <div>
              <h3 className="font-bold text-slate-800">{c.title}</h3>
              <p className="text-sm text-slate-500">
                {c.daysActive} Days masterd
              </p>
            </div>
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
              Completed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
