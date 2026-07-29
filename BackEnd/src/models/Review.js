const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
      default: 'javascript',
    },

    code: {
      type: String,
      required: true,
    },

    review: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Newest reviews first
reviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);