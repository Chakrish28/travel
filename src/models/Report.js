const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: { type: Number, required: true },
  reportedId: { type: Number, required: true },
  reason: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
