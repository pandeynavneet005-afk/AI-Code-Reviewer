const aiService = require('../services/ai.service');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

/**
 * POST /ai/get-review
 * Body: { code: string }
 */
const getReview = catchAsync(async (req, res) => {
  const { code } = req.body;

  const review = await aiService.generateReview(code);

  logger.info(`Review generated successfully (${code.length} chars submitted).`);

  res.status(200).json({
    success: true,
    data: { review },
  });
});

module.exports = { getReview };
