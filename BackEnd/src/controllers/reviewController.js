const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/reviews
 * Returns review history of the currently logged-in user.
 */
const getReviewHistory = catchAsync(async (req, res) => {
  const reviews = await Review.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .select('language code review score createdAt updatedAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: {
      reviews,
    },
  });
});

module.exports = {
  getReviewHistory,
};