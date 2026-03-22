const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const safetyController = require('../controllers/safetyController');

router.post('/checkin', auth, safetyController.checkIn);
router.post('/sos', auth, safetyController.sendSOS);
router.get('/trip/:tripId', auth, safetyController.getTripSafety);
router.post('/location', auth, safetyController.updateLocation);

module.exports = router;
