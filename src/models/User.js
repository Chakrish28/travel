const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mysqlId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  travelInterests: [String],
  lastKnownLocation: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    updatedAt: { type: Date, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
