const express = require('express');
const aiController = require('../controllers/ai.controller');
const { validateReviewRequest } = require('../validators/review.validator');
const { reviewRateLimiter } = require('../middlewares/rateLimiter');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// AI code review is available only to logged-in users
router.post(
  '/get-review',
  authMiddleware,
  reviewRateLimiter,
  validateReviewRequest,
  aiController.getReview
);

module.exports = router;