import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, Check, ArrowRight, BookMarked, Globe, Heart, Shield } from 'lucide-react';
import { getTracks, createUser } from '../services/api';
import { useUser } from '../context/UserContext';
import { soundManager } from '../utils/audio';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [username, setUsername] = useState('');
  const [ageGroup, setAgeGroup] = useState('9-12');
  const [selectedTracks, setSelectedTracks] = useState(['The Epic Ramayana']);

  useEffect(() => {
    async function loadTracks() {
      try {
        setLoading(true);
        const data = await getTracks();
        if (data && data.tracks) {
          setTracks(data.tracks);
        }
      } catch (err) {
        setError('Could not load cultural tracks. Please ensure backend is active.');
      } finally {
        setLoading(false);
      }
    }
    loadTracks();
  }, []);

  const toggleTrack = (trackTitle) => {
    soundManager.playClick();
    if (selectedTracks.includes(trackTitle)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter(t => t !== trackTitle));
      }
    } else {
      setSelectedTracks([...selectedTracks, trackTitle]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || username.trim().length < 2) {
      setError("Please enter a name with at least 2 characters.");
      return;
    }

    if (selectedTracks.length === 0) {
      setError("Please select at least one cultural track to begin your journey.");
      return;
    }

    try {
      setSubmitting(true);
      soundManager.playCorrect();
      const res = await createUser({
        username: username.trim(),
        ageGroup,
        selectedTracks
      });

      if (res && res.user) {
        setUser(res.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Explorer Onboarding</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
          Create Your Explorer Profile
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-base">
          Choose your adventurer name, age group, and the ancient worlds you wish to explore first.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Step 1: Name and Age */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Who is Embarking on This Yatra?</h2>
              <p className="text-xs text-slate-400">Enter your name and age so stories adapt to your level.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Adventurer's Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Diya, Rohan, Maya"
                  maxLength={40}
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-base font-medium transition-all"
                  required
                />
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Age Group
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: '6-8', label: '6 - 8 yrs', desc: 'Fables & Tales' },
                  { id: '9-12', label: '9 - 12 yrs', desc: 'Epic Lore & Maps' },
                  { id: '13+', label: '13+ yrs', desc: 'Deep History' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setAgeGroup(item.id);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      ageGroup === item.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-sm">{item.label}</div>
                    <div className="text-[10px] opacity-75 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Track Selection */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Curate Your Cultural Tracks</h2>
              <p className="text-xs text-slate-400">Select at least one track. You can explore all of them later.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 animate-pulse">
              Loading ancient realms...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tracks.map((track) => {
                const isSelected = selectedTracks.includes(track.title);
                return (
                  <div
                    key={track.id}
                    onClick={() => toggleTrack(track.title)}
                    className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-b from-slate-800 to-amber-950/30 border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    {/* Track image thumbnail banner */}
                    <div className="h-28 -mx-4 -mt-4 mb-3 relative overflow-hidden bg-slate-950">
                      <img
                        src={track.image_url}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                          isSelected ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900/80 border border-slate-600 text-transparent'
                        }`}>
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 left-3 px-2 py-0.5 rounded-full bg-slate-950/80 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        {track.category}
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-white text-base font-display">
                        {track.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {track.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{track.total_levels} Interactive Levels</span>
                      <span className="text-amber-400 font-semibold">Story Unlocks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Error message if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <span>{submitting ? 'Preparing Your Journey...' : 'Enter Katha Yatra'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
}
