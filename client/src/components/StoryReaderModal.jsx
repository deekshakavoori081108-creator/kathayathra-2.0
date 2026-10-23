import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Flame, Sparkles, ArrowRight, ArrowLeft, Heart, Shield, Share2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function StoryReaderModal({ story }) {
  const navigate = useNavigate();

  if (!story) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => {
            soundManager.playClick();
            navigate(-1);
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return</span>
        </button>
      </div>

      {/* Story Parchment Card */}
      <article className="rounded-3xl bg-slate-900/90 border border-amber-500/30 overflow-hidden shadow-2xl space-y-6">
        
        {/* Story Illustration Header */}
        {story.image_url && (
          <div className="h-64 sm:h-80 relative overflow-hidden bg-slate-950">
            <img
              src={story.image_url}
              alt={story.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 backdrop-blur-md">
                {story.track_title || 'Cultural Journey'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display mt-2 drop-shadow-md">
                {story.title}
              </h1>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Main Narrative Text */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-story whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:font-display first-letter:text-amber-400 first-letter:mr-3 first-letter:float-left">
              {story.content}
            </p>
          </div>

          {/* Dramatic Cliffhanger Box (Section 4 & 7) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/50 border-2 border-rose-500/40 shadow-xl space-y-3 relative overflow-hidden">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-widest">
              <Flame className="w-5 h-5 text-rose-400 animate-bounce-soft" />
              <span>The Unfolding Cliffhanger</span>
            </div>
            
            <p className="text-base sm:text-lg text-rose-100 font-story italic leading-relaxed">
              "{story.cliffhanger}"
            </p>

            <p className="text-xs text-amber-300 font-semibold pt-1">
              ⚔️ What will happen next? Play the next two game levels to unlock Chapter {(story.chapter_number || 1) + 1}!
            </p>
          </div>

          {/* Moral Lesson callout if available */}
          {story.moral_lesson && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong className="font-bold">Moral of the Legend:</strong> {story.moral_lesson}</span>
            </div>
          )}

          {/* CTAs to continue journey */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/dashboard"
              onClick={() => soundManager.playClick()}
              className="text-xs font-bold text-slate-400 hover:text-white"
            >
              Browse All Stories
            </Link>

            <Link
              to={`/track/${story.track_id}`}
              onClick={() => soundManager.playClick()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5"
            >
              <span>Play Next Levels</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </article>

    </div>
  );
}
