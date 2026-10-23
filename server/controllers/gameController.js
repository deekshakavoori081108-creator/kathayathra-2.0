import { db } from '../config/db.js';
import { CompleteLevelSchema } from '../../shared/schemas.js';

export async function getLevelById(req, res) {
  try {
    const levelId = Number(req.params.levelId);
    if (isNaN(levelId)) {
      return res.status(400).json({ error: "Invalid level ID" });
    }

    const level = await db.getLevelById(levelId);
    if (!level) {
      return res.status(404).json({ error: "Game level not found" });
    }

    const track = await db.getTrackById(level.track_id);

    return res.json({
      success: true,
      level: {
        ...level,
        track_title: track ? track.title : "Adventure Track"
      }
    });
  } catch (err) {
    console.error("Error fetching level:", err);
    return res.status(500).json({ error: "Failed to load game level" });
  }
}

export async function completeLevel(req, res) {
  try {
    const parseResult = CompleteLevelSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid progress submission",
        details: parseResult.error.errors
      });
    }

    const { userId, trackId, levelId, starsEarned } = parseResult.data;

    // Verify user exists
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify level exists
    const level = await db.getLevelById(levelId);
    if (!level) {
      return res.status(404).json({ error: "Level not found" });
    }

    const result = await db.recordProgress(userId, trackId, levelId, starsEarned);
    const updatedUser = await db.getUserById(userId);

    return res.json({
      success: true,
      message: "Level completed successfully!",
      starsEarned,
      totalStars: updatedUser ? updatedUser.total_stars : 0,
      completedLevelsCount: result.completedLevelsCount,
      storyUnlocked: !!result.newlyUnlockedStory,
      unlockedStory: result.newlyUnlockedStory || null
    });
  } catch (err) {
    console.error("Error completing level:", err);
    return res.status(500).json({ error: "Failed to record level completion" });
  }
}
