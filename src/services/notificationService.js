const Notification = require('../models/Notification');

const notificationService = {
  async create(userId, type, title, message, relatedId = '') {
    try {
      await Notification.create({ userId, type, title, message, relatedId: String(relatedId) });
    } catch (err) {
      console.error('Notification error:', err.message);
    }
  },

  async tripInvitation(userId, tripId, hostName, destination) {
    await this.create(userId, 'trip_invitation', 'Trip Invitation',
      `${hostName} invited you to join a trip to ${destination}`, tripId);
  },

  async joinRequest(hostId, tripId, userName, destination) {
    await this.create(hostId, 'join_request', 'Join Request',
      `${userName} requested to join your trip to ${destination}`, tripId);
  },

  async requestAccepted(userId, tripId, destination) {
    await this.create(userId, 'request_accepted', 'Request Accepted',
      `Your request to join the trip to ${destination} was accepted!`, tripId);
  },

  async requestRejected(userId, tripId, destination) {
    await this.create(userId, 'request_rejected', 'Request Rejected',
      `Your request to join the trip to ${destination} was rejected.`, tripId);
  },

  async safetyAlert(userId, userName, tripId) {
    await this.create(userId, 'safety_alert', 'Safety Alert',
      `${userName} has not checked in. Check their last known location.`, tripId);
  },

  async sosAlert(userId, userName, tripId, lat, lng) {
    const locStr = lat && lng ? `<a href="https://maps.google.com/?q=${lat},${lng}" target="_blank" onclick="event.stopPropagation()" style="color:var(--primary);text-decoration:underline;">View on Google Maps</a>` : 'Unknown';
    await this.create(userId, 'sos', 'SOS Alert',
      `🚨 ${userName} triggered an SOS alert! Location: ${locStr}`, tripId);
  },

  async newReview(userId, reviewerName) {
    await this.create(userId, 'review', 'New Review',
      `${reviewerName} left you a review.`);
  },

  async tripUpdate(userId, tripId, message) {
    await this.create(userId, 'trip_update', 'Trip Update', message, tripId);
  },

  async finalizationProposal(userId, tripId, hostName, destination) {
    await this.create(userId, 'finalization', 'Trip Finalization Proposal',
      `${hostName} proposed final dates for the trip to ${destination}. Please review and vote.`, tripId);
  },

  async finalizationVote(hostId, tripId, userName, vote, destination) {
    const status = vote === 'accept' ? 'accepted' : 'rejected';
    await this.create(hostId, 'finalization', 'Finalization Vote',
      `${userName} ${status} the finalization proposal for the trip to ${destination}.`, tripId);
  },

  async finalizationComplete(userId, tripId, destination) {
    await this.create(userId, 'finalization', 'Trip Finalized! ✅',
      `All companions agreed! The trip to ${destination} has been finalized.`, tripId);
  },

  async memberRemoved(userId, tripId, destination) {
    await this.create(userId, 'trip_update', 'Removed from Trip',
      `You have been removed from the trip to ${destination}.`, tripId);
  }
};

module.exports = notificationService;
