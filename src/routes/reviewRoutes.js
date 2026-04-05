const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

router.post('/', auth, reviewController.createReview);
router.get('/user/:userId', auth, reviewController.getUserReviews);
router.get('/trip/:tripId', auth, reviewController.getTripReviews);

module.exports = router;
