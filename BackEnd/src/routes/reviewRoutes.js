const express = require('express');

const reviewController = require('../controllers/reviewController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes below require a valid JWT
router.use(protect);

/**
 * GET /api/reviews
 * Get review history of the currently logged-in user
 */
router.get('/', reviewController.getReviewHistory);

module.exports = router;