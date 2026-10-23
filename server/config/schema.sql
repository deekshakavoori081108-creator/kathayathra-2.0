-- Katha Yatra PostgreSQL Production Schema

DROP TABLE IF EXISTS user_unlocked_stories CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS game_levels CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
    required_level_threshold INT NOT NULL, -- e.g., level 2 unlocks chapter 1
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

-- Indices for performance
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_track ON user_progress(track_id);
CREATE INDEX idx_game_levels_track ON game_levels(track_id);
CREATE INDEX idx_stories_track ON stories(track_id);
CREATE INDEX idx_unlocked_stories_user ON user_unlocked_stories(user_id);
