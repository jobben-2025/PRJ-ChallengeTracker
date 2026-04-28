import './App.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Navbar } from './Components/Navbar';
import Dashboard from './pages/Dashboard';
import { ChallengeDetail } from './pages/ChallengeDetail';
import { AddChallenge } from './Components/AddChallenge';
import { useState } from 'react';
import type { Challenge } from './types';
import { History } from './pages/History';

const APP_API_URL = 'The Api Frontend';

function App() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const handleAddChallenge = (newCh: Omit<Challenge, 'id'>) => {
    const challengeWithId = { ...newCh, id: Math.random() }; // Temporäre ID
    setChallenges((prev) => [...prev, challengeWithId]); // State aktualisieren
  };

  const updateChallengeDays = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, daysActive: Math.min(c.daysActive + 1, c.goalDays) }
          : c,
      ),
    );
  };
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />

          <main className="max-w-7xl mx-auto py-6">
            <Routes>
              <Route path="/" element={<Dashboard challenges={challenges} />} />
              <Route
                path="/challenge/:id"
                element={
                  <ChallengeDetail
                    challenges={challenges}
                    onUpdate={updateChallengeDays}
                  />
                }
              />

              <Route path="/history" element={<History />} />

              <Route
                path="/add"
                element={<AddChallenge onAdd={handleAddChallenge} />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
