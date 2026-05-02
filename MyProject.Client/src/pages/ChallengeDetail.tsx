import { useParams, useNavigate } from "react-router-dom";
import { useChallenges, useLogProgress } from "../data/challengeQueries";
import { useState, useMemo } from "react";
import confetti from "canvas-confetti";

export const ChallengeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<number>(1);

  const { data: challenges, isLoading, isError } = useChallenges();
  const { mutate: logProgress, isPending } = useLogProgress(id || "");

  // Challenge aus dem Cache suchen
  const challenge = useMemo(
    () => challenges?.find((c) => String(c.id) === id),
    [challenges, id],
  );

  // --- BUSINESS LOGIC (Berechnet aus C# Rohdaten) ---
  const stats = useMemo(() => {
    if (!challenge)
      return {
        daysActive: 0,
        targetAmount: 30,
        progress: 0,
        isCompleted: false,
      };

    // 1. Fortschritt aus ProgressEntries summieren (C# List<ProgressEntry>)
    const active =
      challenge.progressEntries?.reduce(
        (sum, entry) => sum + Number(entry.amount),
        0,
      ) || 0;

    // 2. Ziel berechnen (C# StartDate/EndDate)
    let target = 30;
    if (challenge.startDate && challenge.endDate) {
      const start = new Date(challenge.startDate);
      const end = new Date(challenge.endDate);
      const diff = Math.abs(end.getTime() - start.getTime());
      target = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 30;
    }

    return {
      daysActive: active,
      targetAmount: target,
      progress: Math.min((active / target) * 100, 100),
      isCompleted: active >= target || challenge.status === 2, // Status 2 = Completed
    };
  }, [challenge]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      </div>
    );

  if (isError || !challenge)
    return (
      <div className="text-center py-20 bg-white m-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-4">
          Challenge not found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold"
        >
          Back
        </button>
      </div>
    );

  const handleLogProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (stats.isCompleted || isPending) return;

    const daysToAdd = Number(inputValue);
    if (daysToAdd <= 0) return;

    logProgress(
      {
        newTotal: daysToAdd,
        goal: stats.targetAmount,
        currentProgress: daysActive,
      },
      {
        onSuccess: (_data, variables) => {
          // Kleiner Erfolgseffekt bei jedem Log
          if (
            variables.currentProgress + variables.newTotal >=
            variables.goal
          ) {
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#10b981", "#34d399", "#ffffff"],
            });
          }
          setInputValue(1);
        },
      },
    );
  };

  const { daysActive, targetAmount, progress, isCompleted } = stats;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 animate-fadeIn">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 font-bold transition-all group"
      >
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">
          ←
        </span>{" "}
        Back to Dashboard
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100">
        {/* Hero Header */}
        <div
          className={`p-8 md:p-12 text-white transition-colors duration-500 ${isCompleted ? "bg-linear-to-br from-emerald-600 to-teal-800" : "bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900"}`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                {isCompleted ? "🏆 Goal Reached" : "🚀 Mission in Progress"}
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-4 tracking-tight leading-tight">
                {challenge.title}
              </h1>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-6xl font-black">{Math.round(progress)}%</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* Main Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                  Progress
                </h3>
                <span className="text-slate-400 font-bold text-sm">
                  {daysActive} / {targetAmount} Days
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-8 p-1.5 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 shadow-lg ${isCompleted ? "bg-emerald-500" : "bg-linear-to-r from-indigo-600 to-violet-600"}`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div
              className={`p-6 rounded-4xl border flex flex-col justify-center items-center text-center ${isCompleted ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"}`}
            >
              <span className="text-[10px] font-black text-slate-400 uppercase mb-1">
                Status
              </span>
              <span
                className={`text-xl font-black ${isCompleted ? "text-emerald-600" : "text-amber-600"}`}
              >
                {isCompleted ? "Completed" : "In Progress"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
            {/* History List */}
            <section className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Timeline History
              </h3>
              <div className="space-y-3 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                {challenge.progressEntries
                  ?.slice()
                  .reverse()
                  .map((entry, idx) => {
                    const isVeryRecent = idx === 0;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isVeryRecent ? "bg-white border-indigo-200 shadow-md scale-[1.02]" : "bg-white border-slate-100 opacity-70"}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px] font-black uppercase">
                            Log Entry
                          </span>
                          <span className="font-bold text-slate-700">
                            {new Date(entry.loggedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-indigo-600 font-black text-lg">
                            +{entry.amount}d
                          </span>
                        </div>
                      </div>
                    );
                  })}
                {(!challenge.progressEntries ||
                  challenge.progressEntries.length === 0) && (
                  <div className="text-center py-10 text-slate-400 italic">
                    No progress logs found.
                  </div>
                )}
              </div>
            </section>

            {/* Input Section */}
            <section className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner h-fit sticky top-8">
              <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">
                Log Today's Work
              </h3>
              <form onSubmit={handleLogProgress} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Days to add
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={targetAmount - daysActive}
                    value={inputValue}
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    disabled={isCompleted || isPending}
                    className="w-full bg-white border-2 border-slate-200 p-4 rounded-2xl text-xl font-bold focus:border-indigo-500 outline-none transition-all disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending || isCompleted}
                  className={`w-full p-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${isCompleted ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-slate-900 hover:bg-indigo-600 text-white hover:scale-[1.02] active:scale-95"}`}
                >
                  {isPending
                    ? "Syncing with Cloud..."
                    : isCompleted
                      ? "Goal Accomplished"
                      : "Add Progress"}
                </button>
                {!isCompleted && (
                  <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Keep going! Only {targetAmount - daysActive} days left.
                  </p>
                )}
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
