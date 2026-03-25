const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: Number, required: true },
  receiver: { type: Number, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
