const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  type: {
    type: String,
    enum: ['trip_invitation', 'join_request', 'request_accepted', 'request_rejected', 'chat_message', 'safety_alert', 'review', 'sos', 'trip_update', 'finalization'],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: String, default: '' },
  read: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
