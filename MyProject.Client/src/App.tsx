import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";
import { Dashboard } from "./pages/Dashboard";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { RegisterForm } from "./pages/RegisterForm";

import { CreateChallenge } from "./pages/CreateChallenge";
import { History } from "./pages/History";
import { ChallengeDetail } from "./pages/ChallengeDetail";

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- ÖFFENTLICHE ROUTEN --- */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* --- PRIVATE ROUTEN (Geschützt durch ProtectedRoute) --- */}
          <Route element={<ProtectedRoute />}>
            {/* MainLayout umschließt die internen Seiten (Navbar/Sidebar) */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create" element={<CreateChallenge />} />
              <Route path="/challenges/:id" element={<ChallengeDetail />} />
              <Route path="/history" element={<History />} />
            </Route>
          </Route>

          {/* --- FALLBACK --- */}
          {/* Unbekannte Pfade leiten zur Landingpage weiter */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
