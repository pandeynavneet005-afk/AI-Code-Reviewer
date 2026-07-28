/**
 * Represents a known, "operational" error (bad input, upstream failure, etc.)
 * as opposed to an unexpected programming error. The global error handler
 * uses `isOperational` to decide how much detail is safe to expose.
 */
class AppError extends Error {
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
