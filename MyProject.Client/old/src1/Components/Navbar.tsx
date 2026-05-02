import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-indigo-50/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center py-4">
          {/* Logo-Bereich mit sanftem Gradient-Text */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg group-hover:rotate-6 transition-transform">
                <span className="text-white font-black text-xl">C</span>
              </div>
              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                Challenge<span className="text-slate-800">Tracker</span>
              </span>
            </Link>

            {/* Nav-Links mit animiertem Unterstrich */}
            <div className="hidden md:flex space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-gray-50 hover:text-indigo-600"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-gray-50"
                  }`
                }
              >
                Historie
              </NavLink>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center">
            <Link
              to="/add"
              className="relative inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-full hover:shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              <span className="mr-2 text-lg">+</span>
              New Challenge
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
