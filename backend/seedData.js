require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Problem = require('./models/Problem');
const { SEED_PROBLEMS } = require('./data/seedProblems');

const seed = async () => {
  await connectDB();
  try {
    await Problem.deleteMany({});
    await Problem.insertMany(SEED_PROBLEMS);
    console.log(`[Seed] Database seeded with ${SEED_PROBLEMS.length} problems`);
  } catch (err) {
    console.log('[Seed] Error or memory mode:', err.message);
  }
  process.exit();
};

if (require.main === module) {
  seed();
}
