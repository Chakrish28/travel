const Experience = require('../models/Experience');
const Report = require('../models/Report');

const experienceController = {
  async createExperience(req, res) {
    try {
      const { title, description, location, travelDate } = req.body;
      const photos = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

      const exp = await Experience.create({
        userId: req.user.id,
        title,
        description: description || '',
        location: location || '',
        travelDate: travelDate || null,
        photos
      });

      res.status(201).json({ message: 'Experience shared!', experience: exp });
    } catch (err) {
      console.error('Experience error:', err);
      res.status(500).json({ error: 'Failed to share experience.' });
    }
  },

  async getMyExperiences(req, res) {
    try {
      const experiences = await Experience.find({ userId: req.user.id })
        .sort({ createdAt: -1 });

      res.json({ experiences });
    } catch (err) {
      console.error('Get experiences error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async getUserExperiences(req, res) {
    try {
      const { userId } = req.params;
      const experiences = await Experience.find({ userId: parseInt(userId) })
        .sort({ createdAt: -1 });

      res.json({ experiences });
    } catch (err) {
      console.error('Get user experiences error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async getAllExperiences(req, res) {
    try {
      const experiences = await Experience.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      // Attach user names
      if (experiences.length) {
        const { getPool } = require('../config/mysql');
        const pool = getPool();
        const userIds = [...new Set(experiences.map(e => e.userId))];
        const [users] = await pool.query('SELECT id, name, profile_picture FROM users WHERE id IN (?)', [userIds]);
        const userMap = {};
        users.forEach(u => { userMap[u.id] = u; });
        experiences.forEach(e => { e.user = userMap[e.userId] || { name: 'Unknown' }; });
      }

      res.json({ experiences });
    } catch (err) {
      console.error('All experiences error:', err);
      res.status(500).json({ error: 'Failed.' });
    }
  },

  async reportUser(req, res) {
    try {
      const { reportedId, reason, description } = req.body;

      await Report.create({
        reporterId: req.user.id,
        reportedId,
        reason,
        description: description || ''
      });

      // Recalculate reported user score
      const userController = require('./userController');
      await userController.recalculateScore(reportedId);

      res.status(201).json({ message: 'Report submitted.' });
    } catch (err) {
      console.error('Report error:', err);
      res.status(500).json({ error: 'Report failed.' });
    }
  },

  async updateExperience(req, res) {
    try {
      const { id } = req.params;
      const exp = await Experience.findById(id);
      if (!exp) return res.status(404).json({ error: 'Experience not found.' });
      if (exp.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });

      const { title, description, location, travelDate } = req.body;
      if (title) exp.title = title;
      if (description !== undefined) exp.description = description;
      if (location !== undefined) exp.location = location;
      if (travelDate !== undefined) exp.travelDate = travelDate || null;

      // Handle new photos if uploaded
      if (req.files && req.files.length) {
        const newPhotos = req.files.map(f => `/uploads/${f.filename}`);
        exp.photos = newPhotos;
      }

      await exp.save();
      res.json({ message: 'Experience updated!', experience: exp });
    } catch (err) {
      console.error('Update experience error:', err);
      res.status(500).json({ error: 'Update failed.' });
    }
  },

  async deleteExperience(req, res) {
    try {
      const { id } = req.params;
      const exp = await Experience.findById(id);
      if (!exp) return res.status(404).json({ error: 'Experience not found.' });
      if (exp.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });

      await Experience.findByIdAndDelete(id);
      res.json({ message: 'Experience deleted.' });
    } catch (err) {
      console.error('Delete experience error:', err);
      res.status(500).json({ error: 'Delete failed.' });
    }
  }
};

module.exports = experienceController;
