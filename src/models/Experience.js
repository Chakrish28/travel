const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  travelDate: { type: Date, default: null },
  photos: [String]
}, { timestamps: true });

experienceSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Experience', experienceSchema);
