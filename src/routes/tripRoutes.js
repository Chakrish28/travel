const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const tripController = require('../controllers/tripController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../public/uploads')),
  filename: (req, file, cb) => cb(null, `trip-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', auth, upload.single('cover_image'), tripController.createTrip);
router.get('/my', auth, tripController.getMyTrips);
router.get('/explore', auth, tripController.exploreTrips);
router.get('/requests', auth, tripController.getMyRequests);
router.get('/:id', auth, tripController.getTrip);
router.put('/:id', auth, tripController.updateTrip);
router.delete('/:id', auth, tripController.cancelTrip);
router.post('/:tripId/join', auth, tripController.requestToJoin);
router.post('/:tripId/invite', auth, tripController.inviteUser);
router.post('/requests/:requestId', auth, tripController.handleRequest);
router.post('/:tripId/finalize', auth, tripController.proposeFinalDates);
router.post('/:tripId/finalize/vote', auth, tripController.voteFinalDates);
router.get('/:tripId/finalize', auth, tripController.getFinalization);
router.delete('/:tripId/members/:userId', auth, tripController.removeMember);
router.post('/:tripId/toggle-requests', auth, tripController.toggleRequests);
router.post('/:tripId/start', auth, tripController.startTrip);
router.post('/:tripId/complete', auth, tripController.completeTrip);
router.delete('/:tripId/delete', auth, tripController.deleteTrip);

module.exports = router;
