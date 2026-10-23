# 🏹 Katha Yatra (कथा यात्रा)
### AI-Powered Interactive Cultural & Historical Adventure Platform for Young Scholars

> **"Play the Game. Unlock the Story. Discover History."**

---

## 🌟 1. Overview & Core Mission

**Katha Yatra** is a production-grade educational web application designed to transform mobile and desktop screen time from passive consumption into an enriching odyssey of cultural discovery. 

Through serialized storytelling, game mechanics, and the official Google Gen AI SDK (`@google/genai`), Katha Yatra immerses children (ages 6–13+) in world history, ancient civilizations, sacred epics, and moral folklore.

### The Continuous Engagement Loop
```
[ Play Games & Quizzes ] 
       │
       ▼
[ Complete Every 2 Levels ] 
       │
       ▼
[ Unlock Episodic Story Chapter ] 
       │
       ▼
[ Face Dramatic Cliffhanger ] 
       │
       ▼
[ Motivated to Play Next Levels ]
```

---

## 🏛️ 2. Key Features

- **Personalized Explorer Onboarding:** Age-appropriate onboarding (`6–8 yrs`, `9–12 yrs`, `13+ yrs`) where children choose their adventurer name and curate tracks of interest.
- **Dynamic Learning Hub & Track Explorer:** High-contrast, vibrant visual cards detailing civilization tracks with level completion meters and star counters.
- **Interactive Educational Mini-Games:**
  - **Myth & Fact Quizzes:** Multi-choice questions with historical insight explanations and optional hints.
  - **Chronology Sorters:** Reorder historical milestones and epic events from earliest to latest.
  - **Artifact & Hero Matchers:** Pair ancient symbols, heroes, and artifacts with their cultural definitions and virtues.
  - **Wisdom Riddles & Puzzles:** Architectural and ethical riddles inspired by ancient sages and monuments.
- **Episodic Story Unlock Engine:** Completing every 2 levels unlocks a serialized chapter featuring illuminated illustrations, rich narrative typography, moral lessons, and suspenseful cliffhangers.
- **Intelligent Storytelling via `@google/genai`:** Integrated with Google Gemini models using strict structured JSON schemas validated via **Zod**.
- **Parental & Educator Verification Portal:** Screen time analytics, track mastery breakdown, reading comprehension logs, and COPPA safety verification.
- **Web Audio API Synthesizer & Celebrations:** Zero-dependency harmonic audio synthesizer for sound effects (fanfares, correct answers, clicks) and `canvas-confetti` reward cascades.

---

## 🛠️ 3. Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS 3.4, Lucide React icons, Canvas Confetti, React Router DOM v6.
- **Backend:** Node.js, Express 4, CORS, Express Rate Limit.
- **Database:** PostgreSQL (`pg` pool client) with production DDL schema and a resilient local memory/state fallback engine.
- **AI Integration:** Official `@google/genai` SDK with strict JSON schema response validation.
- **Validation:** Zod schemas across frontend forms, backend request bodies, and AI model outputs.

---

## 🗄️ 4. PostgreSQL Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    age_group VARCHAR(20) NOT NULL,
    selected_tracks TEXT[] NOT NULL,
    total_stars INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    total_levels INT DEFAULT 10
);

CREATE TABLE game_levels (
    id SERIAL PRIMARY KEY,
    track_id INT REFERENCES tracks(id) ON DELETE CASCADE,
    level_number INT NOT NULL,
    game_type VARCHAR(50) NOT NULL, -- 'quiz', 'chronology', 'matcher', 'puzzle'
    title VARCHAR(255) NOT NULL,
    content_payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    track_id INT REFERENCES tracks(id) ON DELETE CASCADE,
    level_id INT REFERENCES game_levels(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    stars_earned INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_level UNIQUE (user_id, level_id)
);

CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    track_id INT REFERENCES tracks(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    required_level_threshold INT NOT NULL, -- e.g. 2 levels unlocks chapter 1
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    cliffhanger TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_unlocked_stories (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    story_id INT REFERENCES stories(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_story UNIQUE (user_id, story_id)
);
```

---

## 📡 5. Backend REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status, database connection, and AI readiness |
| `POST` | `/api/users` | Create user profile with Zod validation |
| `GET` | `/api/users/:id/dashboard` | Fetch user profile, active tracks, statistics, and unlocked stories |
| `GET` | `/api/parent/analytics/:id` | Fetch aggregate parental learning analytics and reading milestones |
| `GET` | `/api/tracks` | List all cultural tracks and categories |
| `GET` | `/api/tracks/:trackId/levels` | Get all levels for a track with user completion states and unlock locks |
| `GET` | `/api/levels/:levelId` | Retrieve interactive mini-game challenge content |
| `POST` | `/api/progress/complete` | Submit level completion, award stars, and trigger story unlock if threshold is met |
| `GET` | `/api/stories/:storyId` | Retrieve episodic story chapter with narrative and cliffhanger |
| `POST` | `/api/ai/generate-content` | Rate-limited Gemini AI generation for dynamic stories or quizzes |

---

## 🚀 6. Quickstart & Local Setup

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm

### Installation
```bash
# Clone or navigate to the repository
cd kathayathra

# Install server dependencies
npm install

# Install client dependencies
npm install --prefix client
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/kathayatra
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```
*(Note: If `DATABASE_URL` is omitted, the application runs on the built-in resilient local storage engine automatically).*

### Running the Application

```bash
# Option 1: Start both backend and frontend simultaneously
npm run dev

# Option 2: Run backend only (also serves built client on http://localhost:5000)
npm run server

# Option 3: Run Vite development client (http://localhost:3000)
npm run client
```

### Running the E2E Verification Test Suite
```bash
node test_suite.js
```
Runs 12 comprehensive end-to-end tests validating all routes, user creation, level progression, 2-level story unlock triggers, cliffhanger generation, and parental analytics.

---

## 🛡️ 7. Safety, Privacy & Pedagogical Philosophy

1. **Child-Safe Content Filters:** All narrative generation prompts are strictly moderated to promote courage, ethics, empathy, and discovery without graphic violence or mature themes.
2. **Ad-Free Learning:** Zero third-party trackers or advertisements.
3. **Parental Verification:** Full transparency into curriculum concepts mastered and active learning time.
