import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Sparkles, BookOpen, ArrowRight, X, Trophy } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { soundManager } from '../utils/audio';

export default function UnlockCelebrationModal() {
  const { celebrationData, closeCelebration } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (celebrationData) {
      // Launch celebratory confetti cascade
      try {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
      } catch (e) {}
    }
  }, [celebrationData]);

  if (!celebrationData) return null;

  const handleReadNow = () => {
    soundManager.playClick();
    const storyId = celebrationData.id;
    closeCelebration();
    navigate(`/story/${storyId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500 p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeCelebration}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebratory Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 mx-auto flex items-center justify-center shadow-xl shadow-amber-500/30 animate-bounce-soft">
          <Trophy className="w-10 h-10 text-slate-950" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            2-Level Milestone Conquered!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            New Story Chapter Unlocked!
          </h2>
          <p className="text-sm text-slate-300 max-w-sm mx-auto">
            Your courage and wisdom in the trials have unsealed an ancient episodic tale.
          </p>
        </div>

        {/* Story Card Teaser */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>Chapter {(celebrationData.chapter_number || 1)}</span>
          </div>
          <h3 className="text-lg font-bold text-white font-display">
            {celebrationData.title}
          </h3>
          <p className="text-xs text-slate-400 italic line-clamp-2 font-story">
            "{celebrationData.cliffhanger}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={closeCelebration}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Keep Playing Levels
          </button>

          <button
            onClick={handleReadNow}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
          >
            <span>Read Chapter Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
