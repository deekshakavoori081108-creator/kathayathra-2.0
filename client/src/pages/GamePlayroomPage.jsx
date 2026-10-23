import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import GamePlayer from '../components/GamePlayer';
import { getLevelById } from '../services/api';

export default function GamePlayroomPage() {
  const { gameId } = useParams();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadLevel() {
      if (!gameId) return;
      try {
        setLoading(true);
        const data = await getLevelById(gameId);
        if (data && data.level) {
          setLevel(data.level);
        }
      } catch (err) {
        setError(err.message || "Failed to load game playroom");
      } finally {
        setLoading(false);
      }
    }
    loadLevel();
  }, [gameId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 font-semibold animate-pulse">
          Setting up your interactive challenge...
        </p>
      </div>
    );
  }

  if (error || !level) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <p className="font-bold">{error || "Could not load level challenge"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <GamePlayer level={level} />
    </div>
  );
}
