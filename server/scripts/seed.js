import dotenv from 'dotenv';
import { initDb, db } from '../config/db.js';

dotenv.config();

async function runSeed() {
  console.log("🌱 Running Katha Yatra Seed Script...");
  const success = await initDb();
  if (success) {
    console.log("✅ Seed completed successfully on PostgreSQL.");
  } else {
    console.log("✅ Local in-memory seed initialized with demo user and tracks.");
  }
  process.exit(0);
}

runSeed().catch(err => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
