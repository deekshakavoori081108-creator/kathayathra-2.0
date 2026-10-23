import { db } from '../config/db.js';
import { UserProfileSchema } from '../../shared/schemas.js';

export async function createUser(req, res) {
  try {
    const parseResult = UserProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation error",
        details: parseResult.error.errors
      });
    }

    const { username, ageGroup, selectedTracks } = parseResult.data;
    const user = await db.createUser(username, ageGroup, selectedTracks);

    return res.status(201).json({
      success: true,
      message: "Welcome to Katha Yatra!",
      user
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Failed to create user profile" });
  }
}

export async function getUserDashboard(req, res) {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allTracks = await db.getTracks();
    const unlockedStories = await db.getUnlockedStories(userId);

    // Calculate detailed stats per track
    const tracksWithProgress = await Promise.all(
      allTracks.map(async (track) => {
        const levels = await db.getLevelsByTrack(track.id, userId);
        const completedLevels = levels.filter(l => l.completed).length;
        const totalTrackStars = levels.reduce((acc, l) => acc + (l.stars_earned || 0), 0);
        const percent = levels.length > 0 ? Math.round((completedLevels / levels.length) * 100) : 0;
        const isSelected = Array.isArray(user.selected_tracks) && (
          user.selected_tracks.includes(track.title) ||
          user.selected_tracks.includes(String(track.id))
        );

        return {
          ...track,
          completedLevels,
          totalLevels: levels.length,
          totalTrackStars,
          progressPercent: percent,
          isSelected
        };
      })
    );

    const totalCompletedLevels = tracksWithProgress.reduce((acc, t) => acc + t.completedLevels, 0);

    return res.json({
      success: true,
      user,
      stats: {
        totalStars: user.total_stars || 0,
        completedLevelsCount: totalCompletedLevels,
        unlockedStoriesCount: unlockedStories.length,
        activeTracksCount: tracksWithProgress.filter(t => t.isSelected).length
      },
      activeTracks: tracksWithProgress.filter(t => t.isSelected || t.completedLevels > 0),
      allTracks: tracksWithProgress,
      unlockedStories
    });
  } catch (err) {
    console.error("Error fetching dashboard:", err);
    return res.status(500).json({ error: "Failed to fetch user dashboard" });
  }
}

export async function getParentAnalytics(req, res) {
  try {
    const userId = Number(req.params.id);
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const allTracks = await db.getTracks();
    const unlockedStories = await db.getUnlockedStories(userId);

    const tracksReport = await Promise.all(
      allTracks.map(async (track) => {
        const levels = await db.getLevelsByTrack(track.id, userId);
        const completed = levels.filter(l => l.completed);
        const stars = completed.reduce((sum, l) => sum + (l.stars_earned || 0), 0);
        return {
          trackId: track.id,
          title: track.title,
          category: track.category,
          totalLevels: levels.length,
          completedCount: completed.length,
          starsEarned: stars,
          levels: completed.map(l => ({
            levelNumber: l.level_number,
            title: l.title,
            gameType: l.game_type,
            starsEarned: l.stars_earned,
            completedAt: l.completed_at
          }))
        };
      })
    );

    const totalCompleted = tracksReport.reduce((acc, t) => acc + t.completedCount, 0);
    // Estimated learning time (avg 4.5 minutes per level + 6 mins per story)
    const estimatedMinutes = Math.round(totalCompleted * 4.5 + unlockedStories.length * 6);

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        ageGroup: user.age_group,
        totalStars: user.total_stars,
        joinedAt: user.created_at
      },
      summary: {
        totalMinutesLearned: estimatedMinutes,
        levelsMastered: totalCompleted,
        storiesUnlocked: unlockedStories.length,
        tracksActive: tracksReport.filter(t => t.completedCount > 0).length,
        readingComprehensionScore: unlockedStories.length > 0 ? "High (Consistent Story Engagement)" : "In Progress"
      },
      tracksReport,
      unlockedStories: unlockedStories.map(s => ({
        id: s.id,
        title: s.title,
        trackTitle: s.track_title,
        unlockedAt: s.unlocked_at
      }))
    });
  } catch (err) {
    console.error("Error fetching parent analytics:", err);
    return res.status(500).json({ error: "Failed to generate parent analytics" });
  }
}
