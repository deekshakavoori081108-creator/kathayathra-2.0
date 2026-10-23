import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Star, Volume2, VolumeX, Compass, BookOpen, ShieldCheck, User, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { soundManager } from '../utils/audio';

export default function Navbar() {
  const { user, soundEnabled, toggleSound } = useUser();
  const location = useLocation();

  const handleSoundClick = () => {
    toggleSound();
    soundManager.playClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <Link 
          to="/" 
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-2xl select-none">🏹</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 font-display">
                KATHA YATRA
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Discover History • Unlock Stories • Play & Learn
            </p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/dashboard"
            onClick={() => soundManager.playClick()}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              location.pathname === '/dashboard'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Learning Hub</span>
          </Link>

          <Link
            to="/dashboard#stories"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Story Archive</span>
          </Link>

          <Link
            to="/parent-portal"
            onClick={() => soundManager.playClick()}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              location.pathname === '/parent-portal'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Parent Portal</span>
          </Link>
        </nav>

        {/* Right Action Bar: Stars, Sound, Profile */}
        <div className="flex items-center gap-3">
          
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={handleSoundClick}
            aria-label="Toggle Sound Effects"
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-400 transition-colors shadow-inner"
            title={soundEnabled ? "Mute Sound Effects" : "Enable Sound Effects"}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-amber-400 animate-pulse-glow" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {/* Stars Pill Counter */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl shadow-inner">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <div className="flex flex-col">
              <span className="text-xs text-amber-400/80 font-bold uppercase tracking-wider leading-none">
                Stars
              </span>
              <span className="text-base font-extrabold text-amber-300 leading-tight">
                {user ? user.total_stars : 0}
              </span>
            </div>
          </div>

          {/* User Profile Pill / Switch */}
          {user ? (
            <Link
              to="/onboarding"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 hover:border-amber-500/40 transition-all text-left group"
              title="Change Profile or Tracks"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                {user.username ? user.username.charAt(0).toUpperCase() : 'Y'}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors truncate max-w-[100px]">
                  {user.username}
                </p>
                <p className="text-[10px] text-slate-400 font-medium">
                  Age {user.age_group}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              to="/onboarding"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20"
            >
              Start Journey
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
