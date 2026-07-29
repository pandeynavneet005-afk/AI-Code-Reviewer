const aiService = require('../services/ai.service');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');
const Review = require('../models/Review');

/**
 * POST /ai/get-review
 * Body: {
 *   code: string,
 *   language?: string
 * }
 */
const getReview = catchAsync(async (req, res) => {
  const { code, language = 'javascript' } = req.body;

  // Generate the AI review
  const review = await aiService.generateReview(code);

  // Try to extract a score such as "Score: 8/10"
  // from the AI-generated review.
  let score = null;

  const scoreMatch = review.match(/(?:score[:\s]*)?(\d+(?:\.\d+)?)\s*\/\s*10/i);

  if (scoreMatch) {
    const parsedScore = Number(scoreMatch[1]);

    if (parsedScore >= 0 && parsedScore <= 10) {
      score = parsedScore;
    }
  }

  // Save the review in MongoDB.
  // req.user is provided by authMiddleware.
  const savedReview = await Review.create({
    user: req.user._id,
    language,
    code,
    review,
    score,
  });

  logger.info(
    `Review generated and saved successfully (${code.length} chars submitted).`
  );

  res.status(200).json({
    success: true,
    data: {
      review,
      reviewId: savedReview._id,
      score: savedReview.score,
      createdAt: savedReview.createdAt,
    },
  });
});

module.exports = { getReview };