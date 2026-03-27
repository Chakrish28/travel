const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

// Private chat
router.get('/conversations', auth, chatController.getConversations);
router.get('/private/:userId', auth, chatController.getPrivateMessages);
router.post('/private', auth, chatController.sendPrivateMessage);

// Trip group chat
router.get('/trip/:tripId', auth, chatController.getTripMessages);
router.post('/trip/:tripId', auth, chatController.sendTripMessage);

module.exports = router;
