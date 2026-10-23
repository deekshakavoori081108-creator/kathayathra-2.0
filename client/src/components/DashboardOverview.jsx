import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, BookOpen, Compass, ArrowRight, Play, Sparkles, Flame, CheckCircle2, Bot } from 'lucide-react';
import { getUserDashboard } from '../services/api';
import { useUser } from '../context/UserContext';
import { soundManager } from '../utils/audio';

export default function DashboardOverview({ onOpenStory }) {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      if (!user || !user.id) return;
      try {
        setLoading(true);
        const data = await getUserDashboard(user.id);
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 font-semibold animate-pulse">
          Opening your ancient scrolls and maps...
        </p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <p className="font-bold">{error || "Unable to display dashboard"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { stats, activeTracks, allTracks, unlockedStories } = dashboardData;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Welcome & Stats Ribbon */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Young Scholar Journey</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Greetings, {user.username}! 🏛️
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Your cultural adventure is underway. Play mini-games to conquer levels and unlock the next chapters of ancient legends!
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400 mb-1 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              <span className="text-2xl font-black text-white">{stats.totalStars}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Stars</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center">
              <Trophy className="w-6 h-6 text-yellow-400 mb-1" />
              <span className="text-2xl font-black text-white">{stats.completedLevelsCount}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Levels Won</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center flex flex-col items-center">
              <BookOpen className="w-6 h-6 text-amber-400 mb-1" />
              <span className="text-2xl font-black text-white">{stats.unlockedStoriesCount}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Stories Unlocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Active Learning Tracks */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
              <Compass className="w-6 h-6 text-amber-400" />
              <span>Your Active Quests</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Pick up where you left off or conquer a new level map
            </p>
          </div>
          <Link
            to="/onboarding"
            onClick={() => soundManager.playClick()}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
          >
            Customize Tracks
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTracks.map((track) => (
            <div
              key={track.id}
              className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              {/* Image banner with overlay */}
              <div className="relative h-40 overflow-hidden bg-slate-950">
                <img
                  src={track.image_url}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 text-[11px] font-bold text-amber-300 border border-amber-500/30">
                  {track.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 backdrop-blur-md">
                  ★ {track.totalTrackStars} Stars
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white font-display mb-1.5">
                    {track.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-400">Track Mastery</span>
                    <span className="text-amber-400">
                      {track.completedLevels} / {track.totalLevels} Levels ({track.progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(track.progressPercent, 4)}%` }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-3">
                  <Link
                    to={`/track/${track.id}`}
                    onClick={() => soundManager.playClick()}
                    className="w-full py-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-amber-500 group-hover:text-slate-950"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Open Level Map</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Story Archive (Unlocked Chapters Shelf) */}
      <div id="stories" className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-400" />
              <span>Unlocked Story Chapters</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Read your episodic cliffhangers earned from every 2 completed game levels
            </p>
          </div>
        </div>

        {unlockedStories.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300 font-display">No Chapters Unlocked Yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Complete your first 2 game levels in any cultural track to unlock Chapter 1 and encounter thrilling ancient cliffhangers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedStories.map((story) => (
              <div
                key={story.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-5 shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="h-32 rounded-2xl overflow-hidden relative bg-slate-950">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      loading="lazy"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {story.track_title}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base font-display group-hover:text-amber-300 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 mt-1.5 leading-relaxed font-story italic">
                      "{story.cliffhanger}"
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400/80 font-semibold">
                    Requires Level {story.required_level_threshold}
                  </span>
                  <Link
                    to={`/story/${story.id}`}
                    onClick={() => soundManager.playClick()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                  >
                    <span>Read Tale</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
