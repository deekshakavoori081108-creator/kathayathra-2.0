import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import UnlockCelebrationModal from './components/UnlockCelebrationModal';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import TrackDetailPage from './pages/TrackDetailPage';
import GamePlayroomPage from './pages/GamePlayroomPage';
import StoryReaderPage from './pages/StoryReaderPage';
import ParentPortalPage from './pages/ParentPortalPage';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
          
          {/* Main Top Navigation */}
          <Navbar />

          {/* Global Celebration Modal for 2-Level Milestone Unlocks */}
          <UnlockCelebrationModal />

          {/* Primary Viewport */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/track/:trackId" element={<TrackDetailPage />} />
              <Route path="/game/:gameId" element={<GamePlayroomPage />} />
              <Route path="/story/:storyId" element={<StoryReaderPage />} />
              <Route path="/parent-portal" element={<ParentPortalPage />} />
            </Routes>
          </main>

          {/* Cultural & Safe Footer */}
          <footer className="border-t border-slate-800/80 bg-slate-900/60 py-10 mt-16 text-center text-xs text-slate-500 space-y-3">
            <div className="flex items-center justify-center gap-2 font-display text-slate-300 font-bold text-sm">
              <span>🏹 KATHA YATRA</span>
              <span className="text-amber-400">•</span>
              <span>World Heritage & Wisdom Platform</span>
            </div>
            <p className="max-w-xl mx-auto text-slate-400">
              Transforming childhood screen time through heroic legends, ancient civilizations, interactive gaming loops, and child-safe Gemini AI storytelling.
            </p>
            <div className="flex items-center justify-center gap-6 pt-2 font-medium">
              <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
              <Link to="/dashboard" className="hover:text-amber-400 transition-colors">Learning Hub</Link>
              <Link to="/parent-portal" className="hover:text-indigo-400 transition-colors">Parent Portal</Link>
              <Link to="/onboarding" className="hover:text-amber-400 transition-colors">Curate Tracks</Link>
            </div>
            <p className="text-[11px] text-slate-600 pt-2">
              Built with React, Express, Tailwind CSS, and Google Gen AI. © 2026 Katha Yatra. All rights reserved.
            </p>
          </footer>

        </div>
      </Router>
    </UserProvider>
  );
}
