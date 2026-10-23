import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TrackRoadmap from '../components/TrackRoadmap';
import { getTrackLevels } from '../services/api';
import { useUser } from '../context/UserContext';

export default function TrackDetailPage() {
  const { trackId } = useParams();
  const { user } = useUser();

  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!trackId) return;
      try {
        setLoading(true);
        const data = await getTrackLevels(trackId, user ? user.id : null);
        setTrackData(data);
      } catch (err) {
        setError(err.message || "Failed to load track roadmap");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [trackId, user]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 font-semibold animate-pulse">
          Unrolling the ancient roadmap...
        </p>
      </div>
    );
  }

  if (error || !trackData) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <p className="font-bold">{error || "Could not load track"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TrackRoadmap
        track={trackData.track}
        levels={trackData.levels}
        stories={trackData.stories}
      />
    </div>
  );
}
