const AppError = require('../utils/AppError');
const config = require('../config/env');

/**
 * Validates the payload for POST /ai/get-review.
 * Kept dependency-free (no schema library) to keep the backend lightweight;
 * swap for Joi/Zod easily if validation needs grow.
 */
function validateReviewRequest(req, res, next) {
  const { code } = req.body || {};

  if (code === undefined || code === null) {
    return next(new AppError('The "code" field is required.', 400));
  }

  if (typeof code !== 'string') {
    return next(new AppError('The "code" field must be a string.', 400));
  }

  const trimmed = code.trim();

  if (trimmed.length === 0) {
    return next(new AppError('The "code" field cannot be empty.', 400));
  }

  if (trimmed.length > config.review.maxCodeLength) {
    return next(
      new AppError(
        `Code submission exceeds the maximum allowed length of ${config.review.maxCodeLength} characters.`,
        413
      )
    );
  }

  req.body.code = trimmed;
  next();
}

module.exports = { validateReviewRequest };
