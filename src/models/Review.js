const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tripId: { type: Number, required: true },
  reviewerId: { type: Number, required: true },
  revieweeId: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, { timestamps: true });

reviewSchema.index({ revieweeId: 1, createdAt: -1 });
reviewSchema.index({ tripId: 1, reviewerId: 1, revieweeId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
