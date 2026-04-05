const Review = require('../models/Review');
const { getPool } = require('../config/mysql');
const notificationService = require('../services/notificationService');

const reviewController = {
  async createReview(req, res) {
    try {
      const { tripId, revieweeId, rating, comment } = req.body;
      const pool = getPool();

      // Check trip is completed
      const [trips] = await pool.query('SELECT status FROM trips WHERE id = ?', [tripId]);
      if (!trips.length || trips[0].status !== 'completed') {
        return res.status(400).json({ error: 'Can only review after trip completion.' });
      }

      // Check both users were members
      const [reviewer] = await pool.query('SELECT id FROM trip_members WHERE trip_id = ? AND user_id = ?', [tripId, req.user.id]);
      const [reviewee] = await pool.query('SELECT id FROM trip_members WHERE trip_id = ? AND user_id = ?', [tripId, revieweeId]);

      if (!reviewer.length || !reviewee.length) {
        return res.status(400).json({ error: 'Both users must be trip members.' });
      }

      // Prevent duplicate
      const existing = await Review.findOne({ tripId, reviewerId: req.user.id, revieweeId });
      if (existing) {
        return res.status(400).json({ error: 'You already reviewed this user for this trip.' });
      }

      await Review.create({
        tripId,
        reviewerId: req.user.id,
        revieweeId,
        rating,
        comment: comment || ''
      });

      // Update average rating for reviewee
      const avgResult = await Review.aggregate([
        { $match: { revieweeId } },
        { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);

      if (avgResult.length) {
        await pool.query('UPDATE users SET avg_rating = ?, total_reviews = ? WHERE id = ?',
          [Math.round(avgResult[0].avg * 100) / 100, avgResult[0].count, revieweeId]
        );
      }

      // Recalculate companion score
      const userController = require('./userController');
      await userController.recalculateScore(revieweeId);

      await notificationService.newReview(revieweeId, req.user.name);

      res.status(201).json({ message: 'Review submitted!' });
    } catch (err) {
      console.error('Review error:', err);
      res.status(500).json({ error: 'Review failed.' });
    }
  },

  async getUserReviews(req, res) {
    try {
      const { userId } = req.params;
      const reviews = await Review.find({ revieweeId: parseInt(userId) })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      // Get reviewer names
      if (reviews.length) {
        const pool = getPool();
        const reviewerIds = [...new Set(reviews.map(r => r.reviewerId))];
        const [users] = await pool.query('SELECT id, name, profile_picture FROM users WHERE id IN (?)', [reviewerIds]);
        const userMap = {};
        users.forEach(u => { userMap[u.id] = u; });
        reviews.forEach(r => { r.reviewer = userMap[r.reviewerId] || { name: 'Unknown' }; });
      }

      res.json({ reviews });
    } catch (err) {
      console.error('Get reviews error:', err);
      res.status(500).json({ error: 'Failed to load reviews.' });
    }
  },

  async getTripReviews(req, res) {
    try {
      const { tripId } = req.params;
      const reviews = await Review.find({ tripId: parseInt(tripId) }).sort({ createdAt: -1 }).lean();

      if (reviews.length) {
        const pool = getPool();
        const userIds = [...new Set([...reviews.map(r => r.reviewerId), ...reviews.map(r => r.revieweeId)])];
        const [users] = await pool.query('SELECT id, name, profile_picture FROM users WHERE id IN (?)', [userIds]);
        const userMap = {};
        users.forEach(u => { userMap[u.id] = u; });
        reviews.forEach(r => {
          r.reviewer = userMap[r.reviewerId] || { name: 'Unknown' };
          r.reviewee = userMap[r.revieweeId] || { name: 'Unknown' };
        });
      }

      res.json({ reviews });
    } catch (err) {
      console.error('Trip reviews error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  }
};

module.exports = reviewController;
