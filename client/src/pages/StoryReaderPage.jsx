import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StoryReaderModal from '../components/StoryReaderModal';
import { getStoryById } from '../services/api';

export default function StoryReaderPage() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStory() {
      if (!storyId) return;
      try {
        setLoading(true);
        const data = await getStoryById(storyId);
        if (data && data.story) {
          setStory(data.story);
        }
      } catch (err) {
        setError(err.message || "Failed to load story chapter");
      } finally {
        setLoading(false);
      }
    }
    loadStory();
  }, [storyId]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-slate-400 font-semibold animate-pulse">
          Opening ancient illuminated manuscript...
        </p>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
          <p className="font-bold">{error || "Story chapter not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <StoryReaderModal story={story} />
    </div>
  );
}
