const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  userName: { type: String, default: '' },
  vote: { type: String, enum: ['accept', 'reject'], required: true },
  comment: { type: String, default: '' },
  votedAt: { type: Date, default: Date.now }
}, { _id: false });

const finalizationSchema = new mongoose.Schema({
  tripId: { type: Number, required: true },
  proposedBy: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  budget: { type: Number, default: 0 },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  votes: [voteSchema],
  totalVoters: { type: Number, default: 0 }
}, { timestamps: true });

finalizationSchema.index({ tripId: 1, status: 1 });

module.exports = mongoose.model('Finalization', finalizationSchema);
