require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');

const connectMongo = require('./config/mongo');
const { connectMySQL } = require('./config/mysql');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');
const chatRoutes = require('./routes/chatRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const safetyRoutes = require('./routes/safetyRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const tripController = require('./controllers/tripController');
const safetyController = require('./controllers/safetyController');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/experiences', experienceRoutes);

// SPA Fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  }
});

// Cron: Auto-update trip statuses every hour
cron.schedule('0 * * * *', () => {
  console.log('🔄 Running trip status auto-update...');
  tripController.autoUpdateTripStatus();
});

// Start server
const startServer = async () => {
  // Connect databases first
  try {
    await connectMongo();
  } catch (err) {
    console.warn('⚠️  MongoDB not connected - API features requiring MongoDB will be unavailable.');
    console.warn('   Update MONGO_URI in .env with your MongoDB Atlas connection string.');
  }

  try {
    await connectMySQL();
  } catch (err) {
    console.warn('⚠️  MySQL not connected - API features requiring MySQL will be unavailable.');
    console.warn('   Update MySQL settings in .env with your database credentials.');
  }

  // Start HTTP server after taking care of DBs to prevent race condition crashes
  app.listen(PORT, () => {
    console.log(`\n🚀 Buddy Hub server running on http://localhost:${PORT}\n`);
  });
};

startServer();
