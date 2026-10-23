import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Star, CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, Lightbulb, ArrowUp, ArrowDown, Sparkles, BookOpen } from 'lucide-react';
import { completeLevel } from '../services/api';
import { useUser } from '../context/UserContext';
import { soundManager } from '../utils/audio';

export default function GamePlayer({ level }) {
  const navigate = useNavigate();
  const { user, triggerStoryUnlock, refreshUser } = useUser();

  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'review'
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [starsAwarded, setStarsAwarded] = useState(3);
  const [unlockedStoryResult, setUnlockedStoryResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chronology game specific state
  const [chronologyItems, setChronologyItems] = useState([]);

  // Matcher game specific state
  const [matcherPairs, setMatcherPairs] = useState([]);
  const [selectedMatcherLeft, setSelectedMatcherLeft] = useState(null);
  const [completedMatches, setCompletedMatches] = useState([]);

  const payload = level.content_payload || {};

  // Initialize mini-game mechanics based on game_type
  useEffect(() => {
    setGameState('playing');
    setSelectedOption(null);
    setShowExplanation(false);
    setShowHint(false);
    setUnlockedStoryResult(null);

    if (level.game_type === 'chronology' && payload.items) {
      // Shuffle chronology items initially
      const shuffled = [...payload.items].sort(() => Math.random() - 0.5);
      setChronologyItems(shuffled);
    }

    if (level.game_type === 'matcher' && payload.pairs) {
      setMatcherPairs(payload.pairs);
      setCompletedMatches([]);
      setSelectedMatcherLeft(null);
    }
  }, [level]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  // 1. QUIZ & PUZZLE HANDLER
  const handleOptionSelect = async (index) => {
    if (selectedOption !== null || gameState !== 'playing') return;
    setSelectedOption(index);
    soundManager.playClick();

    const isCorrect = index === payload.correctAnswerIndex;
    setShowExplanation(true);

    if (isCorrect) {
      soundManager.playCorrect();
      triggerConfetti();
      const stars = showHint ? 2 : 3;
      setStarsAwarded(stars);
      setGameState('won');
      await submitProgress(stars);
    } else {
      soundManager.playWrong();
      setGameState('review');
    }
  };

  // 2. CHRONOLOGY SORTER HANDLER
  const moveChronologyItem = (index, direction) => {
    soundManager.playClick();
    const newItems = [...chronologyItems];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setChronologyItems(newItems);
  };

  const verifyChronology = async () => {
    // Check if items are ordered 1 to N
    const isCorrect = chronologyItems.every((item, idx) => item.order === idx + 1);
    if (isCorrect) {
      soundManager.playCorrect();
      triggerConfetti();
      const stars = 3;
      setStarsAwarded(stars);
      setGameState('won');
      await submitProgress(stars);
    } else {
      soundManager.playWrong();
      alert("Timeline sequence isn't quite right yet. Re-read the clues and swap them into historical order!");
    }
  };

  // 3. MATCHER HANDLER
  const handleMatcherItemClick = async (pairId) => {
    soundManager.playClick();
    if (!selectedMatcherLeft) {
      setSelectedMatcherLeft(pairId);
    } else {
      // Check if match is correct
      if (selectedMatcherLeft === pairId) {
        soundManager.playCorrect();
        const nextMatches = [...completedMatches, pairId];
        setCompletedMatches(nextMatches);
        setSelectedMatcherLeft(null);

        if (nextMatches.length === matcherPairs.length) {
          triggerConfetti();
          setStarsAwarded(3);
          setGameState('won');
          await submitProgress(3);
        }
      } else {
        soundManager.playWrong();
        setSelectedMatcherLeft(null);
      }
    }
  };

  // SUBMIT PROGRESS TO BACKEND
  const submitProgress = async (stars) => {
    if (!user || !user.id || isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await completeLevel({
        userId: user.id,
        trackId: level.track_id,
        levelId: level.id,
        starsEarned: stars
      });

      await refreshUser();

      // Check if this level unlocked an episodic story (2-level threshold!)
      if (res && res.storyUnlocked && res.unlockedStory) {
        setUnlockedStoryResult(res.unlockedStory);
        triggerStoryUnlock(res.unlockedStory);
      }
    } catch (err) {
      console.error("Failed to save progress:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    soundManager.playClick();
    setGameState('playing');
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Level Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {level.track_title} • Level {level.level_number}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
            {level.title}
          </h1>
        </div>

        <Link
          to={`/track/${level.track_id}`}
          onClick={() => soundManager.playClick()}
          className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700"
        >
          Exit Game
        </Link>
      </div>

      {/* Main Game Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6">
        
        {/* Instructions */}
        {payload.instructions && (
          <p className="text-xs font-semibold text-amber-300 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
            💡 {payload.instructions}
          </p>
        )}

        {/* ============================================================== */}
        {/* GAME TYPE 1: QUIZ & PUZZLE */}
        {/* ============================================================== */}
        {(level.game_type === 'quiz' || level.game_type === 'puzzle') && (
          <div className="space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-display leading-snug">
              {payload.question || payload.riddle}
            </h2>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {payload.options && payload.options.map((option, idx) => {
                let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-800';
                if (selectedOption !== null) {
                  if (idx === payload.correctAnswerIndex) {
                    btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 ring-2 ring-rose-500/40';
                  } else {
                    btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`p-4 rounded-2xl border text-left font-medium text-sm sm:text-base transition-all duration-200 flex items-start gap-3 shadow-md ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-700/60 text-slate-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Hint toggle */}
            {payload.hints && payload.hints.length > 0 && selectedOption === null && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setShowHint(!showHint);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>{showHint ? 'Hide Hint' : 'Need a hint? (Awards 2 stars instead of 3)'}</span>
                </button>
                {showHint && (
                  <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                    {payload.hints[0]}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* GAME TYPE 2: CHRONOLOGY SORTER */}
        {/* ============================================================== */}
        {level.game_type === 'chronology' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 font-medium">
              Use the arrows to reorder these historical events from earliest to latest:
            </p>

            <div className="space-y-2.5">
              {chronologyItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-sm sm:text-base text-slate-100 font-medium">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveChronologyItem(idx, -1)}
                      disabled={idx === 0 || gameState === 'won'}
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveChronologyItem(idx, 1)}
                      disabled={idx === chronologyItems.length - 1 || gameState === 'won'}
                      className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {gameState === 'playing' && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={verifyChronology}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  Confirm Historical Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* GAME TYPE 3: ARTIFACT / SYMBOL MATCHER */}
        {/* ============================================================== */}
        {level.game_type === 'matcher' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-300 font-medium">
              Click an ancient figure/artifact on the left, then click its corresponding definition or virtue on the right:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Items */}
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Artifacts & Heroes
                </span>
                {matcherPairs.map((pair) => {
                  const isMatched = completedMatches.includes(pair.id);
                  const isSelected = selectedMatcherLeft === pair.id;

                  return (
                    <button
                      key={pair.id}
                      onClick={() => !isMatched && handleMatcherItemClick(pair.id)}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-2xl border text-left font-bold text-sm sm:text-base transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60'
                          : isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/30'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {pair.item} {isMatched && '✓'}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Descriptions */}
              <div className="space-y-2.5">
                <span className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">
                  Sacred Meaning & Feat
                </span>
                {matcherPairs.map((pair) => {
                  const isMatched = completedMatches.includes(pair.id);
                  return (
                    <button
                      key={pair.id}
                      onClick={() => !isMatched && handleMatcherItemClick(pair.id)}
                      disabled={isMatched}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all ${
                        isMatched
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60'
                          : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-indigo-400'
                      }`}
                    >
                      {pair.match} {isMatched && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Explanation Callout */}
        {showExplanation && payload.explanation && (
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-amber-500/30 space-y-1">
            <span className="text-xs uppercase font-extrabold text-amber-400">
              Historical Insight:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-story">
              {payload.explanation}
            </p>
          </div>
        )}

        {/* Game State Victory / Review Banners */}
        {gameState === 'won' && (
          <div className="pt-4 space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    Level Conquered! You earned {starsAwarded} Stars!
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Your wisdom shines bright. Knowledge has been recorded in your scrolls.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/track/${level.track_id}`}
                  onClick={() => soundManager.playClick()}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                >
                  Return to Track
                </Link>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    // Go to next level if available
                    navigate(`/track/${level.track_id}`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Unlocked Story Callout if threshold met */}
            {unlockedStoryResult && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-900">
                      2-Level Threshold Reached!
                    </span>
                    <h4 className="font-extrabold text-base">
                      Unlocked: {unlockedStoryResult.title}
                    </h4>
                  </div>
                </div>

                <Link
                  to={`/story/${unlockedStoryResult.id}`}
                  onClick={() => soundManager.playClick()}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Read Chapter Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {gameState === 'review' && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-sm">Not quite right yet!</h4>
              <p className="text-xs text-rose-300">Every master was once an apprentice. Review the hint and try again!</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
