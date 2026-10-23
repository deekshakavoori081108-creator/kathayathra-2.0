import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialTracks, initialLevels, initialStories } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let isPostgresConnected = false;

// In-Memory resilient fallback database store
class LocalDbStore {
  constructor() {
    this.users = [];
    this.tracks = JSON.parse(JSON.stringify(initialTracks));
    this.gameLevels = JSON.parse(JSON.stringify(initialLevels));
    this.stories = JSON.parse(JSON.stringify(initialStories));
    this.userProgress = [];
    this.userUnlockedStories = [];
    this.userIdCounter = 1;
    this.progressIdCounter = 1;
    this.unlockedStoryIdCounter = 1;
    this.storyIdCounter = this.stories.length + 1;
    this.initDefaultDemoUser();
  }

  initDefaultDemoUser() {
    // Pre-populate demo user so parents or new visitors can test immediately
    const demoUser = {
      id: 1,
      username: "Arjun Explorer",
      age_group: "9-12",
      selected_tracks: ["The Epic Ramayana", "Mysteries of Ancient Egypt", "Myths of Ancient Greece"],
      total_stars: 4,
      created_at: new Date().toISOString()
    };
    this.users.push(demoUser);
    this.userIdCounter = 2;

    // Give demo user Level 1 & Level 2 in Ramayana completed, and Chapter 1 unlocked
    this.userProgress.push({
      id: 1,
      user_id: 1,
      track_id: 1,
      level_id: 1,
      completed: true,
      stars_earned: 3,
      completed_at: new Date(Date.now() - 3600000).toISOString()
    });
    this.userProgress.push({
      id: 2,
      user_id: 1,
      track_id: 1,
      level_id: 2,
      completed: true,
      stars_earned: 2,
      completed_at: new Date(Date.now() - 1800000).toISOString()
    });
    this.progressIdCounter = 3;

    this.userUnlockedStories.push({
      id: 1,
      user_id: 1,
      story_id: 1,
      unlocked_at: new Date(Date.now() - 1800000).toISOString()
    });
    this.unlockedStoryIdCounter = 2;
  }

  createUser(username, ageGroup, selectedTracks) {
    const newUser = {
      id: this.userIdCounter++,
      username,
      age_group: ageGroup,
      selected_tracks: selectedTracks,
      total_stars: 0,
      created_at: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  getUserById(id) {
    return this.users.find(u => u.id === Number(id)) || null;
  }

  getAllUsers() {
    return this.users;
  }

  updateUserStars(userId, starsToAdd) {
    const user = this.getUserById(userId);
    if (user) {
      user.total_stars = (user.total_stars || 0) + Number(starsToAdd);
      return user.total_stars;
    }
    return 0;
  }

  getTracks() {
    return this.tracks;
  }

  getTrackById(trackId) {
    return this.tracks.find(t => t.id === Number(trackId)) || null;
  }

  getLevelsByTrack(trackId, userId = null) {
    const levels = this.gameLevels.filter(l => l.track_id === Number(trackId));
    levels.sort((a, b) => a.level_number - b.level_number);

    if (!userId) {
      return levels.map(l => ({ ...l, completed: false, stars_earned: 0 }));
    }

    return levels.map(level => {
      const prog = this.userProgress.find(p => p.user_id === Number(userId) && p.level_id === level.id);
      return {
        ...level,
        completed: !!(prog && prog.completed),
        stars_earned: prog ? prog.stars_earned : 0,
        completed_at: prog ? prog.completed_at : null
      };
    });
  }

  getLevelById(levelId) {
    return this.gameLevels.find(l => l.id === Number(levelId)) || null;
  }

  recordProgress(userId, trackId, levelId, starsEarned) {
    userId = Number(userId);
    trackId = Number(trackId);
    levelId = Number(levelId);
    starsEarned = Number(starsEarned);

    let prog = this.userProgress.find(p => p.user_id === userId && p.level_id === levelId);
    let isNewCompletion = false;
    let oldStars = 0;

    if (prog) {
      oldStars = prog.stars_earned || 0;
      if (starsEarned > oldStars) {
        prog.stars_earned = starsEarned;
        const diff = starsEarned - oldStars;
        this.updateUserStars(userId, diff);
      }
      prog.completed = true;
      prog.completed_at = new Date().toISOString();
    } else {
      isNewCompletion = true;
      prog = {
        id: this.progressIdCounter++,
        user_id: userId,
        track_id: trackId,
        level_id: levelId,
        completed: true,
        stars_earned: starsEarned,
        completed_at: new Date().toISOString()
      };
      this.userProgress.push(prog);
      this.updateUserStars(userId, starsEarned);
    }

    // Count how many unique levels user has completed in this track
    const completedLevelsCount = this.userProgress.filter(
      p => p.user_id === userId && p.track_id === trackId && p.completed
    ).length;

    // Check if any stories should be unlocked (required_level_threshold <= completedLevelsCount)
    const eligibleStories = this.stories.filter(
      s => s.track_id === trackId && s.required_level_threshold <= completedLevelsCount
    );

    let newlyUnlockedStory = null;
    for (const story of eligibleStories) {
      const alreadyUnlocked = this.userUnlockedStories.some(
        u => u.user_id === userId && u.story_id === story.id
      );
      if (!alreadyUnlocked) {
        this.userUnlockedStories.push({
          id: this.unlockedStoryIdCounter++,
          user_id: userId,
          story_id: story.id,
          unlocked_at: new Date().toISOString()
        });
        newlyUnlockedStory = story;
      }
    }

    return {
      progress: prog,
      completedLevelsCount,
      newlyUnlockedStory
    };
  }

  getUnlockedStories(userId) {
    const unlockedIds = this.userUnlockedStories
      .filter(u => u.user_id === Number(userId))
      .map(u => u.story_id);

    return this.stories
      .filter(s => unlockedIds.includes(s.id))
      .map(s => {
        const unlockRecord = this.userUnlockedStories.find(
          u => u.user_id === Number(userId) && u.story_id === s.id
        );
        const track = this.getTrackById(s.track_id);
        return {
          ...s,
          track_title: track ? track.title : "Unknown Track",
          unlocked_at: unlockRecord ? unlockRecord.unlocked_at : null
        };
      });
  }

  getStoriesByTrack(trackId) {
    return this.stories.filter(s => s.track_id === Number(trackId));
  }

  getStoryById(storyId) {
    const story = this.stories.find(s => s.id === Number(storyId));
    if (!story) return null;
    const track = this.getTrackById(story.track_id);
    return {
      ...story,
      track_title: track ? track.title : "Unknown Track"
    };
  }

  addStory(trackId, chapterNumber, requiredLevelThreshold, title, content, cliffhanger, imageUrl = null) {
    const newStory = {
      id: this.storyIdCounter++,
      track_id: Number(trackId),
      chapter_number: Number(chapterNumber),
      required_level_threshold: Number(requiredLevelThreshold),
      title,
      content,
      cliffhanger,
      image_url: imageUrl || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
      created_at: new Date().toISOString()
    };
    this.stories.push(newStory);
    return newStory;
  }
}

const localStore = new LocalDbStore();

// Attempt PostgreSQL Connection if configured
export async function initDb() {
  const dbUrl = process.env.DATABASE_URL;

  if (dbUrl && dbUrl.trim() !== '') {
    try {
      pool = new Pool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });

      const client = await pool.connect();
      console.log('✅ Connected successfully to PostgreSQL database!');
      isPostgresConnected = true;

      // Initialize schema if tables don't exist
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ PostgreSQL Schema synced successfully.');

        // Seed initial tracks if empty
        const countRes = await client.query('SELECT COUNT(*) FROM tracks');
        if (parseInt(countRes.rows[0].count, 10) === 0) {
          console.log('🌱 Seeding PostgreSQL database with initial tracks and levels...');
          for (const track of initialTracks) {
            await client.query(
              'INSERT INTO tracks (id, title, category, description, image_url, total_levels) VALUES ($1, $2, $3, $4, $5, $6)',
              [track.id, track.title, track.category, track.description, track.image_url, track.total_levels]
            );
          }
          for (const level of initialLevels) {
            await client.query(
              'INSERT INTO game_levels (id, track_id, level_number, game_type, title, content_payload) VALUES ($1, $2, $3, $4, $5, $6)',
              [level.id, level.track_id, level.level_number, level.game_type, level.title, JSON.stringify(level.content_payload)]
            );
          }
          for (const story of initialStories) {
            await client.query(
              'INSERT INTO stories (id, track_id, chapter_number, required_level_threshold, title, content, cliffhanger, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
              [story.id, story.track_id, story.chapter_number, story.required_level_threshold, story.title, story.content, story.cliffhanger, story.image_url]
            );
          }
          // Seed demo user
          await client.query(
            "INSERT INTO users (id, username, age_group, selected_tracks, total_stars) VALUES (1, 'Arjun Explorer', '9-12', ARRAY['The Epic Ramayana', 'Mysteries of Ancient Egypt', 'Myths of Ancient Greece'], 4) ON CONFLICT DO NOTHING"
          );
          await client.query(
            "INSERT INTO user_progress (user_id, track_id, level_id, completed, stars_earned) VALUES (1, 1, 1, true, 3), (1, 1, 2, true, 2) ON CONFLICT DO NOTHING"
          );
          await client.query(
            "INSERT INTO user_unlocked_stories (user_id, story_id) VALUES (1, 1) ON CONFLICT DO NOTHING"
          );
          console.log('🌱 PostgreSQL Database seeded successfully!');
        }
      }
      client.release();
      return true;
    } catch (err) {
      console.warn('⚠️ PostgreSQL connection failed:', err.message);
      console.log('🔄 Seamlessly activating Katha Yatra resilient high-performance local database engine.');
      isPostgresConnected = false;
      return false;
    }
  } else {
    console.log('ℹ️ No DATABASE_URL specified. Running with Katha Yatra in-memory & local state engine.');
    isPostgresConnected = false;
    return false;
  }
}

// Database Operations Layer (Unified interface supporting Postgres & In-Memory Fallback)
export const db = {
  isPostgres() {
    return isPostgresConnected;
  },

  async query(text, params = []) {
    if (isPostgresConnected && pool) {
      return pool.query(text, params);
    }
    throw new Error("Direct SQL query only supported on live PostgreSQL connection. Use db helper methods.");
  },

  async createUser(username, ageGroup, selectedTracks) {
    if (isPostgresConnected && pool) {
      const res = await pool.query(
        'INSERT INTO users (username, age_group, selected_tracks) VALUES ($1, $2, $3) RETURNING *',
        [username, ageGroup, selectedTracks]
      );
      return res.rows[0];
    }
    return localStore.createUser(username, ageGroup, selectedTracks);
  },

  async getUserById(id) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return localStore.getUserById(id);
  },

  async getAllUsers() {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM users ORDER BY id ASC');
      return res.rows;
    }
    return localStore.getAllUsers();
  },

  async getTracks() {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM tracks ORDER BY id ASC');
      return res.rows;
    }
    return localStore.getTracks();
  },

  async getTrackById(trackId) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM tracks WHERE id = $1', [trackId]);
      return res.rows[0] || null;
    }
    return localStore.getTrackById(trackId);
  },

  async getLevelsByTrack(trackId, userId = null) {
    if (isPostgresConnected && pool) {
      if (!userId) {
        const res = await pool.query(
          'SELECT *, false as completed, 0 as stars_earned FROM game_levels WHERE track_id = $1 ORDER BY level_number ASC',
          [trackId]
        );
        return res.rows;
      }
      const res = await pool.query(`
        SELECT gl.*, 
               COALESCE(up.completed, false) as completed,
               COALESCE(up.stars_earned, 0) as stars_earned,
               up.completed_at
        FROM game_levels gl
        LEFT JOIN user_progress up ON gl.id = up.level_id AND up.user_id = $2
        WHERE gl.track_id = $1
        ORDER BY gl.level_number ASC
      `, [trackId, userId]);
      return res.rows;
    }
    return localStore.getLevelsByTrack(trackId, userId);
  },

  async getLevelById(levelId) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM game_levels WHERE id = $1', [levelId]);
      return res.rows[0] || null;
    }
    return localStore.getLevelById(levelId);
  },

  async recordProgress(userId, trackId, levelId, starsEarned) {
    if (isPostgresConnected && pool) {
      // Upsert user_progress
      const progressRes = await pool.query(`
        INSERT INTO user_progress (user_id, track_id, level_id, completed, stars_earned, completed_at)
        VALUES ($1, $2, $3, true, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, level_id)
        DO UPDATE SET stars_earned = GREATEST(user_progress.stars_earned, $4), completed = true, completed_at = CURRENT_TIMESTAMP
        RETURNING *
      `, [userId, trackId, levelId, starsEarned]);

      // Update total stars on user table
      await pool.query(`
        UPDATE users
        SET total_stars = (SELECT COALESCE(SUM(stars_earned), 0) FROM user_progress WHERE user_id = $1)
        WHERE id = $1
      `, [userId]);

      // Count completed levels in this track
      const countRes = await pool.query(
        'SELECT COUNT(*) FROM user_progress WHERE user_id = $1 AND track_id = $2 AND completed = true',
        [userId, trackId]
      );
      const completedLevelsCount = parseInt(countRes.rows[0].count, 10);

      // Check for unlockable stories
      const storiesRes = await pool.query(
        'SELECT * FROM stories WHERE track_id = $1 AND required_level_threshold <= $2',
        [trackId, completedLevelsCount]
      );

      let newlyUnlockedStory = null;
      for (const story of storiesRes.rows) {
        const unlockRes = await pool.query(`
          INSERT INTO user_unlocked_stories (user_id, story_id)
          VALUES ($1, $2)
          ON CONFLICT (user_id, story_id) DO NOTHING
          RETURNING *
        `, [userId, story.id]);

        if (unlockRes.rows.length > 0) {
          newlyUnlockedStory = story;
        }
      }

      return {
        progress: progressRes.rows[0],
        completedLevelsCount,
        newlyUnlockedStory
      };
    }
    return localStore.recordProgress(userId, trackId, levelId, starsEarned);
  },

  async getUnlockedStories(userId) {
    if (isPostgresConnected && pool) {
      const res = await pool.query(`
        SELECT s.*, t.title as track_title, uus.unlocked_at
        FROM user_unlocked_stories uus
        JOIN stories s ON uus.story_id = s.id
        JOIN tracks t ON s.track_id = t.id
        WHERE uus.user_id = $1
        ORDER BY uus.unlocked_at DESC
      `, [userId]);
      return res.rows;
    }
    return localStore.getUnlockedStories(userId);
  },

  async getStoriesByTrack(trackId) {
    if (isPostgresConnected && pool) {
      const res = await pool.query('SELECT * FROM stories WHERE track_id = $1 ORDER BY chapter_number ASC', [trackId]);
      return res.rows;
    }
    return localStore.getStoriesByTrack(trackId);
  },

  async getStoryById(storyId) {
    if (isPostgresConnected && pool) {
      const res = await pool.query(`
        SELECT s.*, t.title as track_title
        FROM stories s
        JOIN tracks t ON s.track_id = t.id
        WHERE s.id = $1
      `, [storyId]);
      return res.rows[0] || null;
    }
    return localStore.getStoryById(storyId);
  },

  async addStory(trackId, chapterNumber, requiredLevelThreshold, title, content, cliffhanger, imageUrl = null) {
    if (isPostgresConnected && pool) {
      const res = await pool.query(
        'INSERT INTO stories (track_id, chapter_number, required_level_threshold, title, content, cliffhanger, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [trackId, chapterNumber, requiredLevelThreshold, title, content, cliffhanger, imageUrl]
      );
      return res.rows[0];
    }
    return localStore.addStory(trackId, chapterNumber, requiredLevelThreshold, title, content, cliffhanger, imageUrl);
  }
};
