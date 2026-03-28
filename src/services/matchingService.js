const { getPool } = require('../config/mysql');

function safeParseJSON(val, fallback = []) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'object' && val !== null) return val;
  try { return JSON.parse(val || JSON.stringify(fallback)); } catch { return fallback; }
}

const matchingService = {
  async findMatches(userId) {
    const pool = getPool();

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user.length) return [];

    const currentUser = user[0];
    const interests = safeParseJSON(currentUser.travel_interests, []);

    // Find users with overlapping travel interests
    const [allUsers] = await pool.query(
      'SELECT * FROM users WHERE id != ? AND is_blocked = FALSE ORDER BY companion_score DESC',
      [userId]
    );

    // Check for blocked relationships
    const [blocks] = await pool.query(
      'SELECT blocked_id FROM blocked_users WHERE blocker_id = ? UNION SELECT blocker_id FROM blocked_users WHERE blocked_id = ?',
      [userId, userId]
    );
    const blockedIds = new Set(blocks.map(b => b.blocked_id || b.blocker_id));

    const matches = allUsers
      .filter(u => !blockedIds.has(u.id))
      .map(u => {
        const theirInterests = safeParseJSON(u.travel_interests, []);
        const overlap = interests.filter(i => theirInterests.includes(i));
        const score = overlap.length * 20 + (u.companion_score / 5);
        return { ...u, matchScore: Math.min(score, 100), commonInterests: overlap };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20);

    return matches;
  },

  async findTripsForUser(userId) {
    const pool = getPool();

    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user.length) return [];

    const interests = safeParseJSON(user[0].travel_interests, []);

    const [trips] = await pool.query(`
      SELECT t.*, u.name as host_name, u.profile_picture as host_picture,
        (SELECT COUNT(*) FROM trip_members WHERE trip_id = t.id) as member_count
      FROM trips t
      JOIN users u ON t.host_id = u.id
      WHERE t.status IN ('draft', 'invited', 'upcoming')
        AND t.host_id != ?
        AND t.id NOT IN (SELECT trip_id FROM trip_members WHERE user_id = ?)
        AND t.id NOT IN (SELECT trip_id FROM trip_requests WHERE user_id = ? AND status = 'pending')
      ORDER BY t.start_date ASC
    `, [userId, userId, userId]);

    return trips;
  }
};

module.exports = matchingService;
