import { db } from '../config/db.js';

export async function getTracks(req, res) {
  try {
    const tracks = await db.getTracks();
    return res.json({
      success: true,
      tracks
    });
  } catch (err) {
    console.error("Error fetching tracks:", err);
    return res.status(500).json({ error: "Failed to fetch tracks" });
  }
}

export async function getTrackLevels(req, res) {
  try {
    const trackId = Number(req.params.trackId);
    const userId = req.query.userId ? Number(req.query.userId) : null;

    if (isNaN(trackId)) {
      return res.status(400).json({ error: "Invalid track ID" });
    }

    const track = await db.getTrackById(trackId);
    if (!track) {
      return res.status(404).json({ error: "Track not found" });
    }

    const levels = await db.getLevelsByTrack(trackId, userId);
    const stories = await db.getStoriesByTrack(trackId);

    // Compute unlocking states:
    // Level 1 is always unlocked.
    // Level N is unlocked if Level N-1 is completed.
    let previousCompleted = true;
    const levelsWithLockStatus = levels.map((lvl) => {
      const isUnlocked = previousCompleted;
      previousCompleted = !!lvl.completed;
      return {
        ...lvl,
        isUnlocked
      };
    });

    return res.json({
      success: true,
      track,
      levels: levelsWithLockStatus,
      stories: stories.map(s => ({
        id: s.id,
        chapter_number: s.chapter_number,
        required_level_threshold: s.required_level_threshold,
        title: s.title,
        image_url: s.image_url
      }))
    });
  } catch (err) {
    console.error("Error fetching track levels:", err);
    return res.status(500).json({ error: "Failed to fetch track levels" });
  }
}
