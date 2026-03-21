const mysql = require('mysql2/promise');

let pool;

const connectMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl: process.env.MYSQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    console.log('✅ MySQL connected');
    conn.release();

    await initTables();
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    throw err;
  }
};

const initTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      location VARCHAR(200) DEFAULT '',
      bio TEXT,
      profile_picture VARCHAR(500) DEFAULT '',
      travel_interests JSON DEFAULT NULL,
      companion_score DECIMAL(5,2) DEFAULT 50.00,
      completed_trips INT DEFAULT 0,
      cancelled_trips INT DEFAULT 0,
      total_reviews INT DEFAULT 0,
      avg_rating DECIMAL(3,2) DEFAULT 0.00,
      safety_compliance INT DEFAULT 100,
      is_blocked BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS trips (
      id INT AUTO_INCREMENT PRIMARY KEY,
      host_id INT NOT NULL,
      destination VARCHAR(300) NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      trip_type ENUM('duo', 'group') DEFAULT 'duo',
      budget DECIMAL(12,2) DEFAULT 0.00,
      travel_style VARCHAR(100) DEFAULT '',
      max_participants INT DEFAULT 2,
      status ENUM('draft', 'invited', 'upcoming', 'active', 'completed', 'cancelled') DEFAULT 'draft',
      cover_image VARCHAR(500) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS trip_members (
      id INT AUTO_INCREMENT PRIMARY KEY,
      trip_id INT NOT NULL,
      user_id INT NOT NULL,
      role ENUM('host', 'member') DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_trip_member (trip_id, user_id)
    )`,

    `CREATE TABLE IF NOT EXISTS trip_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      trip_id INT NOT NULL,
      user_id INT NOT NULL,
      status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
      type ENUM('join_request', 'invitation') DEFAULT 'join_request',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      trip_id INT NOT NULL,
      paid_by INT NOT NULL,
      amount DECIMAL(12,2) NOT NULL,
      description VARCHAR(500) DEFAULT '',
      split_between JSON NOT NULL,
      owes_details JSON DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
      FOREIGN KEY (paid_by) REFERENCES users(id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS blocked_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      blocker_id INT NOT NULL,
      blocked_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_block (blocker_id, blocked_id)
    )`
  ];

  for (const q of queries) {
    await pool.query(q);
  }
  
  // Add new columns to existing tables
  try {
    await pool.query('ALTER TABLE trips ADD COLUMN requests_closed BOOLEAN DEFAULT FALSE');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (requests_closed):', err.message);
  }

  try {
    await pool.query("ALTER TABLE trips ADD COLUMN currency VARCHAR(5) DEFAULT 'USD'");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (currency):', err.message);
  }

  try {
    await pool.query("ALTER TABLE trips ADD COLUMN from_location VARCHAR(300) DEFAULT ''");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (from_location):', err.message);
  }

  try {
    await pool.query("ALTER TABLE trips ADD COLUMN itinerary JSON DEFAULT NULL");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (itinerary):', err.message);
  }

  // Safety & Emergency fields
  try {
    await pool.query("ALTER TABLE users ADD COLUMN phone_number VARCHAR(20) DEFAULT ''");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (phone_number):', err.message);
  }

  try {
    await pool.query("ALTER TABLE users ADD COLUMN guardian_name VARCHAR(100) DEFAULT ''");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (guardian_name):', err.message);
  }

  try {
    await pool.query("ALTER TABLE users ADD COLUMN guardian_phone VARCHAR(20) DEFAULT ''");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (guardian_phone):', err.message);
  }

  try {
    await pool.query("ALTER TABLE expenses ADD COLUMN owes_details JSON DEFAULT NULL");
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error (owes_details):', err.message);
  }

  console.log('✅ MySQL tables initialized');
};

const getPool = () => pool;

module.exports = { connectMySQL, getPool };
