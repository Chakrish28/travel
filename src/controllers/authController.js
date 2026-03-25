const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../config/mysql');
const MongoUser = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { name, email, password, location, travelInterests } = req.body;

      // Validate required fields
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required.' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const pool = getPool();
      if (!pool) {
        return res.status(503).json({ error: 'Database is not available. Please try again later.' });
      }

      // Check existing
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length) {
        return res.status(400).json({ error: 'Email already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, location, travel_interests) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, location || '', JSON.stringify(travelInterests || [])]
      );

      // Create MongoDB companion document (non-blocking — don't fail registration if Mongo is down)
      try {
        await MongoUser.create({
          mysqlId: result.insertId,
          name,
          email,
          location: location || '',
          travelInterests: travelInterests || []
        });
      } catch (mongoErr) {
        console.warn('⚠️  MongoDB user doc not created (MongoDB may be offline):', mongoErr.message);
      }

      const token = jwt.sign({ id: result.insertId, email, name }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        message: 'Registration successful!',
        token,
        user: { id: result.insertId, name, email, location: location || '' }
      });
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required.' });
      }
      if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
      }

      const pool = getPool();
      if (!pool) {
        return res.status(503).json({ error: 'Database is not available. Please try again later.' });
      }

      const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (!users.length) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const user = users[0];
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Login successful!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
          profile_picture: user.profile_picture,
          companion_score: user.companion_score
        }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed. Please try again.' });
    }
  }
};

module.exports = authController;
