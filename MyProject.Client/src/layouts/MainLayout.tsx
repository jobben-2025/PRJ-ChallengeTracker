import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <main className="max-w-7xl mx-auto py-10 px-4">
      <Outlet /> {/* Here render pages */}
    </main>
  </div>
);
