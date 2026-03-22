const { getPool } = require('../config/mysql');
const MongoUser = require('../models/User');
const notificationService = require('../services/notificationService');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function sendTelegramMessage(chatId, message) {
  if (!chatId) return;
  if (TELEGRAM_BOT_TOKEN) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      if (res.ok) console.log(`✅ Telegram sent to ${chatId}`);
      else console.error(`❌ Telegram Error:`, await res.text());
    } catch (err) { console.error('Telegram request failed', err); }
  } else {
    console.log(`\n======================================================`);
    console.log(`📱 [MOCK TELEGRAM] To: ${chatId}`);
    console.log(`💬 Message: ${message}`);
    console.log(`======================================================\n`);
  }
}

const safetyController = {
  async checkIn(req, res) {
    try {
      const lat = req.body.lat ?? req.body.latitude ?? 0;
      const lng = req.body.lng ?? req.body.longitude ?? 0;

      await MongoUser.findOneAndUpdate(
        { mysqlId: req.user.id },
        { lastKnownLocation: { lat, lng, updatedAt: new Date() } }
      );

      const pool = getPool();
      await pool.query('UPDATE users SET safety_compliance = LEAST(safety_compliance + 1, 100) WHERE id = ?', [req.user.id]);

      res.json({ message: 'Check-in recorded. You are safe! ✅' });
    } catch (err) {
      console.error('Check-in error:', err);
      res.status(500).json({ error: 'Check-in failed.' });
    }
  },

  async sendSOS(req, res) {
    try {
      const { tripId, message } = req.body;
      const lat = req.body.lat ?? req.body.latitude ?? 0;
      const lng = req.body.lng ?? req.body.longitude ?? 0;
      const pool = getPool();

      // Update location
      await MongoUser.findOneAndUpdate(
        { mysqlId: req.user.id },
        { lastKnownLocation: { lat, lng, updatedAt: new Date() } }
      );

      // Fetch current user details
      const [[currentUser]] = await pool.query('SELECT name, guardian_phone FROM users WHERE id = ?', [req.user.id]);
      const locationLink = `https://maps.google.com/?q=${lat},${lng}`;

      // Notify all trip members
      const [members] = await pool.query(
        'SELECT tm.user_id, u.phone_number FROM trip_members tm JOIN users u ON tm.user_id = u.id WHERE tm.trip_id = ? AND tm.user_id != ?',
        [tripId, req.user.id]
      );

      for (const m of members) {
        await notificationService.sosAlert(m.user_id, req.user.name, tripId, lat, lng);
        if (m.phone_number) {
          await sendTelegramMessage(m.phone_number, `🚨 SOS ALERT! Your trip companion ${currentUser.name} has triggered an emergency SOS. Last location: ${locationLink}`);
        }
      }

      // Notify guardian
      if (currentUser.guardian_phone) {
        await sendTelegramMessage(currentUser.guardian_phone, `🚨 SOS ALERT! Your ward ${currentUser.name} has triggered an emergency SOS from their trip. Last known location: ${locationLink}`);
      }

      res.json({ message: 'SOS alert sent to all companions! 🚨' });
    } catch (err) {
      console.error('SOS error:', err);
      res.status(500).json({ error: 'SOS failed.' });
    }
  },

  async getTripSafety(req, res) {
    try {
      const { tripId } = req.params;
      const pool = getPool();

      const [members] = await pool.query(`
        SELECT tm.user_id, u.name, u.profile_picture
        FROM trip_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.trip_id = ?
      `, [tripId]);

      // Get last locations from MongoDB
      const memberIds = members.map(m => m.user_id);
      const mongoUsers = await MongoUser.find({ mysqlId: { $in: memberIds } });
      const locationMap = {};
      mongoUsers.forEach(u => { locationMap[u.mysqlId] = u.lastKnownLocation; });

      const safetyData = members.map(m => ({
        ...m,
        lastLocation: locationMap[m.user_id] || null,
        isOverdue: locationMap[m.user_id]?.updatedAt
          ? (Date.now() - new Date(locationMap[m.user_id].updatedAt).getTime()) > (parseInt(process.env.SAFETY_CHECKIN_INTERVAL || 60) * 60000)
          : true
      }));

      res.json({ safety: safetyData });
    } catch (err) {
      console.error('Safety error:', err);
      res.status(500).json({ error: 'Failed to load safety data.' });
    }
  },

  async updateLocation(req, res) {
    try {
      const lat = req.body.lat ?? req.body.latitude ?? 0;
      const lng = req.body.lng ?? req.body.longitude ?? 0;

      await MongoUser.findOneAndUpdate(
        { mysqlId: req.user.id },
        { lastKnownLocation: { lat, lng, updatedAt: new Date() } }
      );

      res.json({ message: 'Location updated.' });
    } catch (err) {
      console.error('Location error:', err);
      res.status(500).json({ error: 'Update failed.' });
    }
  },

  // Auto-check for missed check-ins on active trips and alert companions
  async autoCheckMissedCheckIns() {
    try {
      const pool = getPool();
      const intervalMinutes = parseInt(process.env.SAFETY_CHECKIN_INTERVAL || 60);

      // Get all active trips with their members
      const [activeTrips] = await pool.query(
        "SELECT id, destination FROM trips WHERE status = 'active'"
      );

      for (const trip of activeTrips) {
        const [members] = await pool.query(
          'SELECT tm.user_id, u.name FROM trip_members tm JOIN users u ON tm.user_id = u.id WHERE tm.trip_id = ?',
          [trip.id]
        );

        const memberIds = members.map(m => m.user_id);
        const mongoUsers = await MongoUser.find({ mysqlId: { $in: memberIds } });
        const locationMap = {};
        mongoUsers.forEach(u => { locationMap[u.mysqlId] = u.lastKnownLocation; });

        for (const member of members) {
          const loc = locationMap[member.user_id];
          if (!loc || !loc.updatedAt) continue;

          const [[uData]] = await pool.query('SELECT phone_number, guardian_phone, guardian_name FROM users WHERE id = ?', [member.user_id]);
          const diffMinutes = (Date.now() - new Date(loc.updatedAt).getTime()) / 60000;

          if (diffMinutes > intervalMinutes) {
            const locationStr = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;

            // Grace period logic (e.g. 15 minutes)
            if (diffMinutes <= intervalMinutes + 15) {
              // Warning Phase: Send to User
              if (uData.phone_number) {
                await sendTelegramMessage(uData.phone_number, `⚠️ Buddy Hub Safety Alert: You missed your check-in on the trip to ${trip.destination}! Please open the app and check in immediately.`);
              }
            } else {
              // Escalated Phase: Send to Guardian & Companions
              if (uData.guardian_phone) {
                await sendTelegramMessage(uData.guardian_phone, `🚨 URGENT: ${member.name} missed their safety check-in! Last known location: ${locationStr}`);
              }
              
              // Send safety alert to all other companions
              const otherMembers = members.filter(m => m.user_id !== member.user_id);
              for (const companion of otherMembers) {
                await notificationService.create(
                  companion.user_id,
                  'safety_alert',
                  'Missed Check-In Alert',
                  `⚠️ ${member.name} missed their safety check-in. Last known location: <a href="${locationStr}" target="_blank" onclick="event.stopPropagation()" style="color:var(--primary);text-decoration:underline;">View on Maps</a>`,
                  trip.id
                );
              }

              // Decrease safety compliance
              await pool.query(
                'UPDATE users SET safety_compliance = GREATEST(safety_compliance - 5, 0) WHERE id = ?',
                [member.user_id]
              );
            }
          }
        }
      }
    } catch (err) {
      console.error('Auto check-in scan error:', err);
    }
  }
};

module.exports = safetyController;
