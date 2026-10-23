import { db } from '../config/db.js';

export async function getStoryById(req, res) {
  try {
    const storyId = Number(req.params.storyId);
    if (isNaN(storyId)) {
      return res.status(400).json({ error: "Invalid story ID" });
    }

    const story = await db.getStoryById(storyId);
    if (!story) {
      return res.status(404).json({ error: "Story chapter not found" });
    }

    return res.json({
      success: true,
      story
    });
  } catch (err) {
    console.error("Error fetching story:", err);
    return res.status(500).json({ error: "Failed to load story chapter" });
  }
}
