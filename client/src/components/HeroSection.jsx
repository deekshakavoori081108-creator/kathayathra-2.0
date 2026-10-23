import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Gamepad2, BookOpen, Trophy, ArrowRight, ShieldCheck, Flame, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-32">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-indigo-500/15 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Transforming Screen Time Into Cultural Discovery</span>
          </div>

          {/* Primary Tagline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.15]">
            Play the Game.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 drop-shadow-[0_2px_12px_rgba(245,158,11,0.3)]">
              Unlock the Story.
            </span>{' '}
            Discover History.
          </h1>

          {/* Value Proposition Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Katha Yatra takes young explorers on episodic adventures through ancient civilizations, sacred epics, and timeless world legends—fuelled by interactive games and intelligent Gemini storytelling.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/onboarding"
              onClick={() => soundManager.playClick()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <span>Begin Your Yatra</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/dashboard"
              onClick={() => soundManager.playClick()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/80 hover:border-amber-500/50 text-slate-200 font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
            >
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Explore Dashboard</span>
            </Link>
          </div>

          {/* The Loop Banner (Section 2 & 7) */}
          <div className="pt-8">
            <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-amber-500/30 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-widest font-extrabold text-amber-400 mb-4 text-center">
                The Continuous Learning Loop
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center text-center">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
                  <Gamepad2 className="w-6 h-6 text-amber-400 mb-1" />
                  <span className="text-xs font-bold text-slate-200">1. Play Games</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
                  <Trophy className="w-6 h-6 text-yellow-400 mb-1" />
                  <span className="text-xs font-bold text-slate-200">2. Complete 2 Levels</span>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex flex-col items-center col-span-2 md:col-span-1 shadow-inner">
                  <BookOpen className="w-6 h-6 text-amber-300 mb-1" />
                  <span className="text-xs font-bold text-amber-300">3. Unlock Story</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
                  <Flame className="w-6 h-6 text-rose-400 mb-1" />
                  <span className="text-xs font-bold text-slate-200">4. Face Cliffhanger</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center">
                  <ArrowRight className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-xs font-bold text-slate-200">5. Next Levels</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Cards Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Multi-Type Mini-Games
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Chronology Sorters, Artifact Matchers, Myth & Fact Quizzes, and Wisdom Riddles that test comprehension and award stars.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Episodic Cliffhangers
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every 2 completed levels unlock serialized story chapters ending on suspenseful cliffhangers that ignite curiosity to keep learning.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Safe & Parent-Approved
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Strict child-safe prompts, zero advertisements, and a transparent Parent Portal with reading logs and time analytics.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
