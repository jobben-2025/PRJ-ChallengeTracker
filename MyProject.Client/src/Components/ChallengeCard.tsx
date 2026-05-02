import { Link } from "react-router-dom";
import { useChallengeActions } from "../actions/challengeActions";

type Props = {
  id: number;
  title: string;
  daysActive: number;
  goalDays: number;
  isCompleted: boolean;
  members?: any[];
};

export const ChallengeCard = ({
  id,
  title,
  daysActive,
  goalDays,
  isCompleted,
  members = [],
}: Props) => {
  const { update, leave, isPending } = useChallengeActions();

  // Fortschrittsberechnung (max 100%)
  const progress = Math.min((daysActive / goalDays) * 100, 100);

  // Handlers mit Event-Fix für den Link
  const handleAddDay = (e: React.MouseEvent) => {
    e.preventDefault(); // Stoppt Link-Navigation
    e.stopPropagation(); // Stoppt Klick-Weitergabe

    if (daysActive < goalDays) {
      update({
        id: id.toString(),
        updates: { daysActive: daysActive + 1 },
      });
    }
  };

  const handleLeave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Möchtest du diese Challenge wirklich verlassen?")) {
      leave(id.toString());
    }
  };

  return (
    <Link
      to={`/challenges/${id}`}
      className={`group relative block min-h-[300px] w-full transition-opacity ${isPending ? "opacity-60" : "opacity-100"}`}
    >
      {/* Glow Effekt bei Hover */}
      <div className="absolute -inset-1 bg-gradient-to-tr from-slate-900 to-indigo-900 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-15 transition duration-500"></div>

      <div className="relative h-full bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group-hover:shadow-2xl group-hover:border-slate-300 group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
        <div>
          {/* Header Bereich */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-950 transition-colors tracking-tight">
                {title}
              </h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                {goalDays}-Days mission
              </p>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                isCompleted
                  ? "bg-emerald-100 text-emerald-900 border-emerald-200"
                  : "bg-slate-900 text-white border-slate-900"
              }`}
            >
              {isCompleted ? "Completed" : "Active"}
            </div>
          </div>

          {/* Progress Bereich */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-950">
                  {daysActive}
                </span>
                <span className="text-slate-500 font-bold text-base">
                  / {goalDays}
                </span>
              </div>
              <span
                className={`font-black text-sm ${progress >= 100 ? "text-emerald-600" : "text-slate-900"}`}
              >
                {Math.round(progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  progress >= 100
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100 mb-6">
          <div className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
            {members.length} Members
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white transition-all group-hover:scale-110 shadow-lg group-hover:bg-indigo-950">
            <span className="text-lg">→</span>
          </div>
        </div>

        {/* Action Buttons (Interaktion) */}
        <div className="flex gap-3 relative z-10">
          <button
            disabled={isPending || isCompleted}
            onClick={handleAddDay}
            className="flex-1 bg-slate-950 hover:bg-indigo-950 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            {isPending ? "Syncing..." : "Add Day"}
          </button>

          <button
            disabled={isPending}
            onClick={handleLeave}
            className="px-4 py-3 border-2 border-slate-100 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-2xl transition-all active:scale-95"
          >
            {isPending ? "..." : "✕"}
          </button>
        </div>
      </div>
    </Link>
  );
};
