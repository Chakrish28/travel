const { getPool } = require('../config/mysql');
const MongoUser = require('../models/User');
const Review = require('../models/Review');

// MySQL2 may return JSON columns as already-parsed objects
function safeParseJSON(val, fallback = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'object' && val !== null) return val;
  try { return JSON.parse(val || JSON.stringify(fallback)); } catch { return fallback; }
}

const userController = {
  async getProfile(req, res) {
    try {
      const pool = getPool();
      const userId = req.params.id || req.user.id;

      const [users] = await pool.query('SELECT id, name, email, location, bio, profile_picture, travel_interests, companion_score, completed_trips, cancelled_trips, total_reviews, avg_rating, safety_compliance, created_at, phone_number, guardian_name, guardian_phone FROM users WHERE id = ?', [userId]);
      if (!users.length) return res.status(404).json({ error: 'User not found.' });

      const user = users[0];
      user.travel_interests = safeParseJSON(user.travel_interests, []);

      // Upcoming trips
      const [upcomingTrips] = await pool.query(`
        SELECT t.* FROM trips t
        JOIN trip_members tm ON t.id = tm.trip_id
        WHERE tm.user_id = ? AND t.status IN ('upcoming', 'active')
        ORDER BY t.start_date ASC
      `, [userId]);

      // Reviews
      const reviews = await Review.find({ revieweeId: parseInt(userId) }).sort({ createdAt: -1 }).limit(10).lean();

      // Attach reviewer names from MySQL
      if (reviews.length > 0) {
        const reviewerIds = [...new Set(reviews.map(r => r.reviewerId))];
        const [reviewers] = await pool.query('SELECT id, name, profile_picture FROM users WHERE id IN (?)', [reviewerIds]);
        const reviewerMap = {};
        reviewers.forEach(r => reviewerMap[r.id] = r);
        
        for (const review of reviews) {
          review.reviewer = reviewerMap[review.reviewerId] || { name: 'Unknown User' };
        }
      }

      res.json({ user, upcomingTrips, reviews });
    } catch (err) {
      console.error('Profile error:', err);
      res.status(500).json({ error: 'Failed to load profile.' });
    }
  },

  async updateProfile(req, res) {
    try {
      const pool = getPool();
      const { name, location, bio, travelInterests, phone_number, guardian_name, guardian_phone } = req.body;

      await pool.query(
        'UPDATE users SET name = ?, location = ?, bio = ?, travel_interests = ?, phone_number = ?, guardian_name = ?, guardian_phone = ? WHERE id = ?',
        [name, location || '', bio || '', JSON.stringify(travelInterests || []), phone_number || '', guardian_name || '', guardian_phone || '', req.user.id]
      );

      await MongoUser.findOneAndUpdate(
        { mysqlId: req.user.id },
        { name, location: location || '', bio: bio || '', travelInterests: travelInterests || [] }
      );

      res.json({ message: 'Profile updated!' });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Update failed.' });
    }
  },

  async uploadProfilePicture(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

      const pool = getPool();
      const picturePath = `/uploads/${req.file.filename}`;

      await pool.query('UPDATE users SET profile_picture = ? WHERE id = ?', [picturePath, req.user.id]);
      await MongoUser.findOneAndUpdate({ mysqlId: req.user.id }, { profilePicture: picturePath });

      res.json({ message: 'Profile picture uploaded!', path: picturePath });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed.' });
    }
  },

  async recalculateScore(userId) {
    try {
      const pool = getPool();
      const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      if (!users.length) return;

      const user = users[0];

      // Base score: 50
      let score = 50;

      // Completed trips bonus: +3 per completed trip (max +15)
      score += Math.min(user.completed_trips * 3, 15);

      // Average rating bonus: up to +20
      if (user.total_reviews > 0) {
        score += (user.avg_rating / 5) * 20;
      }

      // Safety compliance bonus: up to +10
      score += (user.safety_compliance / 100) * 10;

      // Trip cancellation penalty: -5 per cancel (max -15)
      score -= Math.min(user.cancelled_trips * 5, 15);

      // Reports penalty
      const Report = require('../models/Report');
      const reportCount = await Report.countDocuments({ reportedId: userId, status: { $ne: 'resolved' } });
      score -= Math.min(reportCount * 5, 20);

      score = Math.max(0, Math.min(100, Math.round(score * 100) / 100));

      await pool.query('UPDATE users SET companion_score = ? WHERE id = ?', [score, userId]);

      return score;
    } catch (err) {
      console.error('Score recalc error:', err);
    }
  },

  async blockUser(req, res) {
    try {
      const pool = getPool();
      const { userId } = req.params;

      await pool.query(
        'INSERT IGNORE INTO blocked_users (blocker_id, blocked_id) VALUES (?, ?)',
        [req.user.id, userId]
      );

      res.json({ message: 'User blocked.' });
    } catch (err) {
      console.error('Block error:', err);
      res.status(500).json({ error: 'Block failed.' });
    }
  },

  async unblockUser(req, res) {
    try {
      const pool = getPool();
      const { userId } = req.params;

      await pool.query(
        'DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?',
        [req.user.id, userId]
      );

      res.json({ message: 'User unblocked.' });
    } catch (err) {
      console.error('Unblock error:', err);
      res.status(500).json({ error: 'Unblock failed.' });
    }
  },

  async getBlockedUsers(req, res) {
    try {
      const pool = getPool();
      const [blocked] = await pool.query(`
        SELECT u.id, u.name, u.profile_picture FROM blocked_users bu
        JOIN users u ON bu.blocked_id = u.id
        WHERE bu.blocker_id = ?
      `, [req.user.id]);

      res.json({ blocked });
    } catch (err) {
      console.error('Get blocked error:', err);
      res.status(500).json({ error: 'Failed to load blocked users.' });
    }
  },

  async searchUsers(req, res) {
    try {
      const pool = getPool();
      const { q } = req.query;
      if (!q) return res.json({ users: [] });

      // Get current user's interests for match calculation
      const [currentUserData] = await pool.query('SELECT travel_interests FROM users WHERE id = ?', [req.user.id]);
      const myInterests = safeParseJSON(currentUserData[0]?.travel_interests, []);

      const [users] = await pool.query(
        'SELECT id, name, email, location, profile_picture, companion_score, travel_interests FROM users WHERE (name LIKE ? OR location LIKE ?) AND id != ? AND is_blocked = FALSE LIMIT 20',
        [`%${q}%`, `%${q}%`, req.user.id]
      );

      users.forEach(u => {
        u.travel_interests = safeParseJSON(u.travel_interests, []);
        // Calculate match score
        if (myInterests.length > 0) {
          const overlap = myInterests.filter(i => u.travel_interests.includes(i));
          u.matchScore = Math.min(overlap.length * 20 + (u.companion_score / 5), 100);
          u.commonInterests = overlap;
        }
      });

      res.json({ users });
    } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ error: 'Search failed.' });
    }
  }
};

module.exports = userController;
