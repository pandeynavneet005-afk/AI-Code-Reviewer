const express = require('express');
const aiController = require('../controllers/ai.controller');
const { validateReviewRequest } = require('../validators/review.validator');
const { reviewRateLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

router.post('/get-review', validateReviewRequest, aiController.getReview);

module.exports = router;
