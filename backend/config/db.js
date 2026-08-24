const mongoose = require('mongoose');

let isInMemoryMode = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codearena';
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[CodeArena Backend] MongoDB Connected: ${mongoose.connection.host}`);
    isInMemoryMode = false;
  } catch (error) {
    console.warn(`[CodeArena Backend] MongoDB Connection Warning: ${error.message}`);
    console.warn(`[CodeArena Backend] Running in Hybrid Memory Mode fallback (Data populated in memory for instant API responsiveness)`);
    isInMemoryMode = true;
  }
};

const getIsInMemoryMode = () => isInMemoryMode;

module.exports = { connectDB, getIsInMemoryMode };
