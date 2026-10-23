import { z } from "zod";

export const UserProfileSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be under 50 characters"),
  ageGroup: z.enum(["6-8", "9-12", "13+"]),
  selectedTracks: z.array(z.string()).min(1, "Select at least one track")
});

export const CompleteLevelSchema = z.object({
  userId: z.number().int().positive("User ID must be valid"),
  trackId: z.number().int().positive("Track ID must be valid"),
  levelId: z.number().int().positive("Level ID must be valid"),
  starsEarned: z.number().int().min(1).max(3)
});

export const AIGenerateRequestSchema = z.object({
  type: z.enum(["story", "quiz"]),
  trackTitle: z.string().min(1),
  ageGroup: z.enum(["6-8", "9-12", "13+"]).optional().default("9-12"),
  chapterNumber: z.number().int().positive().optional().default(1),
  previousCliffhanger: z.string().optional(),
  levelNumber: z.number().int().positive().optional().default(1),
  topic: z.string().optional()
});

export const StoryResponseSchema = z.object({
  title: z.string(),
  narrative: z.string(),
  cliffhanger: z.string(),
  moralLesson: z.string()
});

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4, "Must have exactly 4 options"),
  correctAnswerIndex: z.number().int().min(0).max(3),
  explanation: z.string()
});
