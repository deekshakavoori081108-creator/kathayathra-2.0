import express from 'express';
import rateLimit from 'express-rate-limit';
import { createUser, getUserDashboard, getParentAnalytics } from '../controllers/userController.js';
import { getTracks, getTrackLevels } from '../controllers/trackController.js';
import { getLevelById, completeLevel } from '../controllers/gameController.js';
import { getStoryById } from '../controllers/storyController.js';
import { generateContent } from '../controllers/aiController.js';
import { db } from '../config/db.js';

const router = express.Router();

// Rate limiting on AI generation endpoint (Section 18: Security Requirements)
const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 20, // max 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI generation rate limit reached. Please wait a moment before embarking on another tale." }
});

// User routes
router.post('/users', createUser);
router.get('/users/:id/dashboard', getUserDashboard);
router.get('/parent/analytics/:id', getParentAnalytics);

// Tracks and levels
router.get('/tracks', getTracks);
router.get('/tracks/:trackId/levels', getTrackLevels);
router.get('/levels/:levelId', getLevelById);

// Progress and unlock loop
router.post('/progress/complete', completeLevel);

// Story reader
router.get('/stories/:storyId', getStoryById);

// Gemini AI generation
router.post('/ai/generate-content', aiLimiter, generateContent);

// System health check
router.get('/health', (req, res) => {
  res.json({
    status: "ok",
    app: "Katha Yatra",
    database: db.isPostgres() ? "PostgreSQL (Connected)" : "Local Engine (Active)",
    geminiAiReady: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
    timestamp: new Date().toISOString()
  });
});

export default router;
