import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Play, Star, BookOpen, Sparkles, CheckCircle2, HelpCircle, ArrowLeft, Bot, Puzzle, History, Layers } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { generateAiContent } from '../services/api';

export default function TrackRoadmap({ track, levels, stories }) {
  const navigate = useNavigate();
  const [aiStory, setAiStory] = useState(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState(null);

  const getGameTypeIcon = (type) => {
    switch (type) {
      case 'quiz':
        return <HelpCircle className="w-5 h-5 text-amber-400" />;
      case 'chronology':
        return <History className="w-5 h-5 text-indigo-400" />;
      case 'matcher':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'puzzle':
        return <Puzzle className="w-5 h-5 text-rose-400" />;
      default:
        return <Play className="w-5 h-5 text-amber-400" />;
    }
  };

  const getGameTypeBadge = (type) => {
    switch (type) {
      case 'quiz':
        return 'Myth & Fact Quiz';
      case 'chronology':
        return 'Timeline Sorter';
      case 'matcher':
        return 'Artifact Matcher';
      case 'puzzle':
        return 'Wisdom Riddle';
      default:
        return 'Mini-Game';
    }
  };

  const handleLevelClick = (level) => {
    if (!level.isUnlocked) {
      soundManager.playWrong();
      alert(`Level ${level.level_number} is locked! Complete Level ${level.level_number - 1} first to unlock this adventure.`);
      return;
    }
    soundManager.playClick();
    navigate(`/game/${level.id}`);
  };

  const handleAskGemini = async () => {
    try {
      setGeneratingAi(true);
      setAiError(null);
      soundManager.playClick();
      const res = await generateAiContent({
        type: "story",
        trackTitle: track.title,
        chapterNumber: (stories ? stories.length : 1) + 1,
        previousCliffhanger: "Standing before the temple gates at twilight",
        ageGroup: "9-12"
      });
      if (res && res.data) {
        setAiStory(res.data);
        soundManager.playUnlockFanfare();
      }
    } catch (err) {
      setAiError(err.message || "Failed to generate AI story");
    } finally {
      setGeneratingAi(false);
    }
  };

  // Find stories that unlock at specific level thresholds
  const getStoryForThreshold = (levelNum) => {
    if (!stories) return null;
    return stories.find(s => s.required_level_threshold === levelNum);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      
      {/* Back button */}
      <div>
        <Link
          to="/dashboard"
          onClick={() => soundManager.playClick()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Hub</span>
        </Link>
      </div>

      {/* Track Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <img
            src={track.image_url}
            alt={track.title}
            className="w-full sm:w-36 h-36 rounded-2xl object-cover border border-amber-500/30 shadow-lg"
          />
          <div className="space-y-2 flex-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              {track.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              {track.title}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              {track.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
              <span>🗺️ {levels.length} Total Levels</span>
              <span className="text-amber-400">📜 2-Level Story Unlock System</span>
            </div>
          </div>
        </div>

        {/* Dynamic Gemini Lore Generator Button */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Generate an extra custom story chapter with Gemini AI!</span>
          </div>
          <button
            onClick={handleAskGemini}
            disabled={generatingAi}
            className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{generatingAi ? 'Summoning Gemini Lore...' : 'Generate AI Story Chapter'}</span>
          </button>
        </div>

        {/* Display dynamically generated AI story if triggered */}
        {aiStory && (
          <div className="mt-6 p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Gemini AI Generated Tale
              </span>
              <button
                onClick={() => setAiStory(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Dismiss
              </button>
            </div>
            <h3 className="text-lg font-bold text-white font-display">{aiStory.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-story whitespace-pre-line">
              {aiStory.narrative}
            </p>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <span className="font-bold">⚡ Cliffhanger:</span> {aiStory.cliffhanger}
            </div>
            {aiStory.moralLesson && (
              <p className="text-[11px] text-emerald-400 font-medium">
                🌱 <span className="font-bold">Moral Lesson:</span> {aiStory.moralLesson}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Visual Roadmap Path */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white font-display">
            The Journey Roadmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete each challenge to forge your path and unlock ancient chapters
          </p>
        </div>

        <div className="relative py-4 space-y-6">
          {levels.map((level, index) => {
            const milestoneStory = getStoryForThreshold(level.level_number);

            return (
              <div key={level.id} className="space-y-6">
                
                {/* Level Card */}
                <div
                  onClick={() => handleLevelClick(level)}
                  className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 group ${
                    level.completed
                      ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500 shadow-lg shadow-emerald-500/5'
                      : level.isUnlocked
                      ? 'bg-slate-900/90 border-amber-500/60 hover:border-amber-400 shadow-xl shadow-amber-500/10 hover:-translate-y-1'
                      : 'bg-slate-950/60 border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Level Number Orb */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-transform group-hover:scale-105 shadow-md ${
                      level.completed
                        ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
                        : level.isUnlocked
                        ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-500'
                    }`}>
                      {level.completed ? (
                        <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                      ) : level.isUnlocked ? (
                        level.level_number
                      ) : (
                        <Lock className="w-6 h-6 text-slate-500" />
                      )}
                    </div>

                    {/* Level Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-amber-300 border border-slate-700">
                          {getGameTypeBadge(level.game_type)}
                        </span>
                        {level.completed && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            Completed
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-white font-display group-hover:text-amber-300 transition-colors">
                        {level.title}
                      </h3>

                      {/* Stars Earned */}
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx <= (level.stars_earned || 0)
                                ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]'
                                : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Action Icon */}
                  <div>
                    {level.isUnlocked ? (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-800/60 text-slate-600 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Story Milestone Banner (fires every 2 levels) */}
                {milestoneStory && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex items-center justify-between gap-4 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                            Story Milestone
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (Unlocks upon completing Level {milestoneStory.required_level_threshold})
                          </span>
                        </div>
                        <p className="text-sm font-bold text-white font-display">
                          {milestoneStory.title}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/story/${milestoneStory.id}`}
                      onClick={() => soundManager.playClick()}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Chapter</span>
                    </Link>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
