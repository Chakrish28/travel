const Message = require('../models/Message');
const TripChat = require('../models/TripChat');
const { getPool } = require('../config/mysql');
const { encrypt, decrypt } = require('../utils/encryption');

const chatController = {
  // Private Chat
  async sendPrivateMessage(req, res) {
    try {
      const { receiverId, message } = req.body;
      const pool = getPool();

      // Check if blocked
      const [blocked] = await pool.query(
        'SELECT id FROM blocked_users WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)',
        [req.user.id, receiverId, receiverId, req.user.id]
      );
      if (blocked.length) {
        return res.status(403).json({ error: 'Cannot send message to this user.' });
      }

      // Encrypt the message before storing
      const encryptedMessage = encrypt(message);

      const msg = await Message.create({
        sender: req.user.id,
        receiver: parseInt(receiverId),
        message: encryptedMessage
      });

      res.status(201).json({ message: 'Message sent!', data: msg });
    } catch (err) {
      console.error('Send message error:', err);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  },

  async getPrivateMessages(req, res) {
    try {
      const { userId } = req.params;
      const messages = await Message.find({
        $or: [
          { sender: req.user.id, receiver: parseInt(userId) },
          { sender: parseInt(userId), receiver: req.user.id }
        ]
      }).sort({ createdAt: 1 }).limit(100);

      // Mark as read
      await Message.updateMany(
        { sender: parseInt(userId), receiver: req.user.id, read: false },
        { read: true }
      );

      // Decrypt messages before sending to client
      const decryptedMessages = messages.map(m => {
        const obj = m.toObject();
        obj.message = decrypt(obj.message);
        return obj;
      });

      res.json({ messages: decryptedMessages });
    } catch (err) {
      console.error('Get messages error:', err);
      res.status(500).json({ error: 'Failed to load messages.' });
    }
  },

  async getConversations(req, res) {
    try {
      const userId = req.user.id;

      const conversations = await Message.aggregate([
        { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: {
              $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender']
            },
            lastMessage: { $first: '$message' },
            lastTime: { $first: '$createdAt' },
            unread: {
              $sum: {
                $cond: [{ $and: [{ $ne: ['$sender', userId] }, { $eq: ['$read', false] }] }, 1, 0]
              }
            }
          }
        },
        { $sort: { lastTime: -1 } }
      ]);

      // Get user names
      if (conversations.length) {
        const pool = getPool();
        const userIds = conversations.map(c => c._id);
        const [users] = await pool.query(
          'SELECT id, name, profile_picture FROM users WHERE id IN (?)',
          [userIds]
        );
        const userMap = {};
        users.forEach(u => { userMap[u.id] = u; });

        conversations.forEach(c => {
          c.user = userMap[c._id] || { name: 'Unknown', profile_picture: '' };
          // Decrypt last message preview
          c.lastMessage = decrypt(c.lastMessage);
        });
      }

      res.json({ conversations });
    } catch (err) {
      console.error('Get conversations error:', err);
      res.status(500).json({ error: 'Failed to load conversations.' });
    }
  },

  // Trip Group Chat
  async sendTripMessage(req, res) {
    try {
      const { tripId } = req.params;
      const { message } = req.body;
      const pool = getPool();

      // Check membership
      const [member] = await pool.query(
        'SELECT id FROM trip_members WHERE trip_id = ? AND user_id = ?',
        [tripId, req.user.id]
      );
      if (!member.length) {
        return res.status(403).json({ error: 'You are not a member of this trip.' });
      }

      // Encrypt the message before storing
      const encryptedMessage = encrypt(message);

      const msg = await TripChat.create({
        tripId: parseInt(tripId),
        sender: req.user.id,
        senderName: req.user.name,
        message: encryptedMessage
      });

      res.status(201).json({ message: 'Message sent!', data: msg });
    } catch (err) {
      console.error('Trip message error:', err);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  },

  async getTripMessages(req, res) {
    try {
      const { tripId } = req.params;
      const pool = getPool();

      // Check membership
      const [member] = await pool.query(
        'SELECT id FROM trip_members WHERE trip_id = ? AND user_id = ?',
        [tripId, req.user.id]
      );
      if (!member.length) {
        return res.status(403).json({ error: 'Not a trip member.' });
      }

      const messages = await TripChat.find({ tripId: parseInt(tripId) })
        .sort({ createdAt: 1 })
        .limit(200);

      // Decrypt messages before sending to client
      const decryptedMessages = messages.map(m => {
        const obj = m.toObject();
        obj.message = decrypt(obj.message);
        return obj;
      });

      res.json({ messages: decryptedMessages });
    } catch (err) {
      console.error('Get trip messages error:', err);
      res.status(500).json({ error: 'Failed to load messages.' });
    }
  }
};

module.exports = chatController;
