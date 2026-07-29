const app = require('./src/app');
const config = require('./src/config/env');
const connectDatabase = require('./src/config/database');
const logger = require('./src/utils/logger');

let server;

async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Start Express only after database connection succeeds
    server = app.listen(config.port, () => {
      logger.info(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

function shutdown(signal) {
  logger.info(`${signal} received. Shutting down gracefully...`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    logger.info('Server closed. Process exiting.');
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error(
    `Unhandled Rejection: ${
      reason instanceof Error ? reason.stack : reason
    }`
  );
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.stack}`);
  process.exit(1);
});

startServer();