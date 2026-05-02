import { Link } from "react-router-dom";

type Props = {
  id: number;
  title: string;
  daysActive: number;
  goalDays: number;
};

export const ChallengeCard = ({ id, title, daysActive, goalDays }: Props) => {
  const progress = Math.min((daysActive / goalDays) * 100, 100);

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
        {title}
      </h5>

      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-700">Fortschritt</span>
        <span className="text-sm font-medium text-blue-700">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Fortschrittsbalken */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-3 text-sm text-gray-500">
        Day {daysActive} to get {goalDays}.
      </p>
      <Link
        to={`/challenge/${id}`}
        className="max-w-full flex justify-center mt-4 text-white bg-indigo-600"
      >
        {/* Text und Icon */}
        <span className="relative z-10 flex items-center gap-2">
          Details
          <svg
            xmlns="http://w3.org"
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </span>
      </Link>
    </div>
  );
};
