const mongoose = require('mongoose');
const config = require('./env');
const logger = require('../utils/logger');

async function connectDatabase() {
  try {
    await mongoose.connect(config.database.mongoUri);

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}

module.exports = connectDatabase;