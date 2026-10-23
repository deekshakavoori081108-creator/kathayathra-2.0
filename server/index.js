import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import { initDb } from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware
app.use(cors({
  origin: '*', // Allows cross-origin for local development and preview
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.originalUrl.startsWith('/api')) {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount API routes
app.use('/api', apiRouter);

// Serve static frontend files if built
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexFile = path.join(clientDist, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Katha Yatra Backend</title>
            <style>
              body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90vh; text-align: center; }
              .card { background: #1e293b; padding: 2rem; border-radius: 12px; border: 1px solid #f59e0b; max-width: 500px; }
              h1 { color: #f59e0b; margin-top: 0; }
              a { color: #38bdf8; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>🌟 Katha Yatra API Running</h1>
              <p>Backend Express server is actively serving requests on port ${PORT}.</p>
              <p>To view the React client, start the Vite development server:</p>
              <code>npm run client</code>
              <p style="margin-top: 1rem;"><a href="/api/health">Check API Health</a> | <a href="/api/tracks">Browse Tracks</a></p>
            </div>
          </body>
        </html>
      `);
    }
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'production' ? "Something went wrong" : err.message
  });
});

// Startup sequence
async function startServer() {
  console.log("=================================================");
  console.log("🏛️  Starting Katha Yatra Backend Platform...");
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Validate environment variables
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.log("ℹ️  GEMINI_API_KEY is not set or using placeholder.");
    console.log("   The platform will use dynamic intelligent curriculum templates for storytelling.");
  } else {
    console.log("✨ Gemini AI SDK integrated and ready!");
  }

  // Initialize Database
  await initDb();

  app.listen(PORT, () => {
    console.log(`🚀 Katha Yatra Server listening on http://localhost:${PORT}`);
    console.log(`📖 API Documentation / Endpoints available at http://localhost:${PORT}/api/health`);
    console.log("=================================================");
  });
}

startServer();
