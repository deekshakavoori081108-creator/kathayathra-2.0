import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, BookOpen, Trophy, Star, Award, CheckCircle, BarChart3, HeartHandshake, Sparkles } from 'lucide-react';
import { getParentAnalytics } from '../services/api';
import { useUser } from '../context/UserContext';
import { soundManager } from '../utils/audio';

export default function ParentPortalView() {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user || !user.id) return;
      try {
        setLoading(true);
        const data = await getParentAnalytics(user.id);
        setAnalytics(data);
      } catch (err) {
        setError(err.message || "Failed to load parent analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 font-semibold animate-pulse">
          Compiling educational insights and safety reports...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-300">
          <p>{error || "No analytics recorded yet."}</p>
        </div>
      </div>
    );
  }

  const { summary, tracksReport, unlockedStories } = analytics;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Parental & Educator Verification Shield</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Learning & Screen Time Analytics
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl">
          Empowering parents with clear visibility into what {analytics.user.username} is learning, cultural concepts mastered, and stories explored.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Screen Time Value</p>
            <h3 className="text-2xl font-black text-white">{summary.totalMinutesLearned} mins</h3>
            <span className="text-[10px] text-emerald-400 font-semibold">Active Learning</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Challenges Won</p>
            <h3 className="text-2xl font-black text-white">{summary.levelsMastered}</h3>
            <span className="text-[10px] text-emerald-400 font-semibold">Levels Completed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Chapters Read</p>
            <h3 className="text-2xl font-black text-white">{summary.storiesUnlocked}</h3>
            <span className="text-[10px] text-indigo-400 font-semibold">Literature Milestones</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Stars</p>
            <h3 className="text-2xl font-black text-white">{analytics.user.totalStars}</h3>
            <span className="text-[10px] text-amber-400 font-semibold">Curriculum Honors</span>
          </div>
        </div>

      </div>

      {/* Track Mastery Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>Cultural Curriculum Progress</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracksReport.map((track) => (
            <div
              key={track.trackId}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-300 uppercase">
                    {track.category}
                  </span>
                  <h3 className="text-base font-bold text-white font-display">
                    {track.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {track.completedCount} / {track.totalLevels} Done
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${(track.completedCount / track.totalLevels) * 100}%` }}
                />
              </div>

              {/* Completed list */}
              {track.levels.length > 0 ? (
                <div className="space-y-1.5 pt-1">
                  {track.levels.map((lvl, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-slate-300 py-1 border-b border-slate-800/60 last:border-0"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Level {lvl.levelNumber}: {lvl.title}</span>
                      </span>
                      <span className="text-amber-400 font-semibold flex-shrink-0">
                        {'★'.repeat(lvl.starsEarned)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Not yet started by child</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Pedagogical Note */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 flex items-start gap-4">
        <HeartHandshake className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Safe, Enriched Screen Time Guarantee</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Katha Yatra adheres to rigorous COPPA compliance standards, child-safe AI prompt filters, zero advertising, and no dark gaming patterns. Every game level is designed around historical curiosity, moral wisdom, and literary comprehension.
          </p>
        </div>
      </div>

    </div>
  );
}
