const logger = require('../utils/logger');
const config = require('../config/env');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const isOperational = Boolean(err.isOperational);

  if (statusCode >= 500) {
    logger.error(err.stack || err.message);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`);
  }

  const message = isOperational || !config.isProduction ? err.message : 'Internal server error.';

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(!config.isProduction && !isOperational ? { stack: err.stack } : {}),
  });
};
