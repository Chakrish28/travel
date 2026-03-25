const mongoose = require('mongoose');

const tripChatSchema = new mongoose.Schema({
  tripId: { type: Number, required: true },
  sender: { type: Number, required: true },
  senderName: { type: String, default: '' },
  message: { type: String, required: true }
}, { timestamps: true });

tripChatSchema.index({ tripId: 1, createdAt: -1 });

module.exports = mongoose.model('TripChat', tripChatSchema);
