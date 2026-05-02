import { useNavigate } from "react-router-dom";
import { logoutAction } from "../actions/authActions";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem("user");
  const user =
    userString && userString !== "undefined" ? JSON.parse(userString) : null;

  const handleLogout = () => {
    logoutAction();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-10">
            {/* Dynamischer Link: Dashboard wenn eingeloggt, sonst Welcome */}
            <Link
              to={user ? "/dashboard" : "/"}
              className="group relative flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-300 to-fuchsia-300 font-black text-2xl">
                    C
                  </span>
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-800">
                Challenge<span className="text-indigo-600">.</span>
              </span>
            </Link>

            {/* Private Navigation */}
            {user && (
              <div className="hidden md:flex items-center gap-2 p-1 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/history"
                  className={({ isActive }) =>
                    `px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`
                  }
                >
                  History
                </NavLink>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-slate-600 hidden sm:block">
                  Hallo,{" "}
                  <span className="font-bold text-slate-900">
                    {user.username}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Logout
                </button>
                <Link
                  to="/create"
                  className="group relative inline-flex items-center justify-center px-7 py-3 font-bold text-white transition-all duration-200 bg-slate-900 rounded-2xl hover:bg-slate-800 shadow-[0_10px_20px_-10px_rgba(15,23,42,0.5)] active:scale-95"
                >
                  <span className="relative flex items-center gap-2 text-sm uppercase tracking-wider">
                    <span className="text-lg">+</span> New Challenge
                  </span>
                </Link>
              </>
            ) : (
              /* Buttons für Gäste */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Registrieren
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
