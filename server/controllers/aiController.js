import { AIGenerateRequestSchema } from '../../shared/schemas.js';
import { generateStoryChapter, generateDynamicQuiz } from '../services/geminiService.js';

export async function generateContent(req, res) {
  try {
    const parseResult = AIGenerateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Invalid AI request parameters",
        details: parseResult.error.errors
      });
    }

    const { type, trackTitle, ageGroup, chapterNumber, previousCliffhanger, levelNumber, topic } = parseResult.data;

    if (type === "story") {
      const story = await generateStoryChapter(trackTitle, chapterNumber, previousCliffhanger, ageGroup);
      return res.json({
        success: true,
        type: "story",
        data: story
      });
    } else if (type === "quiz") {
      const quiz = await generateDynamicQuiz(trackTitle, levelNumber, topic, ageGroup);
      return res.json({
        success: true,
        type: "quiz",
        data: quiz
      });
    }

    return res.status(400).json({ error: "Unsupported generation type" });
  } catch (err) {
    console.error("Error in AI generation controller:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
}
